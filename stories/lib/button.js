import { iconSvg } from "../../js/icons.js";

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function createButton({
  label = "Contact Us",
  tone = "primary",
  size = "default",
  arrow = "leading",
  variant = "roll",
  icon = "arrow",
} = {}) {
  const button = document.createElement("a");
  button.className = `c-button c-button--${tone}`;
  if (size === "sm") button.classList.add("c-button--sm");
  button.dataset.module = "button";
  button.dataset.buttonVariant = variant;
  button.href = "#button";
  button.setAttribute("aria-label", label);

  const mark = iconSvg(icon);
  const leading =
    arrow === "none"
      ? ""
      : `<span data-button="icon-l-w" class="c-button__icon-w c-button__icon-w--l"><span data-button="icon-l" class="c-button__icon">${mark}</span></span>`;

  button.innerHTML = `
    <span data-button="size" class="c-button__size">
      <span data-button="bg" class="c-button__bg"></span>
      ${leading}
      <span data-button="title" class="c-button__title"><p class="c-button__p">${escapeText(label)}</p></span>
    </span>
  `;

  if (arrow === "none") {
    const title = button.querySelector(".c-button__title");
    if (title) {
      title.style.paddingLeft = "0";
      title.style.paddingRight = "0";
    }
  }

  return button;
}

export function stageFor(button, tone) {
  const stage = document.createElement("div");
  stage.className = tone === "secondary" ? "stage stage--dark" : "stage";
  stage.append(button);
  return stage;
}
