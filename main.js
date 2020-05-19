import grid from "./grid.js";

let container = document.getElementsByClassName("nodeContainer")[0];

let aGrid = new grid(50, 50, container);

aGrid.createNodes();
aGrid.createGrid();

console.log(aGrid);
