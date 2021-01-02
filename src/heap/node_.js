export default class node {
  constructor(row, col, weight, grid, id, heap, loc) {
    this.row = row;
    this.col = col;
    this.grid = grid;
    this.id = id;
    this.heap = heap;
    this.loc = loc;

    this.dist = Infinity;
    this.time;
    this.weight = weight;
    this.wall = false;
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
