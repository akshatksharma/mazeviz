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
let weightList = [];
let weight = 10;
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
    domNode.dataset.weight = node.weight;
    if (node.weight == 1) domNode.dataset.isWeight = false;
    else domNode.dataset.isWeight = true;

    // if flagged as wall, and not start or end, display a wall
    if (node.wall && !(node.isStart() && node.isEnd())) {
      domNode.dataset.wall = true;
      domNode.classList.add("wall--quiet");
    }

    if (node.weight > 1 && !(node.wall && node.isStart() && node.isEnd())) {
      let node = document.createElement("div");
      node.classList.add("weight--quiet");
      domNode.appendChild(node);
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
    domNode.addEventListener("mouseup", mouseup);
    domNode.addEventListener("mouseenter", mouseenter);
    domNode.addEventListener("mouseleave", mouseleave);

    frag.appendChild(domNode);
  });

  container.appendChild(frag);
}

// helper methods (and helper helper methods)
const toggleArray = (array, item) =>
  array.includes(item) ? array.filter((i) => i != item) : [...array, item];

const wallOrWeight = document.getElementsByClassName("controlForm")[0].elements[
  "control"
];

const toggleWall = (domNode) => {
  domNode.dataset.wall = domNode.dataset.wall == "false" ? "true" : "false";
  if (domNode.dataset.wall === "true") {
    if (domNode.dataset.isWeight == "true") {
      return;
    }
    domNode.classList.add("wall");
  }
  if (domNode.dataset.wall === "false") {
    domNode.classList.remove("wall");
    domNode.classList.remove("wall--quiet");
  }
  wallList = toggleArray(wallList, domNode.dataset.id);
};

const toggleWeight = (domNode) => {
  domNode.dataset.isWeight =
    domNode.dataset.isWeight === "false" ? "true" : "false";

  if (domNode.dataset.isWeight == "true") {
    if (domNode.dataset.wall == "true") {
      return;
    }
    domNode.dataset.weight = weight;
    domNode.dataset.isWeight = "true";
    let node = document.createElement("div");
    node.classList.add("weight");

    domNode.appendChild(node);
  } else if (domNode.dataset.isWeight == "false") {
    domNode.dataset.weight = 1;
    domNode.dataset.isWeight = "false";
    domNode.innerHTML = "";
  }

  weightList = toggleArray(weightList, domNode.dataset.id);
};

const dragState = (state) => {
  const mouseDown = container.dataset.mouseDown;
  const settingWalls = container.dataset.settingWalls;
  const settingWeights = container.dataset.settingWeights;
  const clickStart = container.dataset.startMove;
  const clickEnd = container.dataset.endMove;

  if (state == "wall")
    return (
      mouseDown == "true" &&
      settingWalls == "true" &&
      clickStart == "false" &&
      clickEnd == "false"
    );
  else if (state == "weight")
    return (
      mouseDown == "true" &&
      settingWeights == "true" &&
      clickStart == "false" &&
      clickEnd == "false"
    );
  else if (state == "start") return mouseDown == "true" && clickStart == "true";
  else if (state == "end") return mouseDown == "true" && clickEnd == "true";
};

function mousedown(event) {
  container.dataset.mouseDown = true;
  const onStart = this.classList.contains("start");
  const onEnd = this.classList.contains("end");

  if (this != event.target) {
    console.log(event.target);
    let parent = event.target.parentElement;
    parent.dataset.weight = 1;
    parent.dataset.isWeight = "false";
    parent.innerHTML = "";
  }

  if (onStart) {
    container.dataset.startMove = true;
    return;
  }
  if (onEnd) {
    container.dataset.endMove = true;
    return;
  }
  // if radio for wall in bottom bar is selected, toggle wall
  if (wallOrWeight.value == "wall") {
    container.dataset.settingWalls = true;
    toggleWall(this);
  } else if (wallOrWeight.value == "weight") {
    container.dataset.settingWeights = true;
    toggleWeight(this);
  }
}

function mouseenter(event) {
  if (this != event.target) {
    console.log(event.target);
    let parent = event.target.parentElement;
    parent.dataset.weight = 1;
    parent.dataset.isWeight = "false";
    parent.innerHTML = "";
  }

  const onStartOrEnd =
    this.classList.contains("start") || this.classList.contains("end");

  if (onStartOrEnd) return;

  const draggingWall = dragState("wall");
  const draggingWeight = dragState("weight");
  const draggingStart = dragState("start");
  const draggingEnd = dragState("end");

  if (draggingWall) {
    toggleWall(this);
  } else if (draggingWeight) {
    toggleWeight(this);
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
    this.innerHTML = "";
  }
  if (draggingEnd) {
    this.classList.remove("end");
    this.innerHTML = "";
  }
}

