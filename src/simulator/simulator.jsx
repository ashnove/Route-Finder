import React, { Component } from "react";
import "./simulator.css";
import Cell from "./Cell/Cell";
import { Button, Navbar } from "react-bootstrap";
import { dijkstra, getShortestPath } from "./Algorithms/dikjstra";
import { depthFirstSearch, getPath } from "./Algorithms/dfs";

const row_start = 12;
const col_start = 1;
const row_end = 12;
const col_end = 52;

export default class RouteFinder extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
    };
}

componentDidMount() {
    let grid = makeGrid();
    this.setState({ grid });
}

handleMouseDown(row, col) {
    const newGrid = toggleWall(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
}

handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = toggleWall(this.state.grid, row, col);
    this.setState({ grid: newGrid });
}

handleMouseUp() {
    this.setState({ mouseIsPressed: false });
}

runSimulation(allPath, reqPath) {
    for (let i = 0; i <= allPath.length ; i++) {
        
        if (i === allPath.length) {
            setTimeout(() => {
                this.runFinalRoute(reqPath);
            }, 10 * i);
            return;
        }

        const node = allPath[i];
        if(row_start===node.row && col_start===node.col) continue;
        let nodeState = `cell visited-cell`;
        if(node.isEnd)
            nodeState = `cell end-cell visited-cell`
        
        console.log(`animating`);
        setTimeout(() => {
            document.getElementById(`cell-${node.row}-${node.col}`).className = nodeState;
        }, 10 * i);
    }
}

runFinalRoute(reqPath) {
    for (let i = 0; i < reqPath.length ; i++) {
        const node = reqPath[i];
        if(row_start===node.row && col_start===node.col) continue;
        setTimeout(() => {
            let nodeState = `cell final-cell`;
            if(node.isEnd)
                nodeState = `cell end-cell final-cell`
            document.getElementById(`cell-${node.row}-${node.col}`).className = nodeState;
        }, 50 * i);
    }
}

performDijkstra() {
    const { grid } = this.state;
    const start = grid[row_start][col_start];
    const end = grid[row_end][col_end];
    const allPath = dijkstra(grid, start, end);
    const reqPath = getShortestPath(end);
    this.runSimulation(allPath, reqPath)
}

performDFS(){
    const { grid } = this.state;
    const start = grid[row_start][col_start];
    const end = grid[row_end][col_end];
    const allPath = depthFirstSearch(start, end, grid);
    const reqPath = getPath(end);
    this.runSimulation(allPath, reqPath);
}

clearBoard() {
    const { grid } = this.state;
    const newGrid = grid.slice();
    for (let row = 0; row < 24; row++) {
      for (let col = 0; col < 54; col++) {
        const node = newGrid[row][col];
        const newNode = {
          ...node,
          isWall: false,
          isStart: row_start===row && col_start===col ? true : false,
          isEnd: row_end===row && col_end===col ? true : false
        };
        newGrid[row][col] = newNode;
      }
    }
    this.setState({ grid: newGrid });
}

fullWall() {
    for (let row = 0; row < 24; row++) {
      for (let col = 0; col < 54; col++) {
        if(row_start===row && col_start===col) continue;
        if(row_end===row && col_end===col) continue;
        const newGrid = toggleWall(this.state.grid, row, col, true);
        this.setState({ grid: newGrid });
      }
    }
}

render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="root">Route Finder</Navbar.Brand>
          <Button className="topRow" variant="light" onClick={() => this.performDijkstra()}>
            Dijkstra's Algorithm
          </Button>{" "}
          <Button className="topRow" variant="light" onClick={() => this.performDFS()}>
            Depth First Search
          </Button>{" "}
          <Button className="topRow" variant="secondary" onClick={() => this.clearBoard()}>
            Draw Maze
          </Button>{" "}
          <Button className="topRow" variant="secondary" onClick={() => this.fullWall()} >
            Draw Path
          </Button>
          <Button className="sidebar" href="root" variant="warning">
            Reset
          </Button>
        </Navbar>

        <div className="col">
            {
                grid.map((row, rowIdx) => {
                return (
                    <div className = "row" key={rowIdx}>
                    {
                        row.map((cell, cellID) => {
                        const { row, col, isEnd, isStart, isWall } = cell;
                        
                        return (
                            <Cell
                            row={row} key={cellID} col={col} isWall={isWall} isStart={isStart} isEnd={isEnd} mouseIsPressed={mouseIsPressed}
                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                            onMouseUp={() => this.handleMouseUp()}
                            ></Cell>                            
                        );                    
                    })}
                </div>
                );
            })}
        </div>
      </>
    );
  }
}

let makeGrid = () => {
    let grid = [];
    for (let row = 0; row < 24; row++) {
        let currentRow = [];
        for (let col = 0; col < 54; col++) {
            currentRow.push(createCell(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createCell = (col, row) => {
    return {
        col,
        row,
        isStart: row === row_start && col === col_start,
        isEnd: row === row_end && col === col_end,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

let toggleWall = (grid, row, col, allWall = false) => {
    const newGrid = grid.slice();
    const cell = newGrid[row][col];
    const cellUpdated = {
        ...cell,
        isWall: allWall ? true : !cell.isWall
    };
    newGrid[row][col] = cellUpdated;
    return newGrid;
};

