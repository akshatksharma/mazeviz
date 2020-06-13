import { isStart, isEnd, getNextNodes, updateValue } from "./nodefunctions.js";

addEventListener("message", (e) => {
  let stack = [];
  let exploredNodes = [];
  let [startId, heap] = e.data;
  let startNode = heap.array[startId];
  updateValue(heap, startNode, 0);

  stack.push(startNode);

  while (stack.length != 0) {
    let currentNode = stack.pop();
    currentNode.visited = true;

    // if (isEnd(currentNode)) {
    //   console.log("hello");
    //   console.log(currentNode);
    //   postMessage([exploredNodes, true]);
    //   return;
    // }
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

    // console.log(stack);

    // if (isEnd(currentNode)) {
    //   console.log("done");
    //   console.log(exploredNodes);
    //   postMessage([exploredNodes, true]);
    //   return;
    // }

    // neighbors.forEach((neighbor) => {
    //   exploredNodes.push(neighbor);
    //   if (currentNode.dist == Infinity) {
    //     postMessage([exploredNodes, false, "failed"]);
    //     return;
    //   }

    //   if (neighbor.wall) return;
    //   if (!neighbor.visited) {
    //     const newDist = currentNode.dist + 1;
    //     neighbor.dist = newDist;
    //     neighbor.visited = true;
    //     neighbor.prevNode = currentNode;
    //     stack.push(neighbor);

    //     postMessage([exploredNodes, false]);
    //   }
    // });
  }
});
