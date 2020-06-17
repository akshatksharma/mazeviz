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
    currentNode.visited = true;

    if (isEnd(currentNode)) {
      postMessage([exploredNodes, true]);
      console.log("ended");
      break;
    }

    let neighbors = getNextNodes(currentNode);

    neighbors.forEach((neighbor) => {
      if (neighbor.wall) return;
      if (!neighbor.visited) {
        neighbor.prevNode = currentNode;
        neighbor.visited = true;
        exploredNodes.push(neighbor);

        console.log(neighbor);
        stack.push(neighbor);
        postMessage([exploredNodes, false]);
      }
    });
  }
});
