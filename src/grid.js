import minheap from "./minheap.js";
import node from "./node_.js";

export default class grid {
  constructor(numRows, numCols, startLoc, endLoc) {
    this.heap = new minheap();
    this.nodeGrid;
    this.numRows = numRows;
    this.numCols = numCols;

    // row, col
    this.startLoc = startLoc;
    this.endLoc = endLoc;

    this.startNode;
    this.endNode;

    this.orderedPath;
    this.exploredNodes;
  }

  createNodes() {
    this.nodeGrid = [];
    let id = 1;
    let loc = 1;
    for (let r = 1; r <= this.numRows; r++) {
      let row = [];
      for (let c = 1; c <= this.numCols; c++) {
        let node_ = new node(r, c, 1, this, id, this.heap, loc);
        row[c] = node_;
        this.heap.insert(node_);
        loc++;
        id++;
      }
      this.nodeGrid[r] = row;
    }
  }

  setWalls(...args) {
    let ids = args[0];
    ids.forEach((id) => {
      id = parseInt(id);
      this.heap.array[id].wall = true;
    });
  }

  unsetWalls(...args) {
    let ids = args[0];
    if (ids.length == 0) return;
    ids.forEach((id) => {
      id = parseInt(id);
      this.heap.array[id].wall = false;
    });
  }

  setWeights(...args) {
    let ids = args[0];
    let weight = args[1];
    ids.forEach((id) => {
      id = parseInt(id);
      this.heap.array[id].weight = weight;
    });
  }

  unsetWeights(...args) {
    let ids = args[0];
    if (ids.length == 0) return;
    ids.forEach((id) => {
      id = parseInt(id);
      this.heap.array[id].weight = 1;
    });
  }

  animateDijkstra() {
    let colorTiles = document.getElementsByClassName("toggle")[0].checked;
    let worker = new Worker("dijkstra.js");
    const speedOption = this.animateSetup(worker);

    worker.postMessage([this.startNode.id, this.heap, speedOption]);

    worker.onmessage = (e) => {
      this.animate(e);
    };
  }

  animateAStar() {
    let worker = new Worker("aStar.js");
    const speedOption = this.animateSetup(worker);

    worker.postMessage([
      this.startNode.id,
      this.endNode.id,
      this.heap,
      speedOption,
    ]);

    worker.onmessage = (e) => {
      this.animate(e);
    };
  }

  animatebfs() {
    let worker = new Worker("bfs.js");
    const speedOption = this.animateSetup(worker);

    worker.postMessage([this.startNode.id, this.heap, speedOption]);

    worker.onmessage = (e) => {
      this.animate(e);
    };
  }

  animatedfs() {
    let worker = new Worker("dfs.js");
    const speedOption = this.animateSetup(worker);

    worker.postMessage([this.startNode.id, this.heap, speedOption]);

    worker.onmessage = (e) => {
      this.animate(e);
    };
  }

  animateSetup(worker) {
    let runButton = document.getElementsByClassName("run")[0];
    let clearButton = document.getElementsByClassName("clear")[0];
    let resetButton = document.getElementsByClassName("reset")[0];

    clearButton.addEventListener("click", function () {
      worker.terminate();
      runButton.innerHTML = "run";
    });

    resetButton.addEventListener("click", function () {
      worker.terminate();
      runButton.innerHTML = "run";
    });

    let speedSelect = document.getElementsByClassName("speedSelect")[0];
    let speedOption = speedSelect.options[speedSelect.selectedIndex].value;

    return speedOption;
  }

  animate(e) {
    let runButton = document.getElementsByClassName("run")[0];
    let colorTiles = document.getElementsByClassName("toggle")[0].checked;

    const [, , status] = e.data;
    const [, finished] = e.data;
    if (status == "failed") {
      runButton.innerHTML = "done";
      return;
    }
    if (finished) {
      let [exploredNodes] = e.data;
      let endNode = exploredNodes.pop();
      let orderedPath = [endNode];

      let currNode = endNode;
      while (currNode.prevNode != null) {
        orderedPath.splice(0, 0, currNode.prevNode);
        currNode = currNode.prevNode;
      }
      this.orderedPath = orderedPath;
      this.visualize();
      runButton.innerHTML = "done";
    } else {
      let [exploredNodes] = e.data;
      exploredNodes.forEach((node) => {
        let domNode = document.getElementById(`node: ${node.row}, ${node.col}`);
        if (colorTiles) {
          domNode.classList.add("colorOn");
        } else {
          domNode.classList.add("colorOff");
        }
        domNode.classList.add("visited");
      });
    }
  }

  visualize() {
    const container = document.getElementsByClassName("nodeContainer")[0];

    for (let i = 0; i < this.orderedPath.length; i++) {
      let timer = setTimeout(() => {
        // console.log(i);
        let { row, col } = this.orderedPath[i];
        let DOMelem = document.getElementById(`node: ${row}, ${col}`);
        DOMelem.classList.add("path");
      }, 50 * i);
      container.dataset.timerId = timer;
    }
  }
}
