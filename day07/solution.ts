import { readGrid } from "../utils/file-utils";
import { bfs, countMemo } from "../utils/math-utils";
import {
  findPosition,
  getAdjacentPositions,
  Position,
} from "../utils/array-utils";

function getPositionNeighbors(
  position: Position,
  grid: string[][],
  columns: number
): Position[] {
  const nextPositions: Position[] = [];
  const adjacent = getAdjacentPositions(position.row, position.column, grid, [
    [1, 0],
  ]); // down

  if (adjacent.length === 0) {
    return [];
  }

  const { row, column, cell } = adjacent[0];

  if (cell === ".") {
    nextPositions.push({ row, column });
  } else if (cell === "^") {
    if (column - 1 >= 0) {
      nextPositions.push({ row, column: column - 1 });
    }
    if (column + 1 < columns) {
      nextPositions.push({ row, column: column + 1 });
    }
  }

  return nextPositions;
}

function simulateBeams(grid: string[][]): number {
  const rows = grid.length;
  const columns = grid[0].length;
  const start = findPosition(grid, "S");

  if (!start) {
    throw new Error("Start position S not found");
  }

  let count: number = 0;
  bfs(
    {
      row: start.row,
      column: start.column,
    },
    (position: Position) => getPositionNeighbors(position, grid, columns),
    (position: Position) => `${position.row},${position.column}`,
    undefined,
    (position: Position): void => {
      const nextRow = position.row + 1;
      if (nextRow < rows && grid[nextRow][position.column] === "^") {
        count++;
      }
    }
  );

  return count;
}

function simulateTimelines(columns: number): number {
  const start = findPosition(grid, "S");

  if (!start) {
    throw new Error("Start position S not found");
  }

  return countMemo(
    {
      row: start.row,
      column: start.column,
    },
    (position: Position) => getPositionNeighbors(position, grid, columns),
    (position: Position) => `${position.row},${position.column}`
  );
}

function part1(): number {
  return simulateBeams(grid);
}

function part2(): number {
  return simulateTimelines(grid[0].length);
}

const grid = readGrid(7);
console.log("Part 1:", part1());
console.log("Part 2:", part2());
