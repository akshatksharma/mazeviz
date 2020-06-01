import grid from "./grid.js";

function handleFirstTab(e) {
  if (e.keyCode === 9) {
    // the "I am a keyboard user" key
    document.body.classList.add("user-is-tabbing");
    window.removeEventListener("keydown", handleFirstTab);
  }
}

window.addEventListener("keydown", handleFirstTab);

let wallList = [];
let startLoc = [14, 15];
let endLoc = [14, 36];

function createDOMGrid(grid, container) {
  const frag = document.createDocumentFragment();

  grid.heap.array.forEach((node) => {
    let domNode = document.createElement("div");

    // setting initial parameters
    domNode.className = "node";
    domNode.id = `node: ${node.row}, ${node.col}`;
    domNode.dataset.id = node.id;
    domNode.dataset.row = node.row;
    domNode.dataset.col = node.col;
    domNode.dataset.visited = node.visited;
    domNode.dataset.wall = false;

    // styling based on paramaters
    if (node.wall && (!node.isStart() || !node.isEnd())) {
      domNode.dataset.wall = true;
      domNode.classList.add("wall");
    }

    if (!(node.isStart() && node.isEnd())) {
      domNode.dataset.possibleStart = false;
      domNode.dataset.possibleEnd = false;
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

    const toggleArray = (array, item) =>
      array.includes(item) ? array.filter((i) => i != item) : [...array, item];

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

      this.dataset.wall = this.dataset.wall === "false" ? "true" : "false";
      if (this.dataset.wall === "true") this.classList.add("wall");
      if (this.dataset.wall === "false") domNode.classList.remove("wall");
      wallList = toggleArray(wallList, this.dataset.id);
    }

    function mouseenter() {
      const mouseDown = container.dataset.mouseDown;
      const clickStart = container.dataset.startMove;
      const clickEnd = container.dataset.endMove;
      const onStartOrEnd =
        this.classList.contains("start") || this.classList.contains("end");

      if (onStartOrEnd) return;

      const draggingWall =
        mouseDown == "true" && clickStart == "false" && clickEnd == "false";
      const draggingStart = mouseDown == "true" && clickStart == "true";
      const draggingEnd = mouseDown == "true" && clickEnd == "true";

      if (draggingWall) {
        this.dataset.wall = this.dataset.wall === "false" ? "true" : "false";
        if (this.dataset.wall === "true") this.classList.add("wall");
        if (this.dataset.wall === "false") domNode.classList.remove("wall");
        wallList = toggleArray(wallList, this.dataset.id);
      } else if (draggingStart) {
        let node = document.createElement("div");
        node.classList.add("possibleStart");
        // node.dataset.possibleStart = true;
        this.appendChild(node);
      } else if (draggingEnd) {
        let node = document.createElement("div");
        node.classList.add("possibleEnd");
        // node.dataset.possibleEnd = true;
        this.appendChild(node);
      } else {
        return;
      }
    }

    function mouseleave() {
      const mouseDown = container.dataset.mouseDown;
      const clickStart = container.dataset.startMove;
      const clickEnd = container.dataset.endMove;

      if (clickStart && mouseDown == "true" && clickEnd != "true") {
        this.classList.remove("start");
      }
      if (clickEnd && mouseDown == "true" && clickStart != "true") {
        this.classList.remove("end");
      }
      const draggingStart = mouseDown == "true" && clickStart == "true";
      const draggingEnd = mouseDown == "true" && clickEnd == "true";
      if (draggingStart) {
        let node = document.getElementsByClassName("possibleStart")[0];
        console.log(node);
        this.removeChild(node);
      }
      if (draggingEnd) {
        let node = document.getElementsByClassName("possibleEnd")[0];
        this.removeChild(node);
      }
    }

    function mouseup() {
      const mouseDown = container.dataset.mouseDown;
      const clickStart = container.dataset.startMove;
      const clickEnd = container.dataset.endMove;
      const dragStartEnd =
        mouseDown == "true" && (clickStart == "true" || clickEnd == "true");

      if (dragStartEnd) {
        const row = parseInt(this.dataset.row);
        const col = parseInt(this.dataset.col);
        if (clickStart == "true") startLoc = [row, col];
        if (clickEnd == "true") endLoc = [row, col];
      }

      wallList = Array.from(new Set(wallList));

      // duplicate run button to remove event listener
      const runButton = document.getElementsByClassName("run")[0];
      const newrunButton = runButton.cloneNode(true);
      runButton.parentNode.replaceChild(newrunButton, runButton);
      container.innerHTML = "";
      container.dataset.mouseDown = false;
      main();
    }

    domNode.addEventListener("mousedown", mousedown);
    domNode.addEventListener("mouseenter", mouseenter);
    domNode.addEventListener("mouseup", mouseup);
    domNode.addEventListener("mouseleave", mouseleave);

    frag.appendChild(domNode);
  });

  container.appendChild(frag);
}

function clearBoard() {
  let container = document.getElementsByClassName("nodeContainer")[0];
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
  let container = document.getElementsByClassName("nodeContainer")[0];
  const runButton = document.getElementsByClassName("run")[0];
  const newrunButton = runButton.cloneNode(true);
  runButton.parentNode.replaceChild(newrunButton, runButton);
  container.innerHTML = "";
  container.dataset.mouseDown = false;
  main();
}

function pause() {}

function main() {
  let container = document.getElementsByClassName("nodeContainer")[0];
  container.dataset.startMove = false;
  container.dataset.endMove = false;
  container.dataset.mouseDown = false;
  let aGrid = new grid(25, 50, startLoc, endLoc);

  aGrid.createNodes();

  if (wallList.length > 0) {
    aGrid.setWalls(wallList);
  }

  createDOMGrid(aGrid, container);

  let runButton = document.getElementsByClassName("run")[0];
  runButton.innerHTML = "run";
  runButton.addEventListener("click", () => {
    runButton.innerHTML = "running...";
    aGrid.shortestPath();
  });

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

main();
