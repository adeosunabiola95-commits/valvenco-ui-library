import { initButtons } from "./button.js?v=23";
import { initScroll, mountScrollScenes } from "./scroll.js?v=4";
import { initSystem, stampButtons } from "./system.js?v=23";

stampButtons();
const lenis = initScroll();
initSystem({
  lenis,
  onShow(name) {
    const panel = document.querySelector(`[data-panel="${name}"]`);
    if (panel) initButtons(panel);
    if (name === "scroll") mountScrollScenes();
  },
});
