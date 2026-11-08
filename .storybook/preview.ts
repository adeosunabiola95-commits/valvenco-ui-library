import type { Preview } from "@storybook/html-vite";
import "../css/motion.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    options: {
      storySort: {
        order: ["Typography", "Button", "Color", "Iconography", "Motion", "Scroll"],
      },
    },
  },
  decorators: [
    (story) => {
      const frame = document.createElement("div");
      frame.className = "sb-story";
      const content = story();
      if (content instanceof Node) frame.append(content);
      return frame;
    },
  ],
};

export default preview;
