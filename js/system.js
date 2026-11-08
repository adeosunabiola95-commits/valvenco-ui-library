const TABS = ["button", "motion", "scroll", "type", "color"];

let current = "button";
let lenis = null;
let onShow = () => {};

export function stampButtons() {
  const template = document.querySelector("#c-button-template");
  if (!template) return;

  document.querySelectorAll("[data-stamp='button']").forEach((slot) => {
    const button = template.content.firstElementChild.cloneNode(true);
    const tone = slot.dataset.tone || "primary";
    const size = slot.dataset.size;
    const label = slot.dataset.label || "Contact Us";
    const arrow = slot.dataset.arrow || "leading";

    button.classList.add(`c-button--${tone}`);
    if (size) button.classList.add(`c-button--${size}`);
    button.dataset.buttonVariant = slot.dataset.variant || "roll";
    button.href = slot.dataset.href || `#${slot.closest("[data-panel]")?.dataset.panel || "button"}`;
    button.setAttribute("aria-label", label);
    button.querySelector(".c-button__p").textContent = label;

    if (arrow === "none") {
      button.querySelector('[data-button="icon-l-w"]')?.remove();
    }

    slot.replaceWith(button);
  });
}

export function initSystem({ lenis: scroll, onShow: show }) {
  lenis = scroll;
  onShow = show;
  const initial = tabFromLocation();
  apply(initial, { history: "replace", scroll: false });

  document.querySelectorAll("[data-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      apply(tab.dataset.tab, { history: "push", scroll: true });
    });
  });

  document.querySelector("[data-go]")?.addEventListener("click", (event) => {
    const target = event.currentTarget;
    apply(target.dataset.go, { history: "push", scroll: true });
  });

  document.querySelector(".system__tabs")?.addEventListener("keydown", onTabKey);
  window.addEventListener("popstate", () => {
    apply(tabFromLocation(), { history: "none", scroll: true });
  });

  const chrome = document.querySelector(".system");
  const measure = () => {
    if (!chrome) return;
    document.documentElement.style.setProperty("--chrome-h", `${chrome.offsetHeight}px`);
  };
  measure();
  if (chrome) new ResizeObserver(measure).observe(chrome);
}

function tabFromLocation() {
  const name = location.hash.replace("#", "");
  return TABS.includes(name) ? name : "button";
}

function apply(name, { history: historyMode, scroll }) {
  if (!TABS.includes(name)) name = "button";
  current = name;
  document.documentElement.dataset.system = name;

  document.querySelectorAll("[data-tab]").forEach((tab) => {
    const selected = tab.dataset.tab === name;
    tab.setAttribute("aria-selected", selected ? "true" : "false");
    tab.tabIndex = selected ? 0 : -1;
    if (selected) tab.scrollIntoView({ block: "nearest", inline: "nearest" });
  });

  onShow?.(name);

  const hash = `#${name}`;
  if (historyMode === "push" && location.hash !== hash) window.history.pushState(null, "", hash);
  if (historyMode === "replace" && location.hash !== hash) window.history.replaceState(null, "", hash);

  if (!scroll) return;
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

function onTabKey(event) {
  const tabs = [...document.querySelectorAll("[data-tab]")];
  const index = tabs.findIndex((tab) => tab.dataset.tab === current);
  if (index < 0) return;

  let next = index;
  if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
  else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = tabs.length - 1;
  else return;

  event.preventDefault();
  tabs[next].focus();
  apply(tabs[next].dataset.tab, { history: "push", scroll: true });
}
