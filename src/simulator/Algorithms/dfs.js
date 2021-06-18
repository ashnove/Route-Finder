const dfsTree = [];
let ok = 0;
function dfs(from, grid, end){
    from.isVisited = true;
    const children = getChildren(from, grid);
    for(const to of children){
        if(to.isWall) continue;
        if(ok) return;
        if(!to.isVisited){
            dfsTree.push(from);
            to.previousNode = from;
            if(to === end) { ok = 1 ; return;}
            dfs(to, grid, end);  
        }
    }
}
export function depthFirstSearch(start, end, grid){
    dfs(start, grid, end);
    return dfsTree;
}
export function getPath(end) {
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
    if (col < grid[0].length - 1) children.push(grid[row][col + 1]);
    if (row > 0) children.push(grid[row - 1][col]);
    if (col > 0) children.push(grid[row][col - 1]);
    return children;
}