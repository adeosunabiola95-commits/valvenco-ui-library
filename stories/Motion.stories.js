import { initButtons } from "../js/button.js";
import { createButton, stageFor } from "./lib/button.js";

const HOVERS = [
  ["Letter roll", "roll", "leading", "Each letter rolls up. The leading icon switches to the right."],
  ["Line lift", "lift", "leading", "The words move together, as one line. The leading icon switches to the right."],
  ["Invert", "wipe", "leading", "The fill turns over from the left on a 30° edge and covers the button in grey."],
];

export default {
  title: "Motion",
  parameters: {
    docs: {
      description: {
        component:
          "Button motion uses Motion’s animate and stagger. Hover only runs for a fine pointer, and reduced motion skips the movement.",
      },
    },
  },
};

export const ButtonHover = {
  render: () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <div class="panel__intro">
        <h1 class="panel__title">Motion</h1>
        <p class="lede">The same button and the same press. Each example changes one hover.</p>
      </div>
      <dl class="rule-list">
        <div><dt>Hover</dt><dd>0.5s · expo.out · delay 0.065s · letter stagger 0.01s</dd></div>
        <div><dt>Leave</dt><dd>0.45s · stagger from the last letter</dd></div>
        <div><dt>Fill</dt><dd>Scales to 0.95 on hover. Wipe does not scale the fill.</dd></div>
        <div><dt>Press</dt><dd>Scales to 0.9 over 0.35s. Wipe scales the whole button.</dd></div>
        <div><dt>Arrow</dt><dd>One leading icon. On hover it switches to the right, and the label shifts by the icon and the gap.</dd></div>
        <div><dt>Wipe</dt><dd>30° leading edge. On finish the base fill becomes #ECECEC.</dd></div>
      </dl>
    `;
    const row = document.createElement("div");
    row.className = "motion-row";
    row.style.marginTop = "2.5rem";
    for (const [name, variant, arrow, copy] of HOVERS) {
      const figure = document.createElement("figure");
      const caption = document.createElement("figcaption");
      caption.textContent = `${name}. ${copy}`;
      figure.append(stageFor(createButton({ variant, arrow, label: "Contact Us" }), "primary"), caption);
      row.append(figure);
    }
    root.append(row);
    requestAnimationFrame(() => initButtons(root));
    return root;
  },
};
