import PriorityQueue from "priorityqueue";

class Pair {
    constructor(dis, cell){
        this.cell = cell;
        this.dis = dis;
    }
}
const comparator = (nodeA, nodeB) => {
    const a = nodeA.dis;
    const b = nodeB.dis;
    return (a < b ? 1 : a > b ? -1 : 0);    
}
export function dijkstra(grid, start, end) {
    const visitedNodesInOrder = [];
    start.distance = 0;
    
    const pq = new PriorityQueue({comparator});
    pq.push(new Pair(0, start));
    while (pq.isEmpty() === false) {
        
        const from = pq.top().cell;
        const pq_dis = pq.top().dis;
        pq.pop();
      
        if(pq_dis > from.distance) continue;
        if (from.isWall) continue;
        if (from === end) return visitedNodesInOrder;
        const children = getChildren(from, grid);
        
        console.log(from);
        visitedNodesInOrder.push(from);
        for (const to of children) {
            if( pq_dis + 1  < to.distance ){
                to.distance = from.distance + 1;
                to.previousNode = from;
                pq.push(new Pair(to.distance, to));
                console.log(pq);
                }
        }
    }
    return visitedNodesInOrder;
}
export function getShortestPath(end) {
    const path = [];
    let curr = end;
    while (curr !== null) {
      path.unshift(curr);
      curr = curr.previousNode;
    }
    return path;
}
function getChildren(node, grid) {
    const children = [];
    const {col, row} = node;
    if (row < grid.length - 1) children.push(grid[row + 1][col]);
    if (row > 0) children.push(grid[row - 1][col]);
    if (col < grid[0].length - 1) children.push(grid[row][col + 1]);
    if (col > 0) children.push(grid[row][col - 1]);
    return children;
}
  