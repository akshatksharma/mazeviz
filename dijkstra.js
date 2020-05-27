import * as heapFunctions from "./heapfunctions.js";
import * as nodeFunctions from "./nodefunctions.js";

addEventListener("message", (e) => {
  console.log(e);
  let startId = e.data[0];
  let heap = e.data[1];
  console.log("message recieved");
  // decrease start to 0
  let path = [];
  let startNode = heap.array[startId];

  console.log(startNode);

  console.log("heap in the webworker");
  console.log(heap);
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
      const neighbor = neighbors[i];
      const newDist = currNode.dist + 1;
      if (newDist < neighbor.dist) {
        // console.log("hell");
        nodeFunctions.updateValue(heap, neighbor, newDist);
        neighbor.prevNode = currNode;
        path.push(neighbor);
        postMessage([path, false]);
      }
    }
  }
});
