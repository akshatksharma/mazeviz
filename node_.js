export default class node {
  constructor(row, col, id, heap, loc) {
    this.row = row;
    this.col = col;
    this.id = id;
    this.heap = heap;
    this.loc = loc;

    this.dist = Infinity;
    this.visited = false;
    this.start = false;
    this.end = false;
  }

  isStart(start_row, start_col) {
    this.start = true;
    return this.col == start_col && this.row == start_row;
  }

  isEnd(end_row, end_col) {
    this.end = true;
    return this.col == end_col && this.row == end_row;
  }

  getVisited() {
    return this.visited;
  }

  setVisited(value) {
    this.visited = true;
    this.dist = value;
    this.heap.decrease(this.loc);

    // update DOM of node that was visited
    this.updateNode();
  }

  updateNode() {
    let domNode = document.getElementById(this.id);
    domNode.dataset.visited = this.visited;
  }
}

// NEED TO :
// acc for random cases where start and end may be the same
