import { copyHex, docPage, docRow } from "./lib/docs.js";

const SWATCHES = [
  ["Primary", "#00B1F5", "--c-primary", "#00B1F5"],
  ["Secondary", "#FFFFFF", "--c-white", "#FFFFFF"],
  ["Grey", "#ECECEC", "--c-grey", "#ECECEC"],
  ["Neutral", "#000000", "--c-black", "#000000"],
  ["Black 80%", "rgba(0, 0, 0, 0.8)", "--c-type-80 · Body", "#000000CC"],
  ["Black 60%", "rgba(0, 0, 0, 0.6)", "--c-type-60 · Descriptions", "#00000099"],
];

const GROUNDS = [
  ["primary", "Primary", "Main action. The label is white."],
  ["white", "White", "Page and stages. Headings are black, body is 80%."],
  ["grey", "Grey", "Quieter button and the invert fill. The label is black."],
  ["black", "Black", "The ground for a white button. Type on it is white."],
];

const RULES = [
  ["Primary button", "Fill #00B1F5 · Label #FFFFFF"],
  ["Secondary button", "Fill #FFFFFF · Label #000000 · On black"],
  ["Neutral button", "Fill #ECECEC · Label #000000"],
  ["Invert", "Fill #ECECEC · Label #000000"],
  ["Body", "Black 80% · rgba(0, 0, 0, 0.8)"],
  ["Descriptions", "Black 60% · rgba(0, 0, 0, 0.6)"],
  ["Focus", "2px · #00B1F5 · Offset 2"],
];

export default {
  title: "Color",
  parameters: {
    docs: {
      description: {
        component: "Primary for the action, black for type, white for the page.",
      },
    },
  },
};

export const Palette = {
  render: () => {
    const { root, body } = docPage({
      title: "Color",
      lede: "Primary for the action, black for type, white for the page.",
      active: "Color",
      action: { label: "Storybook components", href: "/?path=/story/button--playground" },
    });

    const palette = docRow(
      "Palette",
      "Grey is the quieter button. The page stays white. Body copy is black at 80%, and descriptions sit at 60%.",
    );
    const swatches = document.createElement("div");
    swatches.className = "doc-swatches";
    for (const [name, fill, token, hex] of SWATCHES) {
      swatches.append(swatch(name, fill, token, hex));
    }
    palette.main.append(swatches);
    body.append(palette.row);

    const usage = docRow("Usage", "Each ground keeps one job. The label color is part of the rule.");
    const grounds = document.createElement("div");
    grounds.className = "doc-grounds";
    for (const [tone, name, use] of GROUNDS) {
      const card = document.createElement("div");
      card.className = `doc-ground doc-ground--${tone}`;
      card.innerHTML = `<p class="doc-ground__name"></p><p class="doc-ground__use"></p>`;
      card.querySelector(".doc-ground__name").textContent = name;
      card.querySelector(".doc-ground__use").textContent = use;
      grounds.append(card);
    }
    const rules = document.createElement("dl");
    rules.className = "doc-rules";
    for (const [name, value] of RULES) {
      const item = document.createElement("div");
      const term = document.createElement("dt");
      term.textContent = name;
      const detail = document.createElement("dd");
      detail.textContent = value;
      item.append(term, detail);
      rules.append(item);
    }
    usage.main.append(grounds, rules);
    body.append(usage.row);

    return root;
  },
};

function swatch(name, fill, token, hex) {
  const item = document.createElement("div");
  item.className = "doc-swatch";
  const chip = document.createElement("div");
  const alpha = fill.startsWith("rgba");
  chip.className = alpha ? "doc-swatch__chip doc-swatch__chip--alpha" : "doc-swatch__chip";
  if (alpha) {
    const veil = document.createElement("span");
    veil.className = "doc-swatch__veil";
    veil.style.background = fill;
    chip.append(veil);
  } else {
    chip.style.background = fill;
  }
  const title = document.createElement("p");
  title.className = "doc-swatch__name";
  title.textContent = name;
  const meta = document.createElement("p");
  meta.className = "doc-swatch__meta";
  meta.textContent = token;
  item.append(chip, title, meta, copyHex(hex));
  return item;
}
