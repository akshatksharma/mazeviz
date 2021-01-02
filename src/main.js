import grid from "./grid.js";

/**
 * @MAZEVIZ
 */

// this is a site to visualize common pathfinding algorithms
// the main logic for the site is in this file, but the specifics for each algorithm and the grid that they use is found in other files in the repo

// the main flow of the site is to build up temporary lists of wall locations, weight locations, start and end node locations, and to then use those to update the internal grid that the algorithms actually use
// the temp lists are built up during mouse events and the actual updating is done on the "main" function
// the trick of "updating" the scteen is simply removing all of the nodes and then redrawing it based on updated parameters

// many of the functions here set and read flags onto the container for the whole grid. I refer to these flags as a "state"
// these states help communicate between functions and allow them to behave in different ways in different scenarios

//
//
//

// container that will hold the grid
const container = document.getElementsByClassName("nodeContainer")[0];

// initial parameters for the grid
// these will be updated throughout the functions below as the user makes changes to the screen

// value of the weights
let weight = 10;
// list of coordinates for the walls and weights on the screen
let wallList = [];
let weightList = [];
// coordinates for the start and end positions
let startLoc = [3, 3];
let endLoc = [23, 23];

export function main() {
  // reseting all states back to default
  container.dataset.startMove = false;
  container.dataset.endMove = false;
  container.dataset.mouseDown = false;
  container.dataset.settingWalls = false;
  container.dataset.settingWeights = false;

  // based on mobile / desktop, making an internal grid of appropriate size
  // I know user agent detection is bad, but this is a stopgap until I get time to implement a better system to make the site somewhat responsive

  let aGrid = /Mobi|Android/i.test(navigator.userAgent)
    ? new grid(25, 25, startLoc, endLoc)
    : new grid(25, 50, startLoc, endLoc);

  // inserting the appropriate amount of nodes into the grid's heap
  // the heap is represented as an array and is used for all algorithms, but is only used as a heap for Dijkstra's and A*. For Bfs is used as a queue, and Dfs, is used as a stack
  aGrid.createNodes();

  // setting the appropriate nodes in the heap as a wall
  if (wallList.length > 0) {
    aGrid.setWalls(wallList);
  }

  // setting the appropriate nodes in the heap as a weight
  if (weightList.length > 0) {
    aGrid.setWeights(weightList, weight);
  }

  // creating the divs on screen based upon the internal representation of the grid
  // the visualization will now match the internal state
  createDOMGrid(aGrid, container);

  // getting the algorithm selected by the user and calling setAlgo to put the approriate event listeners to trigger that algo
  let algoSelect = document.getElementsByClassName("algoSelect")[0];
  let algoOption = algoSelect.options[algoSelect.selectedIndex].value;
  setAlgo(algoOption, aGrid);

  // putting an event listener to setAlgo when user changes an algorithm

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

// setting intial values for walls, start and end loci, and overall container for DOM representation of nodes
// when grid is rerendered on mouseup, the arrays store the values that need to be passed into the grid to update walls, weights, and start/end locations

const wallButton = document.getElementsByClassName("wallButton")[0];
const weightButton = document.getElementsByClassName("weightButton")[0];
const colorButton = document.getElementsByClassName("colorToggle")[0];

wallButton.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("wallOption").click();
  }
});
weightButton.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click

    document.getElementById("weightOption").click();
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

/**
 * Creates DOM node / div for each node in the heap and assigns them certain parameters on their datasets and event listeners
 * @param  {Grid} grid - the collection of all nodes and their states
 * @param  {HTMLElement} container - the location on the DOM that the nodes will be rendered as divs
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

/**
 * toggleArray()
 * Utility function that toggles the presence of an item in an array.
 * @param  {array} array -- array that needs to be mutated
 * @param  {any} item -- item that needs to toggled
 */
const toggleArray = (array, item) =>
  array.includes(item) ? array.filter((i) => i != item) : [...array, item];

/**
 * toggleWall()
 * Toggles the presence of a wall for a given DOM node / div on screen and records the change so that this state can be updated internally
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

/**
 * toggleWeight()
 * Toggles the presence of a wall for a given DOM node / div on screen and records the change so that this state can be updated internally
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

/**
 * dragState()
 * Takes in a state to be checked and then looks at container dataset to see if that state is active or not. Was helpful in reducing repaeated code all across the mouse functions.
 * Returns boolean value of whether the app is in that state (T) or not (F)
 * @param  {String} state -- the state that needs to be checked
 */
