import { extractMin, isEmpty } from "../heap/heapfunctions.js";
import { isEnd, getNextNodes, updateValue } from "../heap/nodefunctions.js";

console.log("running");

addEventListener("message", (e) => {
  let [startId, heap, speed] = e.data;
  let speedVal;

  if (speed == "normal") {
    speedVal = 1;
  } else if (speed == "slow") {
    speedVal = 5;
  } else if (speed == "fast") {
    speedVal = 0.01;
  }

  // decrease start to 0
  let path = [];
  let startNode = heap.array[startId];

  updateValue(heap, startNode, 0);

  while (!isEmpty(heap)) {
    let i = 0;
    while (i < speedVal * 10000000) {
      i++;
    }

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
