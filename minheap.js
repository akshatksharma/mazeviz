export default class minheap {
  constructor() {
    this.array = [];
    this.currSize = 0;
  }

  insert(item) {
    this.currSize++;
    this.array[this.currSize] = item;
    this.decrease(this.currSize);
  }

  decrease(loc) {
    // if at root, return
    if (loc == 1) return;
    // if parent value already less than child, no need to swap values--invariant maintainted
    // otherwise, need to swap
    let parentLoc = Math.floor(loc / 2);
    let child = this.array[loc].dist;
    let parent = this.array[parentLoc].dist;

    if (parent <= child) return;
    else {
      this.swapNodes(loc, parentLoc);
      // check if parent / child relationships across tree need // to be done by continuing at the loc's parent
      this.decrease(parentLoc);
    }
  }

  // other methods are in heapfunctions.js
}
