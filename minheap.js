import node from "./node_.js";

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

  extractMin() {
    const minLoc = 1;
    const lastLoc = this.currSize;
    const min = this.array[minLoc].dist;

    this.array[minLoc] = this.array[lastLoc];
    this.array[minLoc].loc = 1;

    this.array.pop();
    this.currSize--;

    this.heapify(minLoc);

    return this.array[minLoc];
  }

  heapify(loc) {
    const Lloc = 2 * loc;
    const Rloc = 2 * loc + 1;

    // let logobj = {};
    // logobj.parent = this.array[loc].loc || undefined;
    // logobj.lchild = this.array[Lloc].loc || undefined;
    // logobj.rchild = this.array[Rloc].loc || undefined;

    // console.table(logobj);
    // console.log(this.array);
    let parent;
    let Lchild;
    let Rchild;

    try {
      parent = this.array[loc].dist;

      Lchild = this.array[Lloc].dist;

      Rchild = this.array[Rloc].dist;
    } catch (error) {
      parent = -1;

      Lchild = -1;

      Rchild = -1;
    }

    // if L child DNE, then R child DNE too, so must be at a leaf (so end of tree reached and heap prob maintained)
    if (Lchild == -1) return;

    // if R child exist, then both children exist
    if (Rchild != -1) {
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
    if (this.array[loc] == undefined) return undefined;
    return this.array[loc];
  }

  isEmpty() {
    return this.currSize === 0;
  }
}
