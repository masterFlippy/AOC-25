import { readLines } from "../utils/file-utils";
import { modulo } from "../utils/math-utils";
import { extractNumbers } from "../utils/string-utils";

function countPassings(
  start: number,
  direction: string,
  clicks: number
): number {
  let zero = 0;
  let position = start;

  for (const _ of Array(clicks)) {
    position =
      direction === "R" ? modulo(position + 1, 100) : modulo(position - 1, 100);
    position === 0 && zero++;
  }

  return zero;
}

function part1(lines: string[]): number {
  let current = 50;
  let zero = 0;

  for (const line of lines) {
    const direction = line[0];
    const clicks = extractNumbers(line)[0];
    current = modulo(current + (direction === "R" ? clicks : -clicks), 100);
    current === 0 && zero++;
  }

  return zero;
}

function part2(lines: string[]): number {
  let current = 50;
  let zero = 0;

  for (const line of lines) {
    const direction = line[0];
    const clicks = extractNumbers(line)[0];
    zero += countPassings(current, direction, clicks);
    current = modulo(current + (direction === "R" ? clicks : -clicks), 100);
  }

  return zero;
}

const lines = readLines(1, "input.txt");
console.log("Part 1:", part1(lines));
console.log("Part 2:", part2(lines));
