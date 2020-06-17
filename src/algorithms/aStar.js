import { extractMin, isEmpty } from "../heap/heapfunctions.js";
import { isEnd, getNextNodes, updateValue } from "../heap/nodefunctions.js";

addEventListener("message", (e) => {
  let [startId, endId, heap, speed] = e.data;
  let speedVal;

  if (speed == "normal") {
    speedVal = 1;
  } else if (speed == "slow") {
    speedVal = 3;
  } else if (speed == "fast") {
    speedVal = 0.1;
  }

  let path = [];
  let startNode = heap.array[startId];
  let endNode = heap.array[endId];

  const { row: startRow, col: startCol } = startNode;
  const { row: endRow, col: endCol } = endNode;

  let distance = Math.sqrt(
    Math.pow(startRow - endRow, 2) + Math.pow(startCol - endCol, 2)
  );

  updateValue(heap, startNode, 0 + distance);

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
    for (let i = 0; i < neighbors.length; i++) {
      if (currNode.dist == Infinity) {
        postMessage([path, false, "failed"]);
        return;
      }
      const neighbor = neighbors[i];
      if (neighbor.wall) continue;

      let { row: currRow, col: currCol } = neighbor;

      distance = Math.sqrt(
        Math.pow(currRow - endRow, 2) + Math.pow(currCol - endCol, 2)
      );

      const newDist = currNode.dist + neighbor.weight + distance;

      if (newDist < neighbor.dist) {
        updateValue(heap, neighbor, newDist);
        neighbor.prevNode = currNode;
        path.push(neighbor);
        postMessage([path, false]);
      }
    }
  }
});
