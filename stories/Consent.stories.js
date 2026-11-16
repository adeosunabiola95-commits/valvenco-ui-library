import { createConsent } from "../js/checkbox.js";
import { docPage, docRow } from "./lib/docs.js";

const LABEL = "I agree to be contacted by LFF Valvenco regarding my enquiry.";

export default {
  title: "Consent",
  args: {
    label: LABEL,
    checked: false,
    disabled: false,
  },
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Unchecked until the person opts in. The tick draws on in 0.5s and leaves in 0.45s, on the same expo.out as the button. Reduced motion skips both.",
      },
    },
  },
};

export const Playground = {
  render: (args) => stage(createConsent(args)),
};

export const Agreement = {
  name: "Guide",
  render: () => {
    const { root, body } = docPage({
      title: "Consent",
      lede: "The agreement before LFF Valvenco can reply to an enquiry. It starts unchecked.",
      active: "Consent",
      action: { label: "Storybook components", href: "/?path=/story/consent--playground" },
    });

    const agreement = docRow("Agreement", "One sentence. The box and the words are the same control.");
    agreement.main.append(stage(createConsent()));

    const checked = docRow(
      "Checked",
      "The fill and the tick arrive together in 0.5s. Uncheck is the leave, 0.45s. Reduced motion shows the state at once.",
    );
    checked.main.append(stage(createConsent({ checked: true })));

    const unavailable = docRow("Unavailable", "Disabled when the form cannot take an answer.");
    const unavailableStage = stage(createConsent({ disabled: true }), createConsent({ checked: true, disabled: true }));
    unavailableStage.classList.add("doc-stage--stack");
    unavailable.main.append(unavailableStage);

    body.append(agreement.row, checked.row, unavailable.row);
    return root;
  },
};

function stage(...fields) {
  const frame = document.createElement("div");
  frame.className = "doc-stage";
  frame.append(...fields);
  return frame;
}
