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

  for (let i = 0; i < clicks; i++) {
    if (direction === "R") {
      position = modulo(position + 1, 100);
    } else {
      position = modulo(position - 1, 100);
    }

    if (position === 0) {
      zero++;
    }
  }

  return zero;
}

function part1(lines: string[]): number {
  let current = 50;
  let zero = 0;

  for (const line of lines) {
    const direction = line[0];
    const clicks = extractNumbers(line)[0];

    if (direction === "L") {
      current = modulo(current - clicks, 100);
    } else {
      current = modulo(current + clicks, 100);
    }

    if (current === 0) {
      zero++;
    }
  }
  return zero;
}

function part2(lines: string[]): number {
  let current = 50;
  let zero = 0;

  for (const line of lines) {
    const direction = line[0];
    const clicks = extractNumbers(line)[0];
    const passes = countPassings(current, direction, clicks);
    zero += passes;
    current = modulo(current + (direction === "R" ? clicks : -clicks), 100);
  }

  return zero;
}

const lines = readLines(1, "input.txt");
console.log("Part 1:", part1(lines));
console.log("Part 2:", part2(lines));
