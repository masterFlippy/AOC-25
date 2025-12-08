import { read3dCoordinates } from "../utils/file-utils";
import { createUnionFind, distance3d, UnionFind } from "../utils/math-utils";

interface Pair {
  firstIndex: number;
  secondIndex: number;
  distance: number;
}

function circuitSizes(unionFind: UnionFind, count: number): number[] {
  return [
    ...Array.from({ length: count }, (_, i) => unionFind.find(i))
      .reduce(
        (countsByRoot, root) =>
          countsByRoot.set(root, (countsByRoot.get(root) ?? 0) + 1),
        new Map<number, number>()
      )
      .values(),
  ];
}

function buildPairs(): Pair[] {
  const pairs: Pair[] = [];
  for (
    let firstIndex = 0;
    firstIndex < junctionBoxCoordinates.length;
    firstIndex++
  ) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < junctionBoxCoordinates.length;
      secondIndex++
    ) {
      pairs.push({
        firstIndex,
        secondIndex,
        distance: distance3d(
          junctionBoxCoordinates[firstIndex],
          junctionBoxCoordinates[secondIndex]
        ),
      });
    }
  }
  return pairs.sort((a, b) => a.distance - b.distance);
}

function buildConnections(
  unionFind: UnionFind,
  pairs: Pair[],
  junctionBoxCount: number,
  options: {
    maxPairsToProcess?: number;
    stopWhenSingle?: boolean;
  }
): Pair | undefined {
  const { maxPairsToProcess, stopWhenSingle } = options;
  let processed = 0;
  let count = junctionBoxCount;
  let lastConnection: Pair | undefined;

  for (const pair of pairs) {
    if (maxPairsToProcess && processed >= maxPairsToProcess) {
      break;
    }

    processed++;

    if (unionFind.union(pair.firstIndex, pair.secondIndex)) {
      lastConnection = pair;
      count--;

      if (stopWhenSingle && count === 1) {
        break;
      }
    }
  }

  return lastConnection;
}

function part1(pairsToProcess: number): number {
  const unionFind = createUnionFind(junctionBoxCoordinates.length);

  buildConnections(unionFind, sortedPairs, junctionBoxCoordinates.length, {
    maxPairsToProcess: pairsToProcess,
  });

  const sizes = circuitSizes(unionFind, junctionBoxCoordinates.length);

  return sizes
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b, 1);
}

function part2(): number {
  const unionFind = createUnionFind(junctionBoxCoordinates.length);
  const lastConnection = buildConnections(
    unionFind,
    sortedPairs,
    junctionBoxCoordinates.length,
    {
      stopWhenSingle: true,
    }
  );

  if (!lastConnection) {
    throw new Error("No connections made.");
  }

  return (
    junctionBoxCoordinates[lastConnection.firstIndex].x *
    junctionBoxCoordinates[lastConnection.secondIndex].x
  );
}

const junctionBoxCoordinates = read3dCoordinates(8);
const sortedPairs = buildPairs();

console.time("Part 1");
const part1Result = part1(1000);
console.timeEnd("Part 1");
console.log("Part 1:", part1Result);

console.time("Part 2");
const part2Result = part2();
console.timeEnd("Part 2");
console.log("Part 2:", part2Result);
