import minheap from "./minheap.js";
import node from "./node_.js";

export default class grid {
  constructor(numRows, numCols, container) {
    this.container = container;
    this.heap = new minheap();
    this.nodeGrid;
    this.domGrid;
    this.numRows = numRows;
    this.numCols = numCols;

    this.startLoc = 5;
    this.endLoc = 10;

    this.startNode;
    this.endNode;
  }

  createNodes() {
    this.nodeGrid = [];
    let loc = 1;
    for (let r = 1; r <= this.numRows; r++) {
      let row = [];
      for (let c = 1; c <= this.numCols; c++) {
        let node_ = new node(r, c, this, this.heap, loc);
        row[c] = node_;
        this.heap.insert(node_);
        loc++;
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
      return domNode;
    });

    this.domGrid = domGrid;

    // console.log(this.domGrid);
    container.appendChild(frag);
  }
}
