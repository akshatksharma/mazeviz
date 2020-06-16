import {
  insert,
  decrease,
  extractMin,
  heapify,
  swapNodes,
  isEmpty,
} from "./heapfunctions.js";
import { isStart, isEnd, getNextNodes, updateValue } from "./nodefunctions.js";

console.log("running");

addEventListener("message", (e) => {
  let [startId, heap, speed] = e.data;
  // decrease start to 0
  let path = [];
  let startNode = heap.array[startId];

  updateValue(heap, startNode, 0);

  // console.log(speed);
  while (!isEmpty(heap)) {
    let i = 0;
    while (i < speed * 10000000) {
      i++;
    }
    console.log(i);
    let currNode = extractMin(heap);
    path.push(currNode);
    if (isEnd(currNode)) {
      postMessage([path, true]);
      return;
    }
    let neighbors = getNextNodes(currNode);
    neighbors.forEach((neighbor) => {
      if (currNode.dist == Infinity) {
        postMessage([path, false, "failed"]);
        return;
      }
      if (neighbor.wall) return;
      const newDist = currNode.dist + neighbor.weight;
      if (newDist < neighbor.dist) {
        updateValue(heap, neighbor, newDist);
        neighbor.prevNode = currNode;
        path.push(neighbor);
        postMessage([path, false]);
      }
    });
  }
});
