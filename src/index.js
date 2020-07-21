import { main } from "./main.js";

const warning = document.getElementsByClassName("info--text--warning")[0]
  .parentElement;

warning.onclick = () => {
  warning.style.opacity = 0;
};

main();
