export default class node {
  constructor(row, col, id, heap, loc) {
    this.row = row;
    this.col = col;
    this.id = id;
    this.heap = heap;
    this.loc = loc;

    this.dist = Infinity;
    this.visited = false;
  }

  isStart(startLoc) {
    return this.loc == startLoc;
  }

  isEnd(endLoc) {
    return this.loc == endLoc;
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
