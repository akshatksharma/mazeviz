import { enqueue, dequeue, peekFront, isEmpty } from "./queue.js";

import { isStart, isEnd, getNextNodes, updateValue } from "./nodefunctions.js";

addEventListener("message", (e) => {
  let queue = [];
  let exploredNodes = [];

  let [startId, heap] = e.data;
  let startNode = heap.array[startId];

  updateValue(heap, startNode, 0);
  enqueue(queue, startNode);

  while (!isEmpty(queue)) {
    let currentNode = dequeue(queue);
    exploredNodes.push(currentNode);
    if (isEnd(currentNode)) {
      postMessage([exploredNodes, true]);
      return;
    }

    let neighbors = getNextNodes(currentNode);

    neighbors.forEach((neighbor) => {
      if (currentNode.dist == Infinity) {
        postMessage([exploredNodes, false, "failed"]);
        return;
      }
      if (neighbor.wall) return;
      if (!neighbor.visited) {
        exploredNodes.push(neighbor);
        const newDist = currentNode.dist + 1;
        neighbor.dist = newDist;
        neighbor.visited = true;
        neighbor.prevNode = currentNode;
        enqueue(queue, neighbor);
        postMessage([exploredNodes, false]);
      }
    });
  }
});
