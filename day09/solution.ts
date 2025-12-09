import {
  compressCoordinates,
  getEdgePoints,
  intersectsGrid,
} from "../utils/array-utils";
import { read2dCoordinates } from "../utils/file-utils";
import {
  floodFill,
  calculateRectangleArea,
  createPolygonGrid,
} from "../utils/math-utils";

function findLargestValidRectangle(
  xCoordinates: number[],
  yCoordinates: number[],
  outside: boolean[][]
): number {
  let max = 0;

  for (let firstIndex = 0; firstIndex < coordinates.length; firstIndex++) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < coordinates.length;
      secondIndex++
    ) {
      const corner1 = coordinates[firstIndex];
      const corner2 = coordinates[secondIndex];
      const bounds = {
        minRow: yCoordinates.indexOf(Math.min(corner1.y, corner2.y)),
        maxRow: yCoordinates.indexOf(Math.max(corner1.y, corner2.y)),
        minColumn: xCoordinates.indexOf(Math.min(corner1.x, corner2.x)),
        maxColumn: xCoordinates.indexOf(Math.max(corner1.x, corner2.x)),
      };
      const cornersOutside = [
        outside[bounds.minRow][bounds.minColumn],
        outside[bounds.minRow][bounds.maxColumn],
        outside[bounds.maxRow][bounds.minColumn],
        outside[bounds.maxRow][bounds.maxColumn],
      ].some(Boolean);

      if (
        !cornersOutside &&
        !intersectsGrid(
          outside,
          bounds.minRow,
          bounds.maxRow,
          bounds.minColumn,
          bounds.maxColumn,
          (value) => value
        )
      ) {
        max = Math.max(max, calculateRectangleArea(corner1, corner2));
      }
    }
  }

  return max;
}
function largestRectangle(): number {
  let max = 0;

  for (let firstIndex = 0; firstIndex < coordinates.length; firstIndex++) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < coordinates.length;
      secondIndex++
    ) {
      const area = calculateRectangleArea(
        coordinates[firstIndex],
        coordinates[secondIndex]
      );
      max = Math.max(max, area);
    }
  }

  return max;
}

function part1(): number {
  return largestRectangle();
}

function part2(): number {
  const [xCoordinates, yCoordinates] = [
    compressCoordinates(coordinates, (column) => column.x),
    compressCoordinates(coordinates, (column) => column.y),
  ];
  const grid = createPolygonGrid(coordinates, xCoordinates, yCoordinates);
  const edgePoints = getEdgePoints(grid, (value) => !value);
  const outside = floodFill(grid, edgePoints);

  return findLargestValidRectangle(xCoordinates, yCoordinates, outside);
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
