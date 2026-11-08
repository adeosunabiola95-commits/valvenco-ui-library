import { docPage, docRow } from "./lib/docs.js";

const STEPS = [
  ["Display 96", "96px · 500 · −0.04em · 1", "type-96", "Control valves"],
  ["Display 80", "80px desktop · 48px floor · 500 · −0.035em · 1.05", "type-display", "A global organisation."],
  ["Display 64", "64px · 500 · −0.035em · 1.05", "type-64", "Product range"],
  ["Title 56", "56px desktop · 36px floor · 500 · −0.03em · 1.1", "type-title", "A global organisation."],
  ["Title 40", "40px · 500 · −0.03em · 1.1", "type-40", "A global organisation."],
  ["Heading 32", "32px · 500 · −0.03em · 1.15", "type-32", "Sections fade up"],
  ["Heading 24", "24px · 500 · −0.03em · 1.2", "type-24", "Sections fade up as they enter."],
  ["Heading 22", "22px · 500 · −0.03em · 1.2", "type-22", "Sections fade up as they enter."],
  ["Lede 18", "18px · 400 · 1.45 · #000000 at 60%", "lede", "The same button and the same press. Each example changes one hover."],
  ["Body 16", "16px · 400 · 1.45 · #000000 at 80%", "type-body", "Scroll down and the sample header tucks away. Scroll up and it returns. Photographs and numbers drift at their own pace."],
  ["Button 15", "15px · 500 · −0.02em · 1", "type-button", "Contact Us"],
  ["Caption 14", "14px · 400 · 1.4", "type-caption", "Scroll down and the sample header tucks away. Scroll up and it returns."],
  ["Eyebrow 12", "12px · 500 · 0.14em · uppercase", "eyebrow", "Button hover"],
];

const NOTES = [
  ["Heading font", "color/black/100"],
  ["Body copy / description", "color/black/80"],
  ["Lede and supporting text.", "color/black/60"],
];

export default {
  title: "Typography",
  parameters: {
    docs: {
      description: {
        component: "Inter, from 96px to 12px. These are the text styles to carry into Figma.",
      },
    },
  },
};

export const Scale = {
  render: () => {
    const { root, body } = docPage({
      title: "Typography",
      lede: "Inter, from 96px to 12px. These are the text styles to carry into Figma.",
      active: "Typography",
      action: {
        label: "Download font",
        href: "https://fonts.google.com/specimen/Inter",
        external: true,
      },
    });

    const family = docRow("Font Family", "400 · 500 · 600");
    const notes = document.createElement("div");
    notes.className = "doc-notes";
    const name = document.createElement("p");
    name.className = "type-64";
    name.textContent = "Inter";
    notes.append(name);
    for (const [label, token] of NOTES) {
      const note = document.createElement("div");
      note.className = "doc-note";
      const title = document.createElement("p");
      title.className = "doc-note__name";
      title.textContent = label;
      const meta = document.createElement("p");
      meta.className = "doc-note__meta";
      meta.textContent = token;
      note.append(title, meta);
      notes.append(note);
    }
    family.main.append(notes);
    body.append(family.row);

    for (const [title, spec, className, sample] of STEPS) {
      const row = docRow(title, spec);
      const text = document.createElement("p");
      text.className = className;
      text.textContent = sample;
      row.main.append(text);
      body.append(row.row);
    }

    return root;
  },
};
