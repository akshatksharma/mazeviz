import grid from "./grid.js";

function run() {
  let container = document.getElementsByClassName("nodeContainer")[0];
  let aGrid = new grid(50, 50, container);

  aGrid.createNodes();
  aGrid.createGrid();
  let yes = document.getElementsByClassName("run")[0];
  yes.addEventListener("click", () => {
    aGrid.shortestPath();
  });
}

run();
console.log("stack cleared");
