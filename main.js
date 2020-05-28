import grid from "./grid.js";

let wallList = [];

function createDOMGrid(grid, container) {
  console.log(grid);

  const frag = document.createDocumentFragment();

  grid.heap.array.forEach((node) => {
    let domNode = document.createElement("div");

    domNode.className = "node";
    domNode.id = `node: ${node.row}, ${node.col}`;
    domNode.dataset.id = node.id;
    domNode.dataset.visited = node.visited;
    domNode.dataset.wall = false;

    // styling stuff
    if (node.wall && (!node.isStart() || !node.isEnd())) {
      domNode.dataset.wall = true;
    }

    if (node.isStart(grid.startLoc)) {
      grid.startNode = node;
      domNode.classList.add("start");
    }
    if (node.isEnd(grid.endLoc)) {
      grid.endNode = node;
      domNode.classList.add("end");
    }
    if (node.col % grid.numCols == 0) {
      domNode.classList.add("row--end");
    }
    if (node.row == grid.numRows) {
      domNode.classList.add("col--end");
    }

    // mouse down -- set initial mouse state to clicked, add current node to wall list
    // mouse hover -- if clicked is == true, then add current node to list
    // mouse up -- refresh graph with new nodes

    const toggleArray = (array, item) =>
      array.includes(item) ? array.filter((i) => i != item) : [...array, item];

    function mousedown() {
      container = document.getElementsByClassName("nodeContainer")[0];
      container.dataset.mouseDown = true;
      const startOrEnd =
        this.classList.contains("start") || this.classList.contains("end");
      if (startOrEnd) {
        return;
      }

      this.dataset.wall = this.dataset.wall === "false" ? "true" : "false";
      wallList = toggleArray(wallList, this.dataset.id);
    }
    function mouseenter() {
      let container = document.getElementsByClassName("nodeContainer")[0];
      let mouseDown = container.dataset.mouseDown;
      const startOrEnd =
        this.classList.contains("start") || this.classList.contains("end");
      if (startOrEnd) return;

      if (mouseDown == "true") {
        this.dataset.wall = this.dataset.wall === "false" ? "true" : "false";
        wallList = toggleArray(wallList, this.dataset.id);
      } else {
        return;
      }
    }
    function mouseup() {
      container = document.getElementsByClassName("nodeContainer")[0];
      container.dataset.mouseDown = false;
      wallList = Array.from(new Set(wallList));
      console.log(wallList);

      let runButton = document.getElementsByClassName("run")[0];
      var newrunButton = runButton.cloneNode(true);
      runButton.parentNode.replaceChild(newrunButton, runButton);
      container.innerHTML = "";

      main();
    }

    domNode.addEventListener("mousedown", mousedown);
    domNode.addEventListener("mouseenter", mouseenter);
    domNode.addEventListener("mouseup", mouseup);

    frag.appendChild(domNode);
  });

  container.appendChild(frag);
}

function clearBoard() {
  let container = document.getElementsByClassName("nodeContainer")[0];
  container.innerHTML = "";
  container.dataset.mouseDown = false;
  let aGrid = new grid(25, 50);

  aGrid.createNodes();
  createDOMGrid(aGrid, container);
}

function reset() {}

function pause() {}

function main() {
  let container = document.getElementsByClassName("nodeContainer")[0];
  container.dataset.mouseDown = false;
  let aGrid = new grid(25, 50);

  aGrid.createNodes();

  if (wallList.length > 0) {
    aGrid.setWalls(wallList);
  }

  createDOMGrid(aGrid, container);

  let runButton = document.getElementsByClassName("run")[0];
  runButton.addEventListener("click", () => {
    runButton.innerHTML = "running...";
    aGrid.shortestPath();
  });

  let clearButton = document.getElementsByClassName("clear")[0];
  clearButton.addEventListener("click", () => {
    console.log(wallList);
    aGrid.unsetWalls(wallList);
    setTimeout(() => {
      wallList = [];
      clearBoard();
    }, 0);
  });
}

main();
