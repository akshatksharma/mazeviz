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
    // console.count();
    let currNode = heap.extractMin();
    path.push(currNode);
    if (currNode.isEnd()) {
      return path;
    }
    let neighbors = currNode.getNextNodes();
    // console.log(neighbors);

    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      const newDist = currNode.dist + 1;
      if (newDist < neighbor.dist) {
        // console.log("hell");
        neighbor.updateValue(newDist);

        setTimeout(() => {
          neighbor.updateNode();
        }, 100 * i);

        neighbor.prevNode = currNode;
        path.push(neighbor);
      }
    }
  }
}

// export default function dijkstra(grid, heap) {
//   return new Promise((resolve, reject) => {
//     // decrease start to 0
//     let path = [];
//     let startNode = heap.array[grid.startNode.id];
//     startNode.updateValue(0);

//     //   console.log(min);
//     //   console.log(heap.array);

//     while (!heap.isEmpty()) {
//       // console.count();
//       let currNode = heap.extractMin();
//       path.push(currNode);
//       if (currNode.isEnd()) {
//         resolve(path);
//       }
//       let neighbors = currNode.getNextNodes();
//       // console.log(neighbors);

//       neighbors.forEach((neighbor) => {
//         const newDist = currNode.dist + 1;
//         if (newDist < neighbor.dist) {
//           // console.log("hell");
//           neighbor.updateValue(newDist);
//           neighbor.prevNode = currNode;
//           path.push(neighbor);
//         }
//       });
//     }
//   });
// }
