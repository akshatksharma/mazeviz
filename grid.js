import minheap from "./minheap.js";
import node from "./node_.js";

export default class grid {
  constructor(numRows, numCols) {
    this.heap = new minheap();
    this.nodeGrid;
    this.numRows = numRows;
    this.numCols = numCols;

    // row, col
    this.startLoc = [19, 15];
    this.endLoc = [15, 35];

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
      console.log(this.heap.array);
    });
  }

  shortestPath() {
    let clearButton = document.getElementsByClassName("clear")[0];
    clearButton.addEventListener("click", () => {
      worker.terminate();
      let runButton = document.getElementsByClassName("run")[0];
      runButton.innerHTML = "run";
    });

    let worker = new Worker("dijkstra.js", { type: "module" });

    worker.postMessage([this.startNode.id, this.heap]);

    worker.onmessage = (e) => {
      const [, , status] = e.data;
      const [, finished] = e.data;
      if (status == "failed") {
        let runButton = document.getElementsByClassName("run")[0];
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
        this.animate();
      } else {
        let [exploredNodes] = e.data;
        exploredNodes.forEach((node) => {
          let domNode = document.getElementById(
            `node: ${node.row}, ${node.col}`
          );
          domNode.dataset.visited = true;
        });
      }
    };
  }

  animate() {
    for (let i = 0; i < this.orderedPath.length; i++) {
      setTimeout(() => {
        let { row, col } = this.orderedPath[i];
        let DOMelem = document.getElementById(`node: ${row}, ${col}`);
        DOMelem.dataset.path = "true";

        if (i == this.orderedPath.length - 1) {
          let runButton = document.getElementsByClassName("run")[0];
          runButton.innerHTML = "done";
        }
      }, 50 * i);
    }
  }
}
