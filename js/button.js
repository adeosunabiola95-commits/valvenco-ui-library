/**
 * Button motion for the Valvenco handoff.
 * Vanilla Motion (`animate`, `stagger`). No React.
 *
 * Hover (0.5s, expo.out):
 *   fill scales to 0.95
 *   the leading icon moves to the right of the label
 *   the label shifts left by the icon and the gap
 *   each letter rolls up (stagger 0.01s, delay 0.065s)
 * Leave is 0.9× that duration, stagger from the end.
 * Press scales the fill to 0.9 over 0.35s.
 * Wipe uses a 30° leading edge and paints the base fill when the wipe finishes.
 */
import { animate, stagger } from "https://cdn.jsdelivr.net/npm/motion@14.10.1/+esm";

const ICON_FALLBACK = 16;
const GAP_FALLBACK = 10;
const HOVER_DURATION = 0.5;
const LEAVE_DURATION = HOVER_DURATION * 0.9;
const DELAY = 0.065;
const STAGGER = 0.01;
const HOVER_SCALE = 0.95;
const PRESS_SCALE = 0.9;
const WIPE_SLANT = Math.tan(Math.PI / 6);
const PRESS_DURATION = 0.35;
const EASE = [0.16, 1, 0.3, 1];

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function splitChars(paragraph) {
  const text = paragraph.textContent ?? "";
  paragraph.textContent = "";
  const chars = [];

  for (const char of text) {
    const mask = document.createElement("span");
    mask.setAttribute("aria-hidden", "true");
    mask.style.position = "relative";
    mask.style.display = "inline-block";
    mask.style.overflow = "clip";
    mask.style.whiteSpace = "pre";

    const inner = document.createElement("span");
    inner.setAttribute("aria-hidden", "true");
    inner.style.position = "relative";
    inner.style.display = "inline-block";
    inner.style.paddingBottom = "0.22em";
    inner.textContent = char;
    mask.appendChild(inner);
    paragraph.appendChild(mask);
    chars.push(inner);
  }

  return chars;
}

export function initButtons(root = document) {
  root.querySelectorAll('[data-module="button"]').forEach((button) => {
    if (button.dataset.buttonReady === "true") return;
    button.dataset.buttonReady = "true";
    initButton(button);
  });
}

const VARIANTS = new Set(["roll", "lift", "wipe"]);

