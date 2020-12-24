import { main } from "./main.js";

function isTouchDevice() {
  return matchMedia("(hover: none)").matches;
}

const warning = document.getElementsByClassName("info--text--warning")[0]
  .parentElement;

if (isTouchDevice()) {
  warning.classList.remove("hidden");
}

warning.onclick = () => {
  warning.remove();
};

main();
