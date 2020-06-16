import { isStart, isEnd, getNextNodes, updateValue } from "./nodefunctions.js";

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

    let neighbors = getNextNodes(currentNode);

    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (!neighbor.visited) {
        neighbor.prevNode = currentNode;
        neighbor.visited = true;
        exploredNodes.push(neighbor);

        if (isEnd(neighbor)) {
          console.log("hello");
          console.log(currentNode);
          postMessage([exploredNodes, true]);
          return;
        }

        console.log(neighbor);
        stack.push(neighbor);
        postMessage([exploredNodes, false]);
      }
    }
  }
});