function initButton(button) {
  const variant = VARIANTS.has(button.dataset.buttonVariant) ? button.dataset.buttonVariant : "roll";
  button.dataset.buttonVariant = variant;

  const iconLeft = button.querySelector('[data-button="icon-l"]');
  const iconLeftWrap = button.querySelector('[data-button="icon-l-w"]');
  const title = button.querySelector('[data-button="title"]');
  const source = title?.querySelector(":scope > p") ?? title?.querySelector("p") ?? null;
  const background = button.querySelector('[data-button="bg"]');
  const reduced = reducedMotion();
  const hoverable = canHover();
  const splitEnabled = button.dataset.buttonSplitChars !== "false";
  const crosses = variant === "roll" || variant === "lift";

  let shift = ICON_FALLBACK + GAP_FALLBACK;
  let travel = 0;
  let hovered = false;
  let focused = false;
  let pressed = false;
  let clone = null;
  let wipeLayer = null;
  let wipeRest = "polygon(0% 0%, 0% 0%, -16% 100%, 0% 100%)";
  let wipeHover = "polygon(0% 0%, 116% 0%, 100% 100%, 0% 100%)";
  let originalChars = [];
  let cloneChars = [];
  let running = [];
  let scaleAnim = null;
  let generation = 0;

  function stopRunning() {
    for (const anim of running) anim.stop();
    running = [];
    scaleAnim?.stop();
    scaleAnim = null;
  }

  function play(element, keyframes, options) {
    const anim = animate(element, keyframes, options);
    running.push(anim);
    return anim;
  }

  function playScale(layer, scale, duration) {
    scaleAnim?.stop();
    scaleAnim = animate(layer, { scale }, { duration, ease: EASE });
  }

  function measure() {
    let icon = ICON_FALLBACK;
    let gap = GAP_FALLBACK;
    if (iconLeftWrap) {
      const width = iconLeftWrap.getBoundingClientRect().width;
      if (width > 0) icon = width;
    }
    if (title) {
      const padding = parseFloat(getComputedStyle(title).paddingLeft);
      if (padding > 0) gap = padding;
      const titleWidth = title.getBoundingClientRect().width;
      if (titleWidth > 0) travel = titleWidth;
    }
    shift = icon + gap;
    placeClone();
    lockTitleHeight();
  }

  function placeClone() {
    if (!title || !clone) return;
    clone.style.left = getComputedStyle(title).paddingLeft;
  }

  function lockTitleHeight() {
    if (!title) return;
    if (originalChars.length) {
      let height = 0;
      for (const char of originalChars) {
        const extra = parseFloat(getComputedStyle(char).paddingBottom) || 0;
        height = Math.max(height, char.getBoundingClientRect().height - extra);
      }
      if (height > 0) title.style.height = `${height}px`;
      return;
    }
    if (variant === "lift" && source) {
      const height = source.getBoundingClientRect().height;
      if (height > 0) title.style.height = `${height}px`;
    }
  }

  function prepareSplit() {
    if (variant !== "roll" || !splitEnabled || reduced || !title || !source || clone) return;
    clone = source.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    title.appendChild(clone);
    clone.style.position = "absolute";
    clone.style.top = "0";
    placeClone();
    source.setAttribute("aria-hidden", "true");
    originalChars = splitChars(source);
    cloneChars = splitChars(clone);
    animate(cloneChars, { y: "100%" }, { duration: 0 });
    lockTitleHeight();
  }

  function prepareLift() {
    if (variant !== "lift" || reduced || !title || !source || clone) return;
    title.style.overflow = "clip";
    clone = source.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    title.appendChild(clone);
    clone.style.position = "absolute";
    clone.style.top = "0";
    placeClone();
    source.setAttribute("aria-hidden", "true");
    animate(clone, { y: "100%" }, { duration: 0 });
    const height = source.getBoundingClientRect().height;
    if (height > 0) title.style.height = `${height}px`;
  }

  function prepareWipe() {
    if (variant !== "wipe" || reduced || wipeLayer) return;
    const size = button.querySelector('[data-button="size"]');
    if (!size) return;
    const wipe = document.createElement("span");
    wipe.className = "c-button__wipe";
    wipe.setAttribute("aria-hidden", "true");
    const ghost = size.cloneNode(true);
    ghost.querySelectorAll("[data-button]").forEach((node) => node.removeAttribute("data-button"));
    ghost.querySelector(".c-button__bg")?.remove();
    wipe.appendChild(ghost);
    button.appendChild(wipe);
    wipeLayer = wipe;
    syncWipeClips();
    animate(wipe, { clipPath: wipeRest }, { duration: 0 });
  }

  function syncWipeClips() {
    if (!wipeLayer) return;
    const box = wipeLayer.getBoundingClientRect();
    if (box.width <= 0 || box.height <= 0) return;
    const slant = (box.height * WIPE_SLANT * 100) / box.width;
    wipeRest = `polygon(0% 0%, 0% 0%, ${-slant}% 100%, 0% 100%)`;
    wipeHover = `polygon(0% 0%, ${100 + slant}% 0%, 100% 100%, 0% 100%)`;
  }

  function playHover() {
    const gen = ++generation;
    button.classList.add("is-hovered");
    button.setAttribute("data-button-state", "hover");
    if (reduced) return;

    stopRunning();
    if (originalChars.length) {
      for (const char of [...originalChars, ...cloneChars]) char.style.willChange = "transform";
    }
    if (background && variant !== "wipe") {
      playScale(background, HOVER_SCALE, HOVER_DURATION);
    }
    if (iconLeftWrap && crosses) {
      play(iconLeftWrap, { x: travel }, { duration: HOVER_DURATION, ease: EASE });
    }
    if (title && iconLeftWrap && crosses) {
      play(title, { x: -shift }, { duration: HOVER_DURATION, ease: EASE, delay: DELAY });
    }
    if (variant === "roll" && originalChars.length) {
      const roll = { duration: HOVER_DURATION, ease: EASE, delay: stagger(STAGGER, { startDelay: DELAY }) };
      play(originalChars, { y: "-100%" }, roll);
      play(cloneChars, { y: "0%" }, roll);
    }
    if (variant === "lift" && source && clone) {
      play(source, { y: "-100%" }, { duration: HOVER_DURATION, ease: EASE, delay: DELAY });
      play(clone, { y: "0%" }, { duration: HOVER_DURATION, ease: EASE, delay: DELAY });
    }
    if (variant === "wipe" && wipeLayer) {
      syncWipeClips();
      const wipe = play(wipeLayer, { clipPath: wipeHover }, { duration: HOVER_DURATION, ease: EASE });
      wipe.then(() => {
        if (gen !== generation || !hovered || !background) return;
        background.style.backgroundColor = "var(--c-light-grey)";
      });
    }
  }

  function playRest() {
    const gen = ++generation;
    button.classList.remove("is-hovered");
    button.setAttribute("data-button-state", "rest");
    if (reduced) return;

    stopRunning();
    if (background && variant !== "wipe") {
      scaleAnim = animate(background, { scale: 1 }, { duration: LEAVE_DURATION, ease: EASE, delay: DELAY * 1.5 });
    }
    if (title && iconLeftWrap && crosses) {
      play(title, { x: 0 }, { duration: LEAVE_DURATION, ease: EASE, delay: DELAY });
    }
    if (variant === "roll" && originalChars.length) {
      const leave = {
        duration: LEAVE_DURATION,
        ease: EASE,
        delay: stagger(STAGGER, { startDelay: DELAY, from: "last" }),
      };
      play(originalChars, { y: "0%" }, leave);
      const cloneLeave = play(cloneChars, { y: "100%" }, leave);
      cloneLeave.then(() => {
        if (gen !== generation) return;
        for (const char of [...originalChars, ...cloneChars]) char.style.willChange = "auto";
      });
    }
    if (variant === "lift" && source && clone) {
      play(source, { y: "0%" }, { duration: LEAVE_DURATION, ease: EASE, delay: DELAY });
      play(clone, { y: "100%" }, { duration: LEAVE_DURATION, ease: EASE, delay: DELAY });
    }
    if (iconLeftWrap && crosses) {
      play(iconLeftWrap, { x: 0 }, { duration: LEAVE_DURATION, ease: EASE, delay: DELAY * 1.5 });
    }
    if (variant === "wipe" && wipeLayer) {
      if (background) background.style.backgroundColor = "";
      playScale(button, 1, LEAVE_DURATION);
      syncWipeClips();
      play(wipeLayer, { clipPath: wipeRest }, { duration: LEAVE_DURATION, ease: EASE });
    }
  }

  function enter() {
    if (hovered) return;
    hovered = true;
    if (!focused) playHover();
  }

  function leave() {
    if (!hovered) return;
    hovered = false;
    if (!focused && !pressed) playRest();
  }

  function onFocus() {
    if (!button.matches(":focus-visible")) return;
    focused = true;
    if (!hovered) playHover();
  }

  function onBlur() {
    if (!focused) return;
    focused = false;
    if (!hovered) playRest();
  }

  function onDown(event) {
    if (event.button !== 0 || pressed) return;
    pressed = true;
    button.classList.add("is-pressed");
    button.setAttribute("data-button-state", "press");
    if (reduced) return;
    const layer = variant === "wipe" ? button : background;
    if (!layer) return;
    playScale(layer, PRESS_SCALE, PRESS_DURATION);
  }

  function onUp() {
    if (!pressed) return;
    pressed = false;
    button.classList.remove("is-pressed");
    if (hovered || focused) {
      button.setAttribute("data-button-state", "hover");
      const layer = variant === "wipe" ? button : background;
      if (!reduced && layer) {
        playScale(layer, variant === "wipe" ? 1 : HOVER_SCALE, PRESS_DURATION);
      }
      return;
    }
    playRest();
  }

  button.setAttribute("data-button-state", "rest");
  if (title && !iconLeft) {
    title.style.paddingLeft = "0";
    title.style.paddingRight = "0";
  }
  measure();
  prepareSplit();
  prepareLift();
  prepareWipe();

  if (hoverable) {
    button.addEventListener("mouseenter", enter);
    button.addEventListener("mouseleave", leave);
  }
  button.addEventListener("focus", onFocus);
  button.addEventListener("blur", onBlur);
  button.addEventListener("pointerdown", onDown);
  button.addEventListener("pointerup", onUp);
  button.addEventListener("pointercancel", onUp);

  const observer = new ResizeObserver(measure);
  observer.observe(button);
  document.fonts?.ready.then(() => {
    measure();
    lockTitleHeight();
  });
}
