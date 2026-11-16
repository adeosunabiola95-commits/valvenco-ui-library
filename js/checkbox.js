const CONSENT_LABEL = "I agree to be contacted by LFF Valvenco regarding my enquiry.";
const SVG_NS = "http://www.w3.org/2000/svg";

function tick() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "c-consent__tick");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", "M2.3 8.2 6.2 12 13.7 4");
  svg.append(path);

  const length = path.getTotalLength();
  path.style.setProperty("--tick-length", String(length));
  return svg;
}

export function createConsent({
  label = CONSENT_LABEL,
  checked = false,
  disabled = false,
  name = "consent",
} = {}) {
  const field = document.createElement("label");
  field.className = "c-consent";

  const control = document.createElement("span");
  control.className = "c-consent__control";

  const input = document.createElement("input");
  input.className = "c-consent__input";
  input.type = "checkbox";
  input.name = name;
  input.checked = Boolean(checked);
  input.disabled = Boolean(disabled);

  const box = document.createElement("span");
  box.className = "c-consent__box";
  box.setAttribute("aria-hidden", "true");
  box.append(tick());

  const text = document.createElement("span");
  text.className = "c-consent__text";
  text.textContent = label;

  control.append(input, box);
  field.append(control, text);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      field.dataset.ready = "true";
    });
  });
  return field;
}
