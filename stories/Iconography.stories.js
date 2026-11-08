import { iconSvg } from "../js/icons.js";
import { docPage, docRow } from "./lib/docs.js";

const ICONS = [
  ["arrow", "Arrow"],
  ["arrow-up-right", "Arrow up-right"],
  ["download", "Download"],
  ["mail", "Mail"],
  ["product", "Product"],
];

export default {
  title: "Iconography",
  parameters: {
    docs: {
      description: {
        component: "Sharp Radix marks. These five are the ones the system uses.",
      },
    },
  },
};

export const Set = {
  render: () => {
    const { root, body } = docPage({
      title: "Iconography",
      lede: "Sharp Radix marks for the button, from continue to product.",
      active: "Iconography",
      action: {
        label: "Radix icons",
        href: "https://www.radix-ui.com/icons",
        external: true,
      },
    });

    const specs = docRow(
      "Icon specs",
      "15px, sharp, and filled. The button carries one of these on the left.",
    );
    const list = document.createElement("div");
    list.className = "doc-icons";
    for (const [name, label] of ICONS) {
      const item = document.createElement("div");
      item.className = "doc-icon";
      const mark = document.createElement("span");
      mark.className = "doc-icon__mark";
      mark.innerHTML = iconSvg(name);
      const title = document.createElement("p");
      title.className = "doc-icon__name";
      title.textContent = label;
      item.append(mark, title);
      list.append(item);
    }
    specs.main.append(list);
    body.append(specs.row);
    return root;
  },
};
