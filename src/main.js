import grid from "./grid.js";

// setting intial values for walls, start and end loci, and overall container for DOM representation of nodes
// when grid is rerendered on mouseup, the arrays store the values that need to be passed into the grid to update walls, weights, and start/end locations
const container = document.getElementsByClassName("nodeContainer")[0];
let weight = 10;
let wallList = [];
let weightList = [];
let startLoc = [3, 3];
let endLoc = [23, 23];

const wallButton = document.getElementsByClassName("wallButton")[0];
const weightButton = document.getElementsByClassName("weightButton")[0];
const colorButton = document.getElementsByClassName("colorToggle")[0];

wallButton.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("r1").click();
  }
});
weightButton.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("r2").click();
  }
});
colorButton.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("toggle").click();
  }
});

/** Creates DOM node / div for each node in the heap and assigns them certain parameters on their datasets and event listeners
 * @param  {object} grid - the collection of all nodes
 * @param  {object} container - the location on the DOM that the nodes will be rendered as divs
 */
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

    // if flagged as weight, and not start, end, or weight, display a wall
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

    // if going to be end of column, or end of row, style differently (bc of borders)
    const lastInRow = node.col % grid.numCols == 0;
    const lastInCol = node.row == grid.numRows;
    if (lastInRow) {
      domNode.classList.add("row--end");
    }
    if (lastInCol) {
      domNode.classList.add("col--end");
    }

    // add event listeners for each node
    domNode.addEventListener("pointerdown", mousedown);
    domNode.addEventListener("pointerup", mouseup);
    domNode.addEventListener("pointerenter", mouseenter);
    domNode.addEventListener("pointerleave", mouseleave);
    domNode.addEventListener("touchmove", mouseenter);

    frag.appendChild(domNode);
  });

  container.appendChild(frag);
}

/** Toggles the presence of an item in an array.
 * @param  {array} array -- array that needs to be mutated
 * @param  {any} item -- item that needs to toggled
 */
const toggleArray = (array, item) =>
  array.includes(item) ? array.filter((i) => i != item) : [...array, item];

/** Toggles the presence of a wall for a given DOM node / div on screen and records the change so that this state can be updated internally
 * @param  {HTMLElement} domNode -- a given div representing a node on the screen
 */
const toggleWall = (domNode) => {
  // toggle state of domNode's wall dataset value
  domNode.dataset.wall = domNode.dataset.wall == "false" ? "true" : "false";

  // if is a wall now, add the wall class styling, ONLY if is not already a weight
  if (domNode.dataset.wall === "true") {
    if (domNode.dataset.isWeight == "true") {
      return;
    }
    domNode.classList.add("wall");
  }

  // else remove the wall styling
  if (domNode.dataset.wall === "false") {
    domNode.classList.remove("wall");
    domNode.classList.remove("wall--quiet");
  }

  // add / remove id of wall added/removed to the list of walls
  wallList = toggleArray(wallList, domNode.dataset.id);
};
/**Toggles the presence of a wall for a given DOM node / div on screen and records the change so that this state can be updated internally
 * @param  {HTMLElement} domNode -- a given div representing a node on the screen
 */
const toggleWeight = (domNode) => {
  // toggle state
  domNode.dataset.isWeight =
    domNode.dataset.isWeight === "false" ? "true" : "false";

  // if weight, add nested div and add other values, ONLY if not already wall
  if (domNode.dataset.isWeight == "true") {
    if (domNode.dataset.wall == "true") {
      return;
    }
    domNode.dataset.weight = weight;
    domNode.dataset.isWeight = "true";
    let node = document.createElement("div");
    node.classList.add("weight");
    domNode.appendChild(node);

    // else remove inner div and reset weight to min value
  } else if (domNode.dataset.isWeight == "false") {
    domNode.dataset.weight = 1;
    domNode.dataset.isWeight = "false";
    domNode.innerHTML = "";
  }

  // add / remove id of weight added/removed to the list of walls
  weightList = toggleArray(weightList, domNode.dataset.id);
};

/** Takes in a state to be checked and then looks at container dataset to see if that state is active or not. Was helpful in reducing repaeated code all across the mouse functions.
 * Returns boolean value of whether the app is in that state (T) or not (F)
 * @param  {String} state -- the state that needs to be checked
 */

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

/** Assigns DOM nodes different properties based on
 * @param  {Event} event -- the standard JS event object
 */
function mousedown(event) {
  container.dataset.mouseDown = true;
  const onStart = this.classList.contains("start");
  const onEnd = this.classList.contains("end");

  if (this != event.target) {
    let parent = event.target.parentElement;
    parent.dataset.weight = 1;
    parent.dataset.isWeight = "false";
    parent.innerHTML = "";
  }

  if (onStart) {
    container.dataset.startMove = true;
    return;
  } else if (onEnd) {
    container.dataset.endMove = true;
    return;
  }

  const choseWall = document.getElementById("wallOption").checked;
  const choseWeight = document.getElementById("weightOption").checked;

  if (choseWall) {
    container.dataset.settingWalls = true;
    toggleWall(this);
  } else if (
    choseWeight &&
    (container.dataset.startMove == "false" ||
      container.dataset.endMove == "false")
  ) {
    container.dataset.settingWeights = true;
    toggleWeight(this);
  }
}

function mouseenter(event) {
  if (this != event.target) {
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
  console.log(container.dataset.startMove);
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
  } else {
    setTimeout(() => {
      reset();
    }, 0);
  }
}

function setAlgo(name, grid) {
  let infoAlert = document.getElementsByClassName("info--text")[0];
  let weightButtonVisual = document.getElementsByClassName("weightButton")[0];
  let weightButtonRadio = document.getElementById("weightOption");

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

  let aGrid = /Mobi|Android/i.test(navigator.userAgent)
    ? new grid(25, 25, startLoc, endLoc)
    : new grid(25, 50, startLoc, endLoc);

  aGrid.createNodes();

  if (wallList.length > 0) {
    aGrid.setWalls(wallList);
  }

  if (weightList.length > 0) {
    aGrid.setWeights(weightList, weight);
  }

  createDOMGrid(aGrid, container);

  let algoSelect = document.getElementsByClassName("algoSelect")[0];
  let algoOption = algoSelect.options[algoSelect.selectedIndex].value;
  setAlgo(algoOption, aGrid);

  algoSelect.addEventListener("change", function () {
    clearDOMWeights(aGrid);
    let algoOption = algoSelect.options[algoSelect.selectedIndex].value;
    setAlgo(algoOption, aGrid);
  });

  let clearButton = document.getElementsByClassName("clear")[0];
  clearButton.addEventListener("click", clear.bind(null, aGrid));

  let resetButton = document.getElementsByClassName("reset")[0];
  resetButton.addEventListener("click", reset);
}
