import minheap from "./minheap.js";
import node from "./node_.js";

export default class grid {
  constructor(numRows, numCols, container) {
    this.container = container;
    this.heap = new minheap();
    this.domGrid;
    this.numRows = numRows;
    this.numCols = numCols;

    this.startRow = 15;
    this.startCol = 15;

    this.endRow = 15;
    this.endCol = 40;
  }

  createNodes() {
    let id = 1;
    let loc = 1;
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        let node_ = new node(row, col, id, this.heap, loc);
        this.heap.insert(node_);
        id++;
        loc++;
      }
    }
  }

  createGrid() {
    // create grid of nodes w/ forEach or map
    const frag = document.createDocumentFragment();
    let container = this.container;

    let domGrid = this.heap.array.map((node) => {
      let domNode = document.createElement("div");

      domNode.className = "node";
      domNode.id = node.id;
      domNode.dataset.distance = node.distance;
      domNode.dataset.visited = node.visited;
      domNode.dataset.col = node.col;
      domNode.dataset.row = node.row;

      // styling stuff
      if (node.isStart(this.startRow, this.startCol)) {
        domNode.classList.add("start");
      }

      if (node.isStart(this.endRow, this.endCol)) {
        domNode.classList.add("end");
      }

      if (node.id % this.numRows == 0) {
        domNode.classList.add("row--end");
      }

      if (node.row == this.numRows - 1) {
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
