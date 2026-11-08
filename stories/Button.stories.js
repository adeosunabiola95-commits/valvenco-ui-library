import { initButtons } from "../js/button.js";
import { ICON_OPTIONS } from "../js/icons.js";
import { createButton, stageFor } from "./lib/button.js";
import { docPage, docRow } from "./lib/docs.js";

const argTypes = {
  label: { control: "text" },
  tone: { control: "select", options: ["primary", "secondary", "neutral"] },
  size: { control: "select", options: ["default", "sm"] },
  arrow: { control: "select", options: ["leading", "none"] },
  icon: {
    control: {
      type: "select",
      labels: {
        arrow: "Arrow",
        "arrow-up-right": "Arrow up-right",
        download: "Download",
        mail: "Mail",
        product: "Product",
      },
    },
    options: ICON_OPTIONS,
  },
  variant: { control: "select", options: ["roll", "lift", "wipe"] },
};

function live(args) {
  const button = createButton(args);
  const stage = stageFor(button, args.tone);
  requestAnimationFrame(() => initButtons(stage));
  return stage;
}

export default {
  title: "Button",
  args: {
    label: "Contact Us",
    tone: "primary",
    size: "default",
    arrow: "leading",
    icon: "arrow",
    variant: "roll",
  },
  argTypes,
  parameters: {
    docs: {
      description: {
        component:
          "Hover 0.5s expo.out. Leave is 0.9× that, staggered from the last letter. Press scales the fill to 0.9 over 0.35s. Focus is a 2px primary outline, offset 2.",
      },
    },
  },
};

export const Playground = {
  render: live,
};

export const Tones = {
  args: {
    variant: "lift"
  },
  name:"Guide",
  render:() => {
    const { root, body } = docPage({
      title: "Button",
      lede: "The action control. Hover, press, and keyboard focus are live on every example.",
      active: "Button",
      action: { label: "Storybook components", href: "/?path=/story/button--playground" },
    });

    const tone = docRow("Tone", "Cyan for the main action, white on black, grey for a quieter action.");
    const toneLight = stage(
      createButton({ label: "Contact Us", tone: "primary" }),
      createButton({ label: "Learn More", tone: "neutral", size: "sm" }),
    );
    const toneDark = stage(
      createButton({ label: "More about us", tone: "primary" }),
      createButton({ label: "Product range", tone: "secondary" }),
    );
    toneDark.classList.add("doc-stage--dark");
    tone.main.append(toneLight, toneDark);

    const size = docRow("Size", "Small sits in the bar. Default is the action in the page.");
    size.main.append(
      stage(
        createButton({ label: "More about us", size: "sm" }),
        createButton({ label: "Contact Us" }),
      ),
    );

    const arrow = docRow("Arrow", "The arrow is part of the action. Without it, the label sits on its own.");
    arrow.main.append(
      stage(
        createButton({ label: "Contact Us" }),
        createButton({ label: "Product range", arrow: "none" }),
      ),
    );

    body.append(tone.row, size.row, arrow.row);
    requestAnimationFrame(() => initButtons(root));
    return root;
  }
};

function stage(...buttons) {
  const frame = document.createElement("div");
  frame.className = "doc-stage";
  frame.append(...buttons);
  return frame;
}
