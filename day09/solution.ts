import { read2dCoordinates } from "../utils/file-utils";

function largestRectangle(): number {
  let max = 0;

  for (let firstIndex = 0; firstIndex < coordinates.length; firstIndex++) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < coordinates.length;
      secondIndex++
    ) {
      const corner1 = coordinates[firstIndex];
      const corner2 = coordinates[secondIndex];

      const width = Math.abs(corner2.x - corner1.x) + 1;
      const height = Math.abs(corner2.y - corner1.y) + 1;
      const area = width * height;

      max = Math.max(max, area);
    }
  }

  return max;
}

function part1(): number {
  return largestRectangle();
}

function part2(): number {
  return 0;
}

const coordinates = read2dCoordinates(9, "input.txt");

console.time("Part 1");
const part1Result = part1();
console.timeEnd("Part 1");
console.log("Part 1:", part1Result);

console.time("Part 2");
const part2Result = part2();
console.timeEnd("Part 2");
console.log("Part 2:", part2Result);
