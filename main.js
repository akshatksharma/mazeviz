import node_ from "./node_.js";

export default class grid {
  constructor(numRows, numCols, container) {
    this.container = container;
    this.grid = [];
    this.domGrid;
    this.numRows = numRows;
    this.numCols = numCols;
  }

  createNodes() {
    let id = 1;
    for (let row = 0; row < this.numRows; row++) {
      let currRow = [];
      for (let col = 0; col < this.numCols; col++) {
        currRow.push(new node_(row, col, id));
        id++;
      }
      this.grid.push(currRow);
    }
  }

  createGrid() {
    // create grid of nodes w/ forEach or map
    const frag = document.createDocumentFragment();
    let container = this.container;

    let domGrid = this.grid.map((row) => {
      let domRow = row.map((node) => {
        let domNode = document.createElement("div");
        domNode.className = "node";
        domNode.id = node.id;

        domNode.dataset.distance = node.distance;
        domNode.dataset.visited = node.visited;
        domNode.dataset.col = node.col;
        domNode.dataset.row = node.row;

        frag.appendChild(domNode);
        return domNode;
      });

      return domRow;
    });

    this.domGrid = domGrid;

    // console.log(this.domGrid);
    container.appendChild(frag);
  }
}

// wrap in a function later

let container = document.getElementsByClassName("nodeContainer")[0];

let aGrid = new grid(50, 50, container);

aGrid.createNodes();
aGrid.createGrid();

console.log(aGrid);
