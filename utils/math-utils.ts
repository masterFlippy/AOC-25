import { sum } from "./array-utils";

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
