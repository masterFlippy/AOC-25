import { Point2D } from "./file-utils";

interface Range {
  start: number;
  end: number;
}

export interface Position {
  row: number;
  column: number;
}

export interface GridCell<T> extends Position {
  cell: T;
}

export function sum(array: number[]): number {
  return array.reduce((acc, val) => acc + val, 0);
}

export function max(array: number[]): number {
  return Math.max(...array);
}

export function min(array: number[]): number {
  return Math.min(...array);
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function isInBounds<T>(
  grid: T[][],
  row: number,
  column: number
): boolean {
  return (
    row >= 0 && row < grid.length && column >= 0 && column < grid[0].length
  );
}

export function readRanges(rangeLines: string[]): Range[] {
  return rangeLines.map((line) => {
    const [start, end] = line.split("-").map(Number);
    return { start, end };
  });
}

export function isInRanges(id: number, ranges: Range[]): boolean {
  return ranges.some((range) => id >= range.start && id <= range.end);
}

export function mergeOverlappingRanges(ranges: Range[]): Range[] {
  if (ranges.length === 0) {
    return [];
  }

  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged = [sorted[0]];

  for (const current of sorted.slice(1)) {
    const last = merged[merged.length - 1];

    if (current.start <= last.end + 1) {
      last.end = max([last.end, current.end]);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

export function findPosition<T>(grid: T[][], target: T): Position | null {
  for (const [row, gridRow] of grid.entries()) {
    for (const [column, cell] of gridRow.entries()) {
      if (cell === target) {
        return { row, column };
      }
    }
  }
  return null;
}

export function getAdjacentPositions<T>(
  row: number,
  column: number,
  grid: T[][],
  directions: Array<[number, number]> = [
    [0, 1], // right
    [0, -1], // left
    [1, 0], // down
    [-1, 0], // up
  ]
): GridCell<T>[] {
  return directions
    .map(([rowOffset, columnOffset]) => ({
      row: row + rowOffset,
      column: column + columnOffset,
    }))
    .filter(({ row: newRow, column: newColumn }) =>
      isInBounds(grid, newRow, newColumn)
    )
    .map(({ row: newRow, column: newColumn }) => ({
      row: newRow,
      column: newColumn,
      cell: grid[newRow][newColumn],
    }));
}

export function createGrid<T>(
  rows: number,
  columns: number,
  defaultValue: T
): T[][] {
  return Array(rows)
    .fill(0)
    .map(() => Array(columns).fill(defaultValue));
}

export function getEdgePoints<T>(
  grid: T[][],
  predicate: (value: T) => boolean
): [number, number][] {
  const rows = grid.length;
  const columns = grid[0].length;

  return Array.from({ length: rows }, (_, row) =>
    Array.from(
      { length: columns },
      (_, column) => [row, column] as [number, number]
    )
  ).flatMap((rowPoints) =>
    rowPoints.filter(
      ([row, column]) =>
        (row === 0 ||
          row === rows - 1 ||
          column === 0 ||
          column === columns - 1) &&
        predicate(grid[row][column])
    )
  );
}

export function intersectsGrid<T>(
  grid: T[][],
  minRow: number,
  maxRow: number,
  minColumn: number,
  maxColumn: number,
  predicate: (value: T) => boolean
): boolean {
  for (let row = minRow; row <= maxRow; row++) {
    for (let column = minColumn; column <= maxColumn; column++) {
      if (predicate(grid[row][column])) {
        return true;
      }
    }
  }
  return false;
}

export function compressCoordinates(
  items: Point2D[],
  selector: (item: Point2D) => number
): number[] {
  return [...new Set(items.map(selector))].sort((a, b) => a - b);
}
