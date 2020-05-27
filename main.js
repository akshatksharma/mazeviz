import grid from "./grid.js";

function createDOMGrid(grid, container) {
  console.log(grid);

  const frag = document.createDocumentFragment();

  grid.heap.array.forEach((node) => {
    let domNode = document.createElement("div");

    domNode.className = "node";
    domNode.id = `node: ${node.row}, ${node.col}`;
    domNode.dataset.visited = node.visited;

    if (node.wall) {
      domNode.dataset.wall = true;
    }

    // styling stuff
    if (node.isStart(grid.startLoc)) {
      grid.startNode = node;
      domNode.classList.add("start");
    }
    if (node.isEnd(grid.endLoc)) {
      grid.endNode = node;
      domNode.classList.add("end");
    }
    if (node.col % grid.numRows == 0) {
      domNode.classList.add("row--end");
    }
    if (node.row == grid.numRows) {
      domNode.classList.add("col--end");
    }

    frag.appendChild(domNode);
  });

  container.appendChild(frag);
}

function run() {
  let container = document.getElementsByClassName("nodeContainer")[0];
  let aGrid = new grid(50, 50);

  aGrid.createNodes();
  createDOMGrid(aGrid, container);

  let yes = document.getElementsByClassName("run")[0];
  yes.addEventListener("click", () => {
    yes.innerHTML = "running...";
    aGrid.shortestPath();
  });
}

run();
