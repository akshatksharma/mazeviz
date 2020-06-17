import { isEnd, getNextNodes, updateValue } from "../heap/nodefunctions.js";

addEventListener("message", (e) => {
  let stack = [];
  let exploredNodes = [];
  let [startId, heap, speed] = e.data;
  let speedVal;

  if (speed == "normal") {
    speedVal = 1;
  } else if (speed == "slow") {
    speedVal = 5;
  } else if (speed == "fast") {
    speedVal = 0.5;
  }

  let startNode = heap.array[startId];
  updateValue(heap, startNode, 0);
  stack.push(startNode);

  while (stack.length != 0) {
    let i = 0;
    while (i < speedVal * 10000000) {
      i++;
    }

    let currentNode = stack.pop();
    exploredNodes.push(currentNode);

    if (isEnd(currentNode)) {
      postMessage([exploredNodes, true]);
      return;
    }

    let neighbors = getNextNodes(currentNode);

    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (isEnd(neighbor)) {
        postMessage([exploredNodes, true]);
        return;
      }
      if (neighbor.wall) continue;

      if (!neighbor.visited) {
        exploredNodes.push(neighbor);
        const newDist = currentNode.dist + 1;
        updateValue(heap, neighbor, newDist);
        neighbor.prevNode = currentNode;
        stack.push(neighbor);
        postMessage([exploredNodes, false]);
      }
    }

    if (stack.length == 0) {
      postMessage([exploredNodes, false, "failed"]);
      return;
    }
  }
});
