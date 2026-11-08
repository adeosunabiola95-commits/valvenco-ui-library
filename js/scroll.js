/**
 * Scroll motion for the Valvenco handoff.
 * Scenes run on vanilla Motion. The wheel uses the same smoothing as before:
 * Lenis lerp 0.08, and linked scenes catch up over 1s with an expo ease
 * (the old scrub: 1).
 *
 * Past 120px, scrolling down adds `is-scrolling-down` on <html>.
 * `.scroll-bar` slides up with that class (0.4s, power3.out).
 * Reveal: y 24 → 0, opacity 0 → 1, 0.9s, stagger 0.09, once at 82%.
 * Lines scaleX 0 → 1 from the left edge.
 * Parallax and stat depth travel from edge to edge, catching up over 1s.
 * Steps wipe with clip-path from 80% to 45%, catching up over 1s.
 */
import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.3.23/+esm";
import { animate, inView, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@14.10.1/+esm";

const SCROLL_DIRECTION_THRESHOLD = 120;
const SCROLLING_DOWN = "is-scrolling-down";
const EASE = [0.16, 1, 0.3, 1];
const SCRUB_DURATION = 1;

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function initScroll() {
  const lenis = setupLenis();
  if (!lenis) setupDirection();
  setupAnchorScroll(lenis);
  return lenis;
}

export function mountScrollScenes(root = document, { container } = {}) {
  const marker = root instanceof Element ? root : document.documentElement;
  if (marker.dataset.scrollScenes === "true") return;
  marker.dataset.scrollScenes = "true";

  const scope = root instanceof Element ? root : document;
  const reduced = reducedMotion();
  setupHeader(scope, container);
  setupReveals(reduced, scope, container);
  setupParallax(reduced, scope, container);
  setupStats(reduced, scope, container);
  setupSteps(reduced, scope, container);
}

export function playScrollExample(stage) {
  const content = stage.querySelector("[data-scroll-content]");
  if (!content) return;

  let lenis = null;
  let frame = 0;
  let stopped = false;

  if (!reducedMotion()) {
    lenis = new Lenis({
      wrapper: stage,
      content,
      autoRaf: false,
      smoothWheel: true,
      lerp: 0.08,
    });

    const raf = (time) => {
      if (stopped || !stage.isConnected) {
        stopped = true;
        cancelAnimationFrame(frame);
        lenis.destroy();
        return;
      }
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
  }

  let last = stage.scrollTop;
  stage.addEventListener(
    "scroll",
    () => {
      const position = stage.scrollTop;
      const direction = position > last ? 1 : position < last ? -1 : 0;
      last = position;
      if (position <= SCROLL_DIRECTION_THRESHOLD || direction === -1) {
        stage.classList.remove(SCROLLING_DOWN);
      } else if (direction === 1) {
        stage.classList.add(SCROLLING_DOWN);
      }
    },
    { passive: true },
  );

  mountScrollScenes(content, { container: stage });
}

function setupLenis() {
  if (reducedMotion()) return null;

  const lenis = new Lenis({ autoRaf: false, smoothWheel: true, lerp: 0.08 });
  lenis.on("scroll", ({ scroll: position, direction }) => {
    const root = document.documentElement;
    if (position <= SCROLL_DIRECTION_THRESHOLD || direction === -1) {
      root.classList.remove(SCROLLING_DOWN);
    } else if (direction === 1) {
      root.classList.add(SCROLLING_DOWN);
    }
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  return lenis;
}

function setupDirection() {
  const root = document.documentElement;
  let last = window.scrollY;

  const sync = () => {
    const position = window.scrollY;
    const direction = position > last ? 1 : position < last ? -1 : 0;
    last = position;
    if (position <= SCROLL_DIRECTION_THRESHOLD || direction === -1) {
      root.classList.remove(SCROLLING_DOWN);
    } else if (direction === 1) {
      root.classList.add(SCROLLING_DOWN);
    }
  };

  window.addEventListener("scroll", sync, { passive: true });
  sync();
}

function setupHeader(scope, container) {
  const header = scope.querySelector('[data-module="header"]');
  if (!header) return;

  const target = container || document.documentElement;
  const measure = () => {
    target.style.setProperty("--header-h", `${header.offsetHeight}px`);
  };

  measure();
  new ResizeObserver(measure).observe(header);
}

function viewOptions(container, margin) {
  const options = { margin };
  if (container) options.root = container;
  return options;
}

function sceneOptions(target, offset, container) {
  const options = { target, offset };
  if (container) options.container = container;
  return options;
}

function setupReveals(reduced, scope, container) {
  scope.querySelectorAll('[data-module="reveal"]').forEach((root) => {
    const marked = [
      ...(root.hasAttribute("data-reveal") || root.hasAttribute("data-reveal-line") ? [root] : []),
      ...root.querySelectorAll("[data-reveal], [data-reveal-line]"),
    ];
    const items = marked.length ? marked : [...root.children];
    if (!items.length) return;

    const lines = items.filter((item) => item.hasAttribute("data-reveal-line"));
    const blocks = items.filter((item) => !item.hasAttribute("data-reveal-line"));

    if (reduced) return;

    if (blocks.length) animate(blocks, { opacity: 0, y: 24 }, { duration: 0 });
    if (lines.length) {
      animate(lines, { opacity: 0, scaleX: 0 }, { duration: 0 });
      for (const line of lines) line.style.transformOrigin = "0% 50%";
    }

    inView(
      root,
      () => {
        const reveal = animate(
          items,
          { opacity: 1, y: 0, scaleX: 1 },
          { duration: 0.9, ease: EASE, delay: stagger(0.09) },
        );
        reveal.then(() => {
          for (const item of items) {
            item.style.opacity = "";
            item.style.transform = "";
          }
        });
      },
      viewOptions(container, "0px 0px -18% 0px"),
    );
  });
}

function setupParallax(reduced, scope, container) {
  if (reduced) return;

  scope.querySelectorAll('[data-module="parallax"]').forEach((element) => {
    const amount = parseFloat(element.dataset.parallaxAmount ?? "120") || 120;
    const trigger = element.parentElement ?? element;
    const motion = animate(
      element,
      { y: [-amount / 2, amount / 2] },
      { duration: 1, ease: "linear", autoplay: false },
    );
    scrub(motion, sceneOptions(trigger, ["start end", "end start"], container));
  });
}

function setupStats(reduced, scope, container) {
  scope.querySelectorAll('[data-module="stats-plx"]').forEach((root) => {
    const items = [...root.querySelectorAll('[data-stats-plx="item"]')].map((element) => ({
      element,
      depth: parseFloat(element.dataset.statsPlxDepth ?? "1") || 1,
    }));
    if (!items.length) return;

    if (reduced) return;

    const elements = items.map((item) => item.element);
    animate(elements, { opacity: 0 }, { duration: 0 });
    for (const element of elements) element.style.willChange = "transform, opacity";

    inView(
      root,
      () => {
        animate(elements, { opacity: 1 }, { duration: 0.9, ease: EASE, delay: stagger(0.08) });
      },
      viewOptions(container, "0px 0px -20% 0px"),
    );

    const travel = 80;
    items.forEach((item) => {
      const motion = animate(
        item.element,
        { y: [(-travel / 2) * item.depth, (travel / 2) * item.depth] },
        { duration: 1, ease: "linear", autoplay: false },
      );
      scrub(motion, sceneOptions(root, ["start end", "end start"], container));
    });
  });
}

function setupSteps(reduced, scope, container) {
  scope.querySelectorAll('[data-module="step-list"]').forEach((root) => {
    const copy = [...root.querySelectorAll('[data-step-list="content-item"]')];
    const visuals = [...root.querySelectorAll('[data-step-list="visual-item"]')];
    if (!copy.length || !visuals.length) return;

    const open = "inset(0% 0% 0% 0%)";
    const closed = "inset(100% 0% 0% 0%)";

    if (reduced) {
      for (const visual of visuals) visual.style.clipPath = open;
      return;
    }

    visuals[0].style.clipPath = open;
    for (let index = 1; index < visuals.length; index += 1) {
      visuals[index].style.clipPath = closed;
    }

    const count = Math.min(copy.length, visuals.length);
    for (let index = 1; index < count; index += 1) {
      const wipe = animate(
        visuals[index],
        { clipPath: [closed, open] },
        { duration: 1, ease: "linear", autoplay: false },
      );
      scrub(wipe, sceneOptions(copy[index], ["start 0.8", "start 0.45"], container));
    }
  });
}

function scrub(animation, options) {
  const span = () => animation.duration || 1;
  let from = 0;
  let to = 0;
  let startedAt = 0;
  let raf = 0;
  let primed = false;

  const expoOut = (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

  function tick(now) {
    const t = Math.min(1, (now - startedAt) / (SCRUB_DURATION * 1000));
    animation.time = (from + (to - from) * expoOut(t)) * span();
    raf = t < 1 ? requestAnimationFrame(tick) : 0;
  }

  scroll((progress) => {
    if (!primed) {
      primed = true;
      from = to = progress;
      animation.time = progress * span();
      return;
    }
    from = animation.time / span();
    to = progress;
    startedAt = performance.now();
    if (!raf) raf = requestAnimationFrame(tick);
  }, options);
}

function setupAnchorScroll(lenis) {
  if (!lenis) return;

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    lenis.scrollTo(target, { offset: 0 });
  });
}
