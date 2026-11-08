import { iconSvg } from "../../js/icons.js";

const PAGES = [
  ["Typography", "typography--scale"],
  ["Button", "button--tones"],
  ["Color", "color--palette"],
  ["Iconography", "iconography--set"],
];

export function docPage({ title, lede, active, action }) {
  const root = document.createElement("div");
  root.className = "doc";

  const nav = document.createElement("nav");
  nav.className = "doc-nav";
  nav.setAttribute("aria-label", "Documentation");
  for (const [label, id] of PAGES) {
    const link = document.createElement("a");
    link.className = "doc-nav__link";
    link.href = `/?path=/story/${id}`;
    link.target = "_top";
    link.textContent = label;
    if (label === active) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
    nav.append(link);
  }

  const header = document.createElement("header");
  header.className = "doc-header";
  const copy = document.createElement("div");
  copy.className = "doc-header__copy";
  const heading = document.createElement("h1");
  heading.className = "doc-header__title";
  heading.textContent = title;
  const note = document.createElement("p");
  note.className = "doc-header__lede";
  note.textContent = lede;
  copy.append(heading, note);
  header.append(copy);
  if (action) header.append(docAction(action));

  const body = document.createElement("div");
  body.className = "doc__body";
  root.append(nav, header, body);
  return { root, body };
}

export function docRow(title, copy) {
  const row = document.createElement("section");
  row.className = "doc-row";
  const aside = document.createElement("div");
  aside.className = "doc-row__aside";
  const heading = document.createElement("h2");
  heading.className = "doc-row__title";
  heading.textContent = title;
  const note = document.createElement("p");
  note.className = "doc-row__copy";
  note.textContent = copy;
  aside.append(heading, note);
  const main = document.createElement("div");
  main.className = "doc-row__main";
  row.append(aside, main);
  return { row, main };
}

export function copyHex(value) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "doc-copy";
  button.textContent = value;
  button.setAttribute("aria-label", `Copy ${value}`);
  button.addEventListener("click", async () => {
    const show = (text) => {
      button.textContent = text;
      button.setAttribute("aria-label", text);
    };
    try {
      await writeText(value);
    } catch {
      show("Copy failed");
      window.setTimeout(() => show(value), 1200);
      return;
    }
    button.dataset.copied = "true";
    show("Copied");
    window.setTimeout(() => {
      delete button.dataset.copied;
      show(value);
      button.setAttribute("aria-label", `Copy ${value}`);
    }, 1200);
  });
  return button;
}

function docAction({ label, href, external }) {
  const link = document.createElement("a");
  link.className = "doc-action";
  link.href = href;
  if (external) {
    link.target = "_blank";
    link.rel = "noreferrer";
  } else {
    link.target = "_top";
  }
  const text = document.createElement("span");
  text.textContent = label;
  const icon = document.createElement("span");
  icon.className = "doc-action__icon";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = iconSvg("arrow");
  link.append(text, icon);
  return link;
}

async function writeText(value) {
  window.focus();
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // The preview iframe can refuse the async clipboard. The selection copy still works from the click.
    }
  }
  const area = document.createElement("textarea");
  area.value = value;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.left = "0";
  area.style.opacity = "0";
  document.body.append(area);
  area.focus();
  area.select();
  area.setSelectionRange(0, value.length);
  const ok = document.execCommand("copy");
  area.remove();
  if (!ok) throw new Error("copy failed");
}
