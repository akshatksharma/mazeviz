export default class node_ {
  constructor(row, col, id) {
    this.col = col;
    this.row = row;
    this.id = id;
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

  get getVisited() {
    return this.visited;
  }

  set setVisited(value) {
    this.visited = value;

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
