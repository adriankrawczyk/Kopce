import { hills } from "./hills.js";
import { hillText } from "./hillText.js";

function home() {
  alert(1);
  document.addEventListener("DOMContentLoaded", () => {
    alert(2);
    hills();
    hillText();
  });
}
home();