function mouseup() {
  const draggingStart = dragState("start");
  const draggingEnd = dragState("end");
  const dragStartOrEnd = draggingStart || draggingEnd;

  // if moving start or end, then update their final position to the start and end node arrays
  if (dragStartOrEnd) {
    const row = parseInt(this.dataset.row);
    const col = parseInt(this.dataset.col);
    if (draggingStart) startLoc = [row, col];
    if (draggingEnd) endLoc = [row, col];
  }

  // remove duplicate entries in wallList by converting to set and then back to array
  wallList = Array.from(new Set(wallList));
  weightList = Array.from(new Set(weightList));
  // reset whole board with new information on wall location and start / end location
  reset();
}

function resetEventListener(button) {
  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);
}

function reset() {
  container.innerHTML = "";
  const runButton = document.getElementsByClassName("run")[0];
  resetEventListener(runButton);

  // to clear the path pattern being made by the setTimeouts in  grid.visualize()
  let timerId = container.dataset.timerId;
  while (timerId--) {
    window.clearTimeout(timerId); // will do nothing if no timeout with id is present
  }

  main();
}

function clear(grid) {
  grid.unsetWalls(wallList);
  grid.unsetWeights(weightList);
  setTimeout(() => {
    wallList = [];
    weightList = [];
    reset();
  }, 0);
}

function clearDOMWeights(grid) {
  let algoSelect = document.getElementsByClassName("algoSelect")[0];
  let algoOption = algoSelect.options[algoSelect.selectedIndex].value;

  if (algoOption == "bfs" || algoOption == "dfs") {
    grid.unsetWeights(weightList);
    setTimeout(() => {
      weightList = [];
      reset();
    }, 0);
  } else return;
}

function setAlgo(name, grid) {
  let infoAlert = document.getElementsByClassName("info--text")[0];
  let weightButtonVisual = document.getElementsByClassName("weightButton")[0];
  let weightButtonRadio = document.getElementById("r2");

  if (name === "dijkstra") {
    weightButtonVisual.classList.remove("cursor-not-allowed");
    weightButtonVisual.style.filter = "brightness(100%)";
    weightButtonRadio.disabled = false;
    infoAlert.innerHTML =
      "Dijkstra's Algorithm is weighted and guarantees the shortest path";
  }
  if (name === "a*") {
    weightButtonVisual.classList.remove("cursor-not-allowed");
    weightButtonVisual.style.filter = "brightness(100%)";
    weightButtonRadio.disabled = false;
    infoAlert.innerHTML = "A* is weighted and guarantees the shortest path";
  }
  if (name === "bfs") {
    weightButtonVisual.classList.add("cursor-not-allowed");
    weightButtonVisual.style.filter = "brightness(80%)";
    weightButtonRadio.disabled = true;
    infoAlert.innerHTML =
      "Breath First Search is NOT weighted but guarantees the shortest path";
  }
  if (name === "dfs") {
    weightButtonVisual.classList.add("cursor-not-allowed");
    weightButtonVisual.style.filter = "brightness(80%)";
    weightButtonRadio.disabled = true;
    infoAlert.innerHTML =
      "Depth First Search is NOT weighted and DOES NOT guarantee the shortest path";
  }

  let runButton = document.getElementsByClassName("run")[0];
  runButton.innerHTML = "run";

  runButton.addEventListener("click", function () {
    runButton.innerHTML = "running...";
    if (name === "dijkstra") grid.animateDijkstra();
    if (name === "a*") grid.animateAStar();
    if (name === "bfs") grid.animatebfs();
    if (name === "dfs") grid.animatedfs();
  });
}

export function main() {
  container.dataset.startMove = false;
  container.dataset.endMove = false;
  container.dataset.mouseDown = false;
  container.dataset.settingWalls = false;
  container.dataset.settingWeights = false;

  let aGrid = new grid(25, 50, startLoc, endLoc);

  aGrid.createNodes();

  if (wallList.length > 0) {
    aGrid.setWalls(wallList);
  }

  if (weightList.length > 0) {
    aGrid.setWeights(weightList, weight);
  }

  createDOMGrid(aGrid, container);

  let algoSelect = document.getElementsByClassName("algoSelect")[0];
  algoSelect.addEventListener("change", clearDOMWeights.bind(null, aGrid));
  let algoOption = algoSelect.options[algoSelect.selectedIndex].value;
  setAlgo(algoOption, aGrid);

  let clearButton = document.getElementsByClassName("clear")[0];
  clearButton.addEventListener("click", clear.bind(null, aGrid));

  let resetButton = document.getElementsByClassName("reset")[0];
  resetButton.addEventListener("click", reset);
}
