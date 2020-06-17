import { isEnd, getNextNodes, updateValue } from "../heap/nodefunctions.js";

addEventListener("message", (e) => {
  let queue = [];
  let exploredNodes = [];

  let [startId, heap, speed] = e.data;
  let speedVal;

  if (speed == "normal") {
    speedVal = 1;
  } else if (speed == "slow") {
    speedVal = 3;
  } else if (speed == "fast") {
    speedVal = 0.5;
  }
  let startNode = heap.array[startId];
  updateValue(heap, startNode, 0);
  queue.push(startNode);

  while (queue.length != 0) {
    let i = 0;
    while (i < speedVal * 10000000) {
      i++;
    }

    let currentNode = queue.shift();
    exploredNodes.push(currentNode);

    if (isEnd(currentNode)) {
      postMessage([exploredNodes, true]);
      return;
    }

    let neighbors = getNextNodes(currentNode);

    neighbors.forEach((neighbor) => {
      if (neighbor.wall) return;

      exploredNodes.push(neighbor);
      if (!neighbor.visited) {
        const newDist = currentNode.dist + 1;
        updateValue(heap, neighbor, newDist);
        neighbor.prevNode = currentNode;
        queue.push(neighbor);
        postMessage([exploredNodes, false]);
      }
    });

    if (queue.length == 0) {
      postMessage([exploredNodes, false, "failed"]);
      return;
    }
  }
});
