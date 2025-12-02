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

function findInvalidIds(validate: (number: number) => boolean): number[] {
  return ranges.flatMap((range) =>
    Array.from(
      { length: range.end - range.start + 1 },
      (_, i) => range.start + i
    ).filter(validate)
  );
}

function part1(): number {
  return findInvalidIds(isInvalidId).reduce(
    (accumulator, value) => accumulator + value,
    0
  );
}

function part2(): number {
  return findInvalidIds(isInvalidId2).reduce(
    (accumulator, value) => accumulator + value,
    0
  );
}

const ranges = splitByDelimiter(readInput(2)).map(parseRange);
console.log("Part 1:", part1());
console.log("Part 2:", part2());
