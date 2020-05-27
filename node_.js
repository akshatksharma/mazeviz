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
    // given the start coordinates in the grid, determine whether the node is the start or end
    const [startRow, startCol] = this.grid.startLoc;
    return startRow == this.row && startCol == this.col;
  }

  isEnd() {
    const [endRow, endCol] = this.grid.endLoc;
    return endRow == this.row && endCol == this.col;
  }

  // other functions are in nodefucntions.js
}

// NEED TO :
// acc for random cases where start and end may be the same
