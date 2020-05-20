import testItem from "./testItem.js";

export default class minheap {
  constructor() {
    this.array = [];
    this.currSize = 0;
  }

  insert(value) {
    console.log(this.currSize);
    let item = new testItem(value, this, ++this.currSize);
    console.log(this.currSize);
    this.array[this.currSize] = item;

    this.decrease(this.currSize);

    // return item;
  }

  decrease(loc) {
    // if at root, return
    if (loc == 1) {
      return;
    }

    let parentLoc = Math.floor(loc / 2);

    // if parent value already less than
    let currNodeVal = this.array[loc].num;
    let parentVal = this.array[parentLoc].num;

    if (parentVal <= currNodeVal) {
      return;
    } else {
      // swap value of parent and child node
      let tempNode = this.array[loc];
      this.array[loc] = this.array[parentLoc];
      this.array[parentLoc] = tempNode;

      // update the locations in the nodes themselves
      this.array[loc].loc = loc;
      this.array[loc / 2].loc = loc / 2;

      // continue at the loc's parent
      this.decrease(loc / 2);
    }
  }
}

// let e = new minheap();

// e.insert(23);
// e.insert(10);
// e.insert(5);
// e.insert(54);
// e.insert(22);
// e.insert(1);

// console.log(e)
