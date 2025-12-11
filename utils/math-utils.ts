import {
  createGrid,
  getAdjacentPositions,
  isInBounds,
  max,
  min,
  sum,
} from "./array-utils";
import { Point2D, Point3D } from "./file-utils";

export interface UnionFind {
  find: (x: number) => number;
  union: (a: number, b: number) => boolean;
}

export function distance3d(a: Point3D, b: Point3D): number {
  const distanceX = b.x - a.x;
  const distanceY = b.y - a.y;
  const distanceZ = b.z - a.z;
  return Math.sqrt(
    distanceX * distanceX + distanceY * distanceY + distanceZ * distanceZ
  );
}

export function modulo(number: number, modulus: number): number {
  return ((number % modulus) + modulus) % modulus;
}
export function applyOperator(a: number, b: number, operator: string): number {
  switch (operator) {
    case "+":
      return a + b;
    case "*":
      return a * b;
    case "-":
      return a - b;
    case "/":
      return a / b;
    default:
      return a + b;
  }
}

export function dfsPaths<T>(
  start: T,
  getNeighbors: (state: T) => T[],
  getKey: (state: T) => string,
  isGoal: (state: T) => boolean,
  onPath: (path: T[]) => void
): void {
  const path: T[] = [];
  const visiting = new Set<string>();

  function visit(node: T) {
    const key = getKey(node);
    if (visiting.has(key)) {
      return;
    }

    path.push(node);
    visiting.add(key);

    if (isGoal(node)) {
      onPath([...path]);
    } else {
      for (const neighbor of getNeighbors(node)) {
        visit(neighbor);
      }
    }

    visiting.delete(key);
    path.pop();
  }

  visit(start);
}

export function bfs<T>(
  initialState: T,
  getNeighbors: (state: T) => T[],
  getKey: (state: T) => string,
  isGoal?: (state: T) => boolean,
  onVisit?: (state: T) => void
): T[] | void {
  const queue: T[] = [initialState];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = getKey(current);

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    if (onVisit) {
      onVisit(current);
    }
    if (isGoal && isGoal(current)) {
      return [current];
    }

    const neighbors = getNeighbors(current);
    queue.push(...neighbors);
  }
}

export function countMemo<T>(
  position: T,
  getNeighbors: (position: T) => T[],
  getKey: (position: T) => string,
  memo: Map<string, number> = new Map()
): number {
  const key = getKey(position);

  if (memo.has(key)) {
    return memo.get(key)!;
  }

  const neighbors = getNeighbors(position);

  if (neighbors.length === 0) {
    memo.set(key, 1);
    return 1;
  }

  const total = sum(
    neighbors.map((neighbor) => countMemo(neighbor, getNeighbors, getKey, memo))
  );

  memo.set(key, total);
  return total;
}

export function createUnionFind(n: number): UnionFind {
  const parent = Array.from({ length: n }, (_, i) => i);
  const size = Array(n).fill(1);

  const find = (x: number): number => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  };

  const union = (a: number, b: number): boolean => {
    let rootA = find(a);
    let rootB = find(b);

    if (rootA === rootB) {
      return false;
    }

    if (size[rootA] < size[rootB]) {
      [rootA, rootB] = [rootB, rootA];
    }

    parent[rootB] = rootA;
    size[rootA] += size[rootB];

    return true;
  };

  return { find, union };
}

export function isPointInPolygon(point: Point2D, polygon: Point2D[]): boolean {
  let inside = false;
  for (
    let currentIndex = 0, previousIndex = polygon.length - 1;
    currentIndex < polygon.length;
    previousIndex = currentIndex++
  ) {
    const current = polygon[currentIndex];
    const previous = polygon[previousIndex];

    if (current.y > point.y !== previous.y > point.y) {
      const intersectX =
        ((previous.x - current.x) * (point.y - current.y)) /
          (previous.y - current.y) +
        current.x;
      if (point.x < intersectX) {
        inside = !inside;
      }
    }
  }
  return inside;
}

export function floodFill(
  grid: boolean[][],
  startPoints: [number, number][],
  fillValue: boolean = true
): boolean[][] {
  const rows = grid.length;
  const columns = grid[0].length;
  const result = createGrid(rows, columns, false);
  const queue: [number, number][] = [...startPoints];

  for (const [row, column] of startPoints) {
    if (isInBounds(grid, row, column) && !grid[row][column]) {
      result[row][column] = fillValue;
    }
  }

  while (queue.length > 0) {
    const [row, column] = queue.shift()!;
    const neighbors = getAdjacentPositions(row, column, grid);

    for (const { row: newRow, column: newColumn } of neighbors) {
      if (!result[newRow][newColumn] && !grid[newRow][newColumn]) {
        result[newRow][newColumn] = fillValue;
        queue.push([newRow, newColumn]);
      }
    }
  }

  return result;
}

export function calculateRectangleArea(
  corner1: Point2D,
  corner2: Point2D
): number {
  const width = Math.abs(corner2.x - corner1.x) + 1;
  const height = Math.abs(corner2.y - corner1.y) + 1;
  return width * height;
}

export function buildPolygonEdges(coordinates: Point2D[]): Set<string> {
  const coordinateSet = new Set(
    coordinates.map((coordinate) => `${coordinate.x},${coordinate.y}`)
  );

  for (let i = 0; i < coordinates.length; i++) {
    const current = coordinates[i];
    const next = coordinates[(i + 1) % coordinates.length];

    const [start, end, isVertical] =
      current.x === next.x
        ? [min([current.y, next.y]), max([current.y, next.y]), true]
        : [min([current.x, next.x]), max([current.x, next.x]), false];

    for (let coordinate = start; coordinate <= end; coordinate++) {
      coordinateSet.add(
        isVertical ? `${current.x},${coordinate}` : `${coordinate},${current.y}`
      );
    }
  }

  return coordinateSet;
}

export function createPolygonGrid(
  coordinates: Point2D[],
  xCoordinates: number[],
  yCoordinates: number[]
): boolean[][] {
  const rows = yCoordinates.length;
  const columns = xCoordinates.length;
  const grid = createGrid(rows, columns, false);
  const coordinateSet = buildPolygonEdges(coordinates);

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const x = xCoordinates[column];
      const y = yCoordinates[row];
      if (
        coordinateSet.has(`${x},${y}`) ||
        isPointInPolygon({ x, y }, coordinates)
      ) {
        grid[row][column] = true;
      }
    }
  }

  return grid;
}
