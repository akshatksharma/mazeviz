import grid from "./grid.js";

// determining if user is on mobile or computer
// if on computer assign class to body that will tell css to disable focus styling on buttons etc
function userDevice(e) {
  if (e.keyCode === 9) {
    document.body.classList.add("onComputer");
    window.removeEventListener("keydown", userDevice);
  }
}
window.addEventListener("keydown", userDevice);

// setting intial values for walls, start and end loci, and overall container for DOM representation of nodes
let wallList = [];
let startLoc = [14, 15];
let endLoc = [14, 36];
const container = document.getElementsByClassName("nodeContainer")[0];

function createDOMGrid(grid, container) {
  const frag = document.createDocumentFragment();

  grid.heap.array.forEach((node) => {
    let domNode = document.createElement("div");

    // setting initial parameters of DOM node based on internal node
    domNode.className = "node";
    domNode.id = `node: ${node.row}, ${node.col}`;
    domNode.dataset.id = node.id;
    domNode.dataset.row = node.row;
    domNode.dataset.col = node.col;
    domNode.dataset.visited = node.visited;
    domNode.dataset.wall = node.wall;

    // if flagged as wall, and not start or end, display a wall
    if (node.wall && !(node.isStart() && node.isEnd())) {
      domNode.dataset.wall = true;
      domNode.classList.add("wall");
    }

    // if flagged as start or end, display start / end node
    if (node.isStart(grid.startLoc)) {
      grid.startNode = node;
      domNode.classList.add("start");
    } else if (node.isEnd(grid.endLoc)) {
      grid.endNode = node;
      domNode.classList.add("end");
    }

    // if going to be end of column, or end of row, style differently
    const lastInRow = node.col % grid.numCols == 0;
    const lastInCol = node.row == grid.numRows;
    if (lastInRow) {
      domNode.classList.add("row--end");
    }
    if (lastInCol) {
      domNode.classList.add("col--end");
    }

    domNode.addEventListener("mousedown", mousedown);
    domNode.addEventListener("mouseenter", mouseenter);
    domNode.addEventListener("mouseup", mouseup);
    domNode.addEventListener("mouseleave", mouseleave);

    frag.appendChild(domNode);
  });

  container.appendChild(frag);
}

// helper methods (and helper helper methods)
const toggleArray = (array, item) =>
  array.includes(item) ? array.filter((i) => i != item) : [...array, item];

const toggleWall = (domNode) => {
  domNode.dataset.wall = domNode.dataset.wall === "false" ? "true" : "false";
  if (domNode.dataset.wall === "true") domNode.classList.add("wall");
  if (domNode.dataset.wall === "false") domNode.classList.remove("wall");
  wallList = toggleArray(wallList, domNode.dataset.id);
};

const dragState = (state) => {
  const mouseDown = container.dataset.mouseDown;
  const clickStart = container.dataset.startMove;
  const clickEnd = container.dataset.endMove;

  if (state == "wall")
    return mouseDown == "true" && clickStart == "false" && clickEnd == "false";
  else if (state == "start") return mouseDown == "true" && clickStart == "true";
  else if (state == "end") return mouseDown == "true" && clickEnd == "true";
};

function mousedown() {
  container.dataset.mouseDown = true;
  const onStart = this.classList.contains("start");
  const onEnd = this.classList.contains("end");

  if (onStart) {
    container.dataset.startMove = true;
    return;
  }
  if (onEnd) {
    container.dataset.endMove = true;
    return;
  }
  toggleWall(this);
}

function mouseenter() {
  const onStartOrEnd =
    this.classList.contains("start") || this.classList.contains("end");

  if (onStartOrEnd) return;

  const draggingWall = dragState("wall");
  const draggingStart = dragState("start");
  const draggingEnd = dragState("end");

  if (draggingWall) {
    toggleWall(this);
  } else if (draggingStart) {
    let node = document.createElement("div");
    node.classList.add("possibleStart");
    this.appendChild(node);
  } else if (draggingEnd) {
    let node = document.createElement("div");
    node.classList.add("possibleEnd");
    this.appendChild(node);
  } else {
    return;
  }
}

function mouseleave() {
  const draggingStart = dragState("start");
  const draggingEnd = dragState("end");

  if (draggingStart) {
    this.classList.remove("start");
    let node = document.getElementsByClassName("possibleStart")[0];
    this.removeChild(node);
  }
  if (draggingEnd) {
    this.classList.remove("end");
    let node = document.getElementsByClassName("possibleEnd")[0];
    this.removeChild(node);
  }
}

function mouseup() {
  const dragStartOrEnd = dragState("start") || dragState("end");

  // if moving start or end, then update their final position to the start and end node arrays
  if (dragStartOrEnd) {
    const row = parseInt(this.dataset.row);
    const col = parseInt(this.dataset.col);
    if (clickStart == "true") startLoc = [row, col];
    if (clickEnd == "true") endLoc = [row, col];
  }

  // remove duplicate entries in wallList by converting to set and then back to array
  wallList = Array.from(new Set(wallList));
  // reset whole board with new information on wall location and start / end location
  reset();
}

function clearBoard() {
  container.innerHTML = "";
  container.dataset.startMove = false;
  container.dataset.endMove = false;
  container.dataset.mouseDown = false;
  let aGrid = new grid(25, 50, startLoc, endLoc);
  console.log(aGrid);

  aGrid.createNodes();
  createDOMGrid(aGrid, container);
}

function reset() {
  const runButton = document.getElementsByClassName("run")[0];
  const newrunButton = runButton.cloneNode(true);
  runButton.parentNode.replaceChild(newrunButton, runButton);
  container.innerHTML = "";
  container.dataset.mouseDown = false;
  main();
}

const setAlgo = (name, grid) => {
  let runButton = document.getElementsByClassName("run")[0];
  runButton.innerHTML = "run";

  if (name === "dijkstra") {
    runButton.addEventListener("click", () => {
      runButton.innerHTML = "running...";
      grid.animateDijkstra();
    });
  }

  if (name === "a*") {
    runButton.addEventListener("click", () => {
      runButton.innerHTML = "running...";
      grid.animateAStar();
    });
  }
};

export function main() {
  container.dataset.startMove = false;
  container.dataset.endMove = false;
  container.dataset.mouseDown = false;

  let aGrid = new grid(25, 50, startLoc, endLoc);

  aGrid.createNodes();

  if (wallList.length > 0) {
    aGrid.setWalls(wallList);
  }

  createDOMGrid(aGrid, container);

  let algoSelect = document.getElementsByClassName("algoSelect")[0];
  algoSelect.addEventListener("change", reset);

  let algoOption = algoSelect.options[algoSelect.selectedIndex].value;

  setAlgo(algoOption, aGrid);

  let clearButton = document.getElementsByClassName("clear")[0];
  clearButton.addEventListener("click", () => {
    aGrid.unsetWalls(wallList);
    setTimeout(() => {
      wallList = [];
      clearBoard();
    }, 0);
  });

  let resetButton = document.getElementsByClassName("reset")[0];
  resetButton.addEventListener("click", reset);
}
