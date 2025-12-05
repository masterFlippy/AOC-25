import {
  isInRanges,
  readRanges,
  mergeOverlappingRanges,
} from "../utils/array-utils";
import { readGroups } from "../utils/file-utils";

function part1(): number {
  return ids.filter((id) => isInRanges(id, ranges)).length;
}

function part2(): number {
  return mergeOverlappingRanges(ranges).reduce(
    (total, range) => total + (range.end - range.start + 1),
    0
  );
}

const groups = readGroups(5);
const ranges = readRanges(groups[0]);
const ids = groups[1].map(Number);

console.log("Part 1:", part1());
console.log("Part 2:", part2());
