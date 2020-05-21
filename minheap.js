import testItem from "./testItem.js";

export default class minheap {
  constructor() {
    this.array = [];
    this.currSize = 0;
  }

  insert(value) {
    let item = new testItem(value, this, ++this.currSize);
    this.array[this.currSize] = item;

    this.decrease(this.currSize);
  }

  decrease(loc) {
    // if at root, return
    if (loc == 1) return;

    // if parent value already less than child, no need to swap values--invariant maintainted
    // otherwise, need to swap
    let parentLoc = Math.floor(loc / 2);
    let child = this.array[loc].num;
    let parent = this.array[parentLoc].num;

    if (parent <= child) return;
    else {
      this.swapNodes(loc, parentLoc);
      // check if parent / child relationships across tree need // to be done by continuing at the loc's parent
      this.decrease(parentLoc);
    }
  }

  extractMin() {
    const minLoc = 1;
    const lastLoc = this.currSize;
    const min = this.array[minLoc].num;

    this.array[minLoc] = this.array[lastLoc];

    this.array[minLoc].loc = 1;

    this.array.pop();
    this.currSize--;

    this.heapify(minLoc);

    return min;
  }

  heapify(loc) {
    const Lloc = 2 * loc;
    const Rloc = 2 * loc + 1;

    const parent = this.array[loc].num || null;
    const Lchild = this.array[Lloc].num || null;
    const Rchild = this.array[Rloc].num || null;

    // if L child DNE, then R child DNE too, so must be at a leaf (so end of tree reached and heap prob maintained)
    if (Lchild == null) return;

    // if R child exist, then both children exist
    if (Rchild != null) {
      if (parent < Lchild && parent < Rchild) {
        return;
      } else if (Lchild <= Rchild) {
        this.swapNodes(loc, Lloc);
      } else {
        this.swapNodes(loc, Rloc);
      }
      // else only L child exist
      // if parent less than it, then do nothing, otherwise swap
    } else if (parent <= Lchild) return;
    else this.swapNodes(loc, Lloc);

    this.heapify(Lloc);
    this.heapify(Rloc);
  }

  swapNodes(loc1, loc2) {
    let temp = this.array[loc1];
    this.array[loc1] = this.array[loc2];
    this.array[loc2] = temp;

    this.array[loc1].loc = loc1;
    this.array[loc2].loc = loc2;
  }

  peek(loc) {
    if (this.array[loc] == null) return null;
    return this.array[loc];
  }

  isEmpty() {
    return this.currSize === 0;
  }
}
