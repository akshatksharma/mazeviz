import * as heapFunctions from "./heapfunctions.js";
import * as nodeFunctions from "./nodefunctions.js";

addEventListener("message", (e) => {
  let startId = e.data[0];
  let heap = e.data[1];
  // decrease start to 0
  let path = [];
  let startNode = heap.array[startId];

  nodeFunctions.updateValue(heap, startNode, 0);

  while (!heapFunctions.isEmpty(heap)) {
    let currNode = heapFunctions.extractMin(heap);
    path.push(currNode);
    if (nodeFunctions.isEnd(currNode)) {
      postMessage([path, true]);
      return;
    }
    let neighbors = nodeFunctions.getNextNodes(currNode);
    for (let i = 0; i < neighbors.length; i++) {
      if (currNode.dist == Infinity) {
        postMessage([path, false, "failed"]);
        return;
      }
      const neighbor = neighbors[i];
      if (neighbor.wall) continue;
      const newDist = currNode.dist + neighbor.weight;
      if (newDist < neighbor.dist) {
        nodeFunctions.updateValue(heap, neighbor, newDist);
        neighbor.prevNode = currNode;
        path.push(neighbor);
        postMessage([path, false]);
      }
    }
  }
});
