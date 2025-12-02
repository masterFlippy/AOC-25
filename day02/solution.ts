import { readInput } from "../utils/file-utils";
import {
  splitByDelimiter,
  parseRange,
  isRepeatedPattern,
} from "../utils/string-utils";

function isInvalidId(num: number): boolean {
  const string = num.toString();
  const length = string.length;

  if (length % 2 !== 0) {
    return false;
  }

  const half = length / 2;
  const firstHalf = string.substring(0, half);
  const secondHalf = string.substring(half);

  return firstHalf === secondHalf;
}

function isInvalidId2(number: number): boolean {
  const string = number.toString();
  const length = string.length;

  for (let i = 1; i <= length / 2; i++) {
    if (length % i === 0) {
      if (isRepeatedPattern(string, i)) {
        return true;
      }
    }
  }

  return false;
}

function part1(input: string): number {
  const rangeStrings = splitByDelimiter(input);
  const ranges = rangeStrings.map(parseRange);
  const invalid: number[] = ranges.flatMap((range) =>
    Array.from(
      { length: range.end - range.start + 1 },
      (_, i) => range.start + i
    ).filter(isInvalidId)
  );

  return invalid.reduce((accumulator, value) => accumulator + value, 0);
}

function part2(input: string): number {
  const rangeStrings = splitByDelimiter(input);
  const ranges = rangeStrings.map(parseRange);
  const invalid: number[] = ranges.flatMap((range) =>
    Array.from(
      { length: range.end - range.start + 1 },
      (_, i) => range.start + i
    ).filter(isInvalidId2)
  );

  return invalid.reduce((accumulator, value) => accumulator + value, 0);
}

const input = readInput(2);
console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));
