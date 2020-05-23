import grid from "./grid.js";
import minheap from "./minheap.js";
import node from "./node_.js";

export default function dijkstra(grid, heap) {
  // decrease start to 0
  let path = [];
  let startNode = heap.array[grid.startLoc];
  startNode.updateValue(0);
  //   console.log(heap.array);

  while (!heap.isEmpty()) {
    // console.count();
    let currNode = heap.extractMin();
    console.log(currNode);
    if (currNode.isEnd()) return path;
    let neighbors = currNode.getNextNodes();
    console.log(neighbors);

    neighbors.forEach((neighbor) => {
      const newDist = currNode.dist + 1;
      if (newDist < neighbor.dist) {
        console.log("hell");
        neighbor.updateValue(newDist);
        neighbor.prevNode = currNode;
        path.push(neighbor);
      }
    });
  }

  console.log(path);
}
