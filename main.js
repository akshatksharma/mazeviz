import grid from "./grid.js";
import dijkstra from "./dijkstra.js";

let container = document.getElementsByClassName("nodeContainer")[0];

let aGrid = new grid(2, 50, container);
aGrid.createNodes();
aGrid.createGrid();

dijkstra(aGrid, aGrid.heap);

console.log(aGrid);