const dragState = (state) => {
  // getting all the relavent parameters to check the current state from the dataset properties on the container
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

/**
 * mousedown()
 * Sets a flag / state and then assigns the div properties based on that state.
 * The state put upon it changes based on if the div corresponds to a start/end node or wall/weight node. This state is used by other event listeners as needed
 *
 */
function mousedown() {
  // set global state to mouseDown
  container.dataset.mouseDown = true;

  // check if the element that the click event is attached to (i.e this) is a start or end node
  const onStart = this.classList.contains("start");
  const onEnd = this.classList.contains("end");

  // if on start or end, set the global state to "moving start or end" and return.
  // return here because if moving start or end nodes, then do not want to set walls/weights etc

  if (onStart) {
    container.dataset.startMove = true;
    return;
  } else if (onEnd) {
    container.dataset.endMove = true;
    return;
  }

  // else, if not moving start or end, see if need to set wall or weight
  // set the settingWalls or settingWeights state and then actually carry out the wall / weight addition  via the function calls

  const choseWall = document.getElementById("wallOption").checked;
  const choseWeight = document.getElementById("weightOption").checked;

  if (choseWall) {
    container.dataset.settingWalls = true;
    toggleWall(this);
  } else if (choseWeight) {
    container.dataset.settingWeights = true;
    toggleWeight(this);
  }
}

/**
 *  mouseenter()
 *  Uses the states set on mousedown event to figure out what to do when hoving over a div. This simulates a drag gesture.
 *  (i.e if moused down to make wall, then continue to make walls on other nearby divs)
 */
function mouseenter() {
  const onStartOrEnd =
    this.classList.contains("start") || this.classList.contains("end");

  // dont do anything if the div you are hovering over is the start or end
  if (onStartOrEnd) return;

  // figure out what is the state of the application

  const draggingWall = dragState("wall");
  const draggingWeight = dragState("weight");
  const draggingStart = dragState("start");
  const draggingEnd = dragState("end");

  // carry out the action accordingly

  if (draggingWall) {
    toggleWall(this);
  } else if (draggingWeight) {
    toggleWeight(this);
  } else if (draggingStart) {
    // indicator div to show possible start location
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

/**
 * mouseleave()
 * If dragging the start / end, this removes the possible start / end nodes from a div once the mouse leaves
 */
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

/**
 * mouseup()
 * Once the user finishes dragging / editing the grid and lets their mouse up, this function is called
 * After their editing event, the calls made to toggleWall() and toggleWeight() will ensure the wallList and weightList will contain all of the walls / weights that need to be set
 * The start and end coordinates will need to updated if they were being dragged
 */
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

  // at this point, the grid is up to date on the wall / weight placement and start / end placement

  // reset whole board and draw with this new information
  reset();
}

/**
 * resetEventListener()
 * Force removes event listener by cloning button and reattaching it
 * This is a hacky fix and needs to be updated to use the proper removeEventListener function
 * @param {HTMLElement} button
 */
function resetEventListener(button) {
  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);
}

/**
 * reset()
 * Resets the entire board, but preserves the wall/weight/start node/end node parameters
 */
function reset() {
  // removes all of the divs in the grid
  container.innerHTML = "";

  const runButton = document.getElementsByClassName("run")[0];
  resetEventListener(runButton);

  // to make the path appear in grid.visualize, many setTimeout functions are called
  // if there are timeouts that still need to appear, they must be taken off the event loop queue before they are called

  let timerId = container.dataset.timerId;
  while (timerId--) {
    // each timeout function is given an id, and can be removed with window.clearTimeout()
    // will do nothing if no timeout with id is present
    window.clearTimeout(timerId);
  }

  // after board content is removed, call main() function with updated wallList, weightList, startLoc and endLoc
  // main will update the internal data structures in the Workers
  // because parameters were not reset, the board will redraw with the correct parameters

  main();
}

/**
 * clear()
 * Just like a call to reset(), but also reseting all of the wall and weight lists
 * @param {Grid} grid -- the collection of all nodes and their states
 */

function clear(grid) {
  // removing all the walls and weights from the internal grid representation
  grid.unsetWalls(wallList);
  grid.unsetWeights(weightList);

  // removing all the walls and weights from the temporary lists built up by user events
  setTimeout(() => {
    wallList = [];
    weightList = [];
    reset();
  }, 0);
}

/**
 * clearDOMWeights()
 * removing the weights from the grid if user selects unweighted alogorithm (Bfs/Dfs)
 * @param {Grid} grid -- the collection of all nodes and their states
 */
function clearDOMWeights(grid) {
  // checking value of algorithm select
  let algoSelect = document.getElementsByClassName("algoSelect")[0];
  let algoOption = algoSelect.options[algoSelect.selectedIndex].value;

  if (algoOption == "bfs" || algoOption == "dfs") {
    // removing weights if going to bfs or dfs and reseting, or just reseting alone
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

/**
 * setAlgo()
 * Swtiches the current algorithm
 * Swaps the functions called by each method, the flavor text at the bottom, and does some minor visual tweaks to buttons
 * @param {String} name -- name of the algorithm to switch to
 * @param {Grid} grid -- the collection of all nodes and their states
 */
function setAlgo(name, grid) {
  let infoAlert = document.getElementsByClassName("info--text")[0];
  let weightButtonVisual = document.getElementsByClassName("weightButton")[0];
  let weightButtonRadio = document.getElementById("weightOption");

  if (name === "dijkstra") {
    weightButtonVisual.style.filter = "brightness(100%)";
    infoAlert.innerHTML =
      "Dijkstra's Algorithm is weighted and guarantees the shortest path";
    weightButtonVisual.classList.remove("cursor-not-allowed");
    weightButtonRadio.disabled = false;
  }
  if (name === "a*") {
    weightButtonVisual.style.filter = "brightness(100%)";
    infoAlert.innerHTML = "A* is weighted and guarantees the shortest path";
    weightButtonVisual.classList.remove("cursor-not-allowed");
    weightButtonRadio.disabled = false;
  }
  if (name === "bfs") {
    // dimming the weight button (bc cannot press it)
    weightButtonVisual.style.filter = "brightness(80%)";
    infoAlert.innerHTML =
      "Breath First Search is NOT weighted but guarantees the shortest path";

    // adding visual indicators that weights cannot be used
    weightButtonVisual.classList.add("cursor-not-allowed");
    weightButtonRadio.disabled = true;
  }
  if (name === "dfs") {
    weightButtonVisual.style.filter = "brightness(80%)";
    infoAlert.innerHTML =
      "Depth First Search is NOT weighted and DOES NOT guarantee the shortest path";
    weightButtonVisual.classList.add("cursor-not-allowed");
    weightButtonRadio.disabled = true;
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
