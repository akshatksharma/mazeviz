import minheap from "./minheap.js";
import node from "./node_.js";

export default class grid {
  constructor(numRows, numCols) {
    this.heap = new minheap();
    this.nodeGrid;
    this.numRows = numRows;
    this.numCols = numCols;

    // row, col
    this.startLoc = [15, 15];
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
        let node_ = new node(r, c, this, id, this.heap, loc);
        row[c] = node_;
        this.heap.insert(node_);
        loc++;
        id++;
      }
      this.nodeGrid[r] = row;
    }
  }

  shortestPath() {
    let worker = new Worker("dijkstra.js", { type: "module" });

    console.log("location to start dijkstra at: ");
    console.log(this.startNode.id);
    console.log("heap being passed into webworker");
    console.log(this.heap);

    worker.postMessage([this.startNode.id, this.heap]);
    console.log("message sent to worker");

    worker.onmessage = function (e) {
      // console.log(e);
      let [, finished] = e.data;
      if (finished) {
        let [exploredNodes] = e.data;
        let endNode = exploredNodes.pop();
        let orderedPath = [endNode];

        let currNode = endNode;
        while (currNode.prevNode != null) {
          orderedPath.splice(0, 0, currNode.prevNode);
          // console.log(currNode);
          currNode = currNode.prevNode;
        }
        this.orderedPath = orderedPath;
        console.log(orderedPath);
        for (let i = 0; i < this.orderedPath.length; i++) {
          setTimeout(() => {
            let { row, col } = this.orderedPath[i];
            let DOMelem = document.getElementById(`node: ${row}, ${col}`);
            DOMelem.dataset.path = "true";
          }, 50 * i);
        }
        document.getElementsByClassName("run")[0].innerHTML = "done";
      } else {
        let [exploredNodes] = e.data;
        console.log(exploredNodes);
        exploredNodes.forEach((node) => {
          let domNode = document.getElementById(
            `node: ${node.row}, ${node.col}`
          );
          domNode.dataset.visited = true;
        });
      }
    };
  }
}
