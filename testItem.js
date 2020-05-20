export default class testitem {
  constructor(num, heap, loc) {
    this.num = num;
    this.heap = heap;
    this.loc = loc;
  }

  set updateNum(newNum) {
    if (newNum < this.num) {
      this.num = newNum;
      this.heap.decrease;
    }
    // add other cases too
  }

  toString() {
    return "" + this.num + " at " + this.loc;
  }
}
