export function insert(heap, item) {
  heap.currSize++;
  heap.array[heap.currSize] = item;
  decrease(heap, heap.currSize);
}

export function decrease(heap, loc) {
  // if at root, return
  if (loc == 1) return;
  // if parent value already less than child, no need to swap values--invariant maintainted
  // otherwise, need to swap
  let parentLoc = Math.floor(loc / 2);
  let child = heap.array[loc].dist;
  let parent = heap.array[parentLoc].dist;

  if (parent <= child) return;
  else {
    swapNodes(heap, loc, parentLoc);
    // check if parent / child relationships across tree need // to be done by continuing at the loc's parent
    decrease(heap, parentLoc);
  }
}

export function extractMin(heap) {
  const minLoc = 1;
  const lastLoc = heap.currSize;

  const min = heap.array[minLoc];

  heap.array[minLoc] = heap.array[lastLoc];
  heap.array[minLoc].loc = 1;

  heap.array.pop();
  heap.currSize--;

  heapify(heap, minLoc);

  return min;
}

export function heapify(heap, loc) {
  const Lloc = 2 * loc;
  const Rloc = 2 * loc + 1;

  let parent;
  let Lchild;
  let Rchild;

  try {
    parent = heap.array[loc].dist;

    Lchild = heap.array[Lloc].dist;

    Rchild = heap.array[Rloc].dist;
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
      swapNodes(heap, loc, Lloc);
    } else {
      swapNodes(heap, loc, Rloc);
    }
    // else only L child exist
    // if parent less than it, then do nothing, otherwise swap
  } else if (parent <= Lchild) return;
  else swapNodes(heap, loc, Lloc);

  heapify(heap, Lloc);
  heapify(heap, Rloc);
}

export function swapNodes(heap, loc1, loc2) {
  let temp = heap.array[loc1];
  heap.array[loc1] = heap.array[loc2];
  heap.array[loc2] = temp;

  heap.array[loc1].loc = loc1;
  heap.array[loc2].loc = loc2;
}

export function peek(heap, loc) {
  if (heap.array[loc] == undefined) return undefined;
  return heap.array[loc];
}

export function isEmpty(heap) {
  return heap.currSize === 0;
}
