import { readInput } from "../utils/file-utils";

function countFittingRegions() {
  const regionLines = blocks.pop()?.split("\n") ?? [];
  const shapeAreas = blocks.map(
    (block) => block.split("\n").slice(1).join("").match(/#/g)?.length ?? 0
  );

  return regionLines.reduce((accumulator, line) => {
    if (!line.trim()) {
      return accumulator;
    }

    const [dimensions, rest] = line.split(":");
    const [width, height] = dimensions.split("x").map(Number);
    const counts = rest.trim().split(/\s+/).map(Number);

    const totalCells = counts.reduce(
      (sum, count, i) => sum + count * shapeAreas[i],
      0
    );

    if (totalCells > width * height) {
      return accumulator;
    }

    const fillRatio = totalCells / (width * height);
    return fillRatio <= 0.85 ? accumulator + 1 : accumulator;
  }, 0);
}

function part1(): number {
  return countFittingRegions();
}
const blocks = readInput(12, "input.txt", false)
  .trimEnd()
  .split(/\n\s*\n/);
console.time("Part 1");
const part1Result = part1();
console.timeEnd("Part 1");
console.log("Part 1:", part1Result);
