import { sum } from "./array-utils";
import { Point3D } from "./file-utils";

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

export interface UnionFind {
  find: (x: number) => number;
  union: (a: number, b: number) => boolean;
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
