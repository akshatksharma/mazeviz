import minheap from "./minheap.js";
import node from "./node_.js";
import dijkstra from "./dijkstra.js";

export default class grid {
  constructor(numRows, numCols, container) {
    this.container = container;
    this.heap = new minheap();
    this.nodeGrid;
    this.domGrid;
    this.numRows = numRows;
    this.numCols = numCols;

    // row, col
    this.startLoc = [1, 25];
    this.endLoc = [4, 25];

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
  createGrid() {
    // create grid of nodes w/ forEach or map
    const frag = document.createDocumentFragment();
    let container = this.container;

    let domGrid = this.heap.array.map((node) => {
      let domNode = document.createElement("div");

      domNode.className = "node";
      domNode.id = `node: ${node.row}, ${node.col}`;
      domNode.dataset.visited = node.visited;

      // styling stuff
      if (node.isStart(this.startLoc)) {
        this.startNode = node;
        domNode.classList.add("start");
      }
      if (node.isEnd(this.endLoc)) {
        this.endNode = node;
        domNode.classList.add("end");
      }
      if (node.col % this.numRows == 0) {
        domNode.classList.add("row--end");
      }
      if (node.row == this.numRows) {
        domNode.classList.add("col--end");
      }

      frag.appendChild(domNode);
    });

    this.domGrid = domGrid;
    container.appendChild(frag);
  }

  shortestPath() {
    console.log("hello");
    let exploredNodes = dijkstra(this, this.heap);
    this.exploredNodes = exploredNodes;

    let endNode = exploredNodes.pop();
    let orderedPath = [endNode];

    let currNode = endNode;
    while (currNode.prevNode != null) {
      // console.log("hello");
      orderedPath.splice(0, 0, currNode.prevNode);
      console.log(currNode);
      currNode = currNode.prevNode;
    }
    this.orderedPath = orderedPath;
    this.animate();
  }

  animate() {
    // exploration
    // console.log(this.exploredNodes);
    // for (let i = 0; i < this.exploredNodes.length; i++) {
    //   setTimeout(() => {
    //     const { row, col } = this.exploredNodes[i];

    //     let domNode = document.getElementById(`node: ${row}, ${col}`);
    //     domNode.dataset.visited = "true";
    //   }, 5 * i);
    // }

    // path
    for (let i = 0; i < this.orderedPath.length; i++) {
      setTimeout(() => {
        let { row, col } = this.orderedPath[i];
        let DOMelem = document.getElementById(`node: ${row}, ${col}`);
        DOMelem.dataset.path = "true";
      }, 100 * i);
    }
  }
}
