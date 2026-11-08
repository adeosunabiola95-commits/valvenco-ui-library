import type { Preview } from "@storybook/html-vite";
import "../css/motion.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    options: {
      storySort: {
        order: ["Introduction", "Typography", "Button", "Color", "Iconography", "Motion", "Scroll"],
      },
    },
  },
  decorators: [
    (story, context) => {
      const frame = document.createElement("div");
      frame.className = context.title === "Introduction" ? "sb-story sb-story--intro" : "sb-story";
      const content = story();
      if (content instanceof Node) frame.append(content);
      return frame;
    },
  ],
};

export default preview;
