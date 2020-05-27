import { decrease } from "./heapfunctions.js";

export function isStart(node) {
  // given the start coordinates in the grid, determine whether the node is the start or end
  const [startRow, startCol] = node.grid.startLoc;
  return startRow == node.row && startCol == node.col;
}

export function isEnd(node) {
  const [endRow, endCol] = node.grid.endLoc;
  return endRow == node.row && endCol == node.col;
}

// given the current node's row and column, add its neighbors to the path for dijkstra to explore
export function getNextNodes(node) {
  let neighbors = [];

  let nodeGrid = node.grid.nodeGrid;

  if (node.row > 1) {
    // console.log("top neighbor");
    const upNeighbor = nodeGrid[node.row - 1][node.col];
    neighbors.push(upNeighbor);
  }
  if (node.row < node.grid.numRows) {
    // console.log("bottom neighbor");
    const downNeighbor = nodeGrid[node.row + 1][node.col];
    neighbors.push(downNeighbor);
  }
  if (node.col > 1) {
    // console.log("left neighbor");
    const leftNeighbor = nodeGrid[node.row][node.col - 1];
    neighbors.push(leftNeighbor);
  }
  if (node.col < node.grid.numCols) {
    // console.log("right neighbor");
    const rightNeighbor = nodeGrid[node.row][node.col + 1];
    neighbors.push(rightNeighbor);
  }

  neighbors = neighbors.filter((neighbor) => !neighbor.visited);

  return neighbors;
}

// decrease the value of an explored node and update its location in the heap
export function updateValue(heap, node, value) {
  //   console.log(heap);
  node.visited = true;
  node.dist = value;
  decrease(heap, node.loc);
}
