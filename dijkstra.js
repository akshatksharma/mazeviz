import grid from "./grid.js";
import minheap from "./minheap.js";
import node from "./node_.js";

export default function dijkstra(grid, heap) {
  // decrease start to 0
  let path = [];
  let startNode = heap.array[grid.startNode.id];
  startNode.updateValue(0);

  //   console.log(min);
  //   console.log(heap.array);

  while (!heap.isEmpty()) {
    let currNode = heap.extractMin();
    path.push(currNode);
    if (currNode.isEnd()) {
      return path;
    }
    let neighbors = currNode.getNextNodes();
    // maybe put a callback thing here
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      const newDist = currNode.dist + 1;
      if (newDist < neighbor.dist) {
        // console.log("hell");
        neighbor.updateValue(newDist);
        neighbor.updateDOM();

        neighbor.prevNode = currNode;
        path.push(neighbor);
      }
    }
  }
}

// export default function dijkstra(node, path_) {
//   let currNode = node;
//   let path = path_;

//   console.log(currNode);
//   setTimeout(() => {
//     console.log("callback currnode" + currNode);
//     path.push(currNode);
//     let neighbors = currNode.getNextNodes();
//     console.log(neighbors);
//     for (let i = 0; i < neighbors.length; i++) {
//       const neighbor = neighbors[i];
//       const newDist = currNode.dist + 1;
//       if (newDist < neighbor.dist) {
//         neighbor.updateValue(newDist);
//         neighbor.updateDOM();
//         neighbor.prevNode = currNode;
//         path.push(neighbor);
//       }
//     }
//   }, 0);

//   return;
// }

function getPath(exploredNodes) {
  let endNode = exploredNodes.pop();
  let orderedPath = [endNode];

  let currNode = endNode;
  while (currNode.prevNode != null) {
    // console.log("hello");
    orderedPath.splice(0, 0, currNode.prevNode);
    console.log(currNode);
    currNode = currNode.prevNode;
  }

  console.log(orderedPath);
}
