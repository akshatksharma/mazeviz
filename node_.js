export default class node {
  constructor(row, col, grid, id, heap, loc) {
    this.row = row;
    this.col = col;
    this.grid = grid;
    this.id = id;
    this.heap = heap;
    this.loc = loc;

    this.dist = Infinity;
    this.weight;
    this.visited = false;
    this.prevNode = null;
  }

  isStart() {
    const [startRow, startCol] = this.grid.startLoc;
    return startRow == this.row && startCol == this.col;
  }

  isEnd() {
    const [endRow, endCol] = this.grid.endLoc;
    return endRow == this.row && endCol == this.col;
  }

  getNextNodes() {
    let neighbors = [];
    // console.table([this.row, this.col, this.grid.nodeGrid[this.row]]);
    // console.log(this.grid.nodeGrid);
    // console.log(this.grid.nodeGrid[]);
    // console.log(`rows: ${this.grid.numRows}`);

    let nodeGrid = this.grid.nodeGrid;

    if (this.row > 1) {
      // console.log("top neighbor");
      const upNeighbor = nodeGrid[this.row - 1][this.col];
      neighbors.push(upNeighbor);
    }
    if (this.row < this.grid.numRows) {
      // console.log("bottom neighbor");
      // console.log(this.grid.nodeGrid[this.row + 1][this.col]);
      const downNeighbor = nodeGrid[this.row + 1][this.col];
      neighbors.push(downNeighbor);
    }
    if (this.col > 1) {
      // console.log("left neighbor");
      const leftNeighbor = nodeGrid[this.row][this.col - 1];
      neighbors.push(leftNeighbor);
    }
    if (this.col < this.grid.numCols) {
      // console.log("right neighbor");
      const rightNeighbor = nodeGrid[this.row][this.col + 1];
      neighbors.push(rightNeighbor);
    }

    neighbors = neighbors.filter((neighbor) => !neighbor.visited);

    // console.table([this, neighbors]);
    return neighbors;
  }

  updateValue(value) {
    this.visited = true;
    this.dist = value;
    this.heap.decrease(this.loc);

    // update DOM of node that was visited
  }

  updateNode() {
    let domNode = document.getElementById(`node: ${this.row}, ${this.col}`);
    domNode.dataset.visited = this.visited;
    // domNode.style.backgroundColor = "blue";
  }
}

// NEED TO :
// acc for random cases where start and end may be the same
