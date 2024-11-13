import { clouds } from "./clouds.js";
import { clickEventListeners } from "./clickEventListeners.js";
function run() {
  clickEventListeners();

  document.addEventListener("DOMContentLoaded", () => {
    clouds();
  });
}
run();
