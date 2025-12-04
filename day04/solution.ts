import { readGrid } from "../utils/file-utils";
import { isInBounds } from "../utils/array-utils";

function countRolls(grid: string[][], row: number, column: number): number {
  let count: number = 0;
  for (const rowOffset of [-1, 0, 1]) {
    for (const columnOffset of [-1, 0, 1]) {
      if (rowOffset === 0 && columnOffset === 0) {
        continue;
      }
      if (
        isInBounds(grid, row + rowOffset, column + columnOffset) &&
        grid[row + rowOffset][column + columnOffset] === "@"
      ) {
        count++;
      }
    }
  }
  return count;
}

function findAccessible(grid: string[][]): [number, number][] {
  const accessible: [number, number][] = [];

  for (const [rowIndex, row] of grid.entries()) {
    for (const [columnIndex, value] of row.entries()) {
      if (value === "@") {
        const adjacentRolls = countRolls(grid, rowIndex, columnIndex);
        if (adjacentRolls < 4) {
          accessible.push([rowIndex, columnIndex]);
        }
      }
    }
  }

  return accessible;
}

function part1(): number {
  return findAccessible(grid).length;
}

function part2(): number {
  const gridCopy = grid.map((row) => [...row]);
  let total: number = 0;

  while (true) {
    const accessible = findAccessible(gridCopy);
    if (accessible.length === 0) {
      break;
    }

    for (const [row, column] of accessible) {
      gridCopy[row][column] = ".";
    }
    total += accessible.length;
  }

  return total;
}

const grid = readGrid(4);
console.log("Part 1:", part1());
console.log("Part 2:", part2());
