// import * as heapFunctions from "./heapfunctions.js";
// import * as nodeFunctions from "./nodefunctions.js";

import {
  insert,
  decrease,
  extractMin,
  heapify,
  swapNodes,
  isEmpty,
} from "./heapfunctions.js";
import { isStart, isEnd, getNextNodes, updateValue } from "./nodefunctions.js";

addEventListener("message", (e) => {
  let startId = e.data[0];
  let heap = e.data[1];
  // decrease start to 0
  let path = [];
  let startNode = heap.array[startId];

  updateValue(heap, startNode, 0);

  while (!isEmpty(heap)) {
    let currNode = extractMin(heap);
    path.push(currNode);
    if (isEnd(currNode)) {
      postMessage([path, true]);
      return;
    }
    let neighbors = getNextNodes(currNode);
    for (let i = 0; i < neighbors.length; i++) {
      if (currNode.dist == Infinity) {
        postMessage([path, false, "failed"]);
        return;
      }
      const neighbor = neighbors[i];
      if (neighbor.wall) continue;
      const newDist = currNode.dist + neighbor.weight;
      if (newDist < neighbor.dist) {
        updateValue(heap, neighbor, newDist);
        neighbor.prevNode = currNode;
        path.push(neighbor);
        postMessage([path, false]);
      }
    }
  }
});
