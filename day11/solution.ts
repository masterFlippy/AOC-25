import { readDeviceMappings } from "../utils/file-utils";
import { bfs, countMemo, dfsPaths } from "../utils/math-utils";

interface State {
  node: string;
  seenDac: boolean;
  seenFft: boolean;
}

function part1(): number {
  const paths: string[][] = [];
  dfsPaths(
    "you",
    (node) => devices[node] ?? [],
    (node) => node,
    (node) => node === "out",
    (path) => paths.push(path)
  );
  return paths.length;
}

async function part2(): Promise<number> {
  const reverse: Record<string, string[]> = {};
  for (const [from, targets] of Object.entries(devices)) {
    for (const target of targets) {
      (reverse[target] ??= []).push(from);
    }
  }

  const collectReachable = (target: string) => {
    const seen = new Set<string>();
    bfs(
      target,
      (node) => reverse[node] ?? [],
      (node) => node,
      undefined,
      (node) => seen.add(node)
    );
    return seen;
  };

  const canReachOut = collectReachable("out");
  const canReachDac = collectReachable("dac");
  const canReachFft = collectReachable("fft");

  const countPaths = (state: State): number => {
    if (state.node === "out") {
      return state.seenDac && state.seenFft ? 1 : 0;
    }
    return countMemo(
      state,
      (state: State): State[] =>
        (devices[state.node] ?? []).flatMap((neighbor) => {
          if (!canReachOut.has(neighbor)) {
            return [];
          }
          if (!state.seenDac && !canReachDac.has(neighbor)) {
            return [];
          }
          if (!state.seenFft && !canReachFft.has(neighbor)) {
            return [];
          }
          return [
            {
              node: neighbor,
              seenDac: state.seenDac || neighbor === "dac",
              seenFft: state.seenFft || neighbor === "fft",
            },
          ];
        }),
      (state: State) =>
        `${state.node}:${Number(state.seenDac)}:${Number(state.seenFft)}`
    );
  };

  return countPaths({ node: "svr", seenDac: false, seenFft: false });
}
const devices = readDeviceMappings(11);
console.time("Part 1");
const part1Result = part1();
console.timeEnd("Part 1");
console.log("Part 1:", part1Result);

console.time("Part 2");
part2().then((part2Result) => {
  console.timeEnd("Part 2");
  console.log("Part 2:", part2Result);
});
