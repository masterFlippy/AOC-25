import { createGrid } from "../utils/array-utils";
import { readLines } from "../utils/file-utils";
import { Arith, ContextCtor, init, IntNum } from "z3-solver";

interface Machine {
  targets: boolean[];
  buttons: number[][];
  joltageRequirements: number[];
}

function readMachines(day: number, filename: string = "input.txt"): Machine[] {
  return readLines(day, filename).map((line) => {
    const patternMatch = line.match(/\[([.#]+)\]/);
    const buttonMatches = [...line.matchAll(/\(([0-9,]+)\)/g)];
    const joltageMatch = line.match(/\{([0-9,]+)\}/);

    return {
      targets: patternMatch![1].split("").map((c) => c === "#"),
      buttons: buttonMatches.map((m) => m[1].split(",").map(Number)),
      joltageRequirements: joltageMatch![1].split(",").map(Number),
    };
  });
}

function findMinimalPresses1(
  grid: number[][],
  targetPattern: number[]
): number[] | null {
  const buttonCount = grid[0].length;

  for (let totalPresses = 0; totalPresses <= buttonCount; totalPresses++) {
    const result = testCombination(
      grid,
      targetPattern,
      buttonCount,
      totalPresses
    );
    if (result) {
      return result;
    }
  }

  return null;
}

async function findMinimalPresses2(
  buttons: number[][],
  targets: number[],
  Context: ContextCtor
): Promise<number> {
  const { Int, Optimize } = Context("main");
  const solver = new Optimize();

  const variables = buttons.map((_, i) => {
    const variable = Int.const(`button_${i}`);
    solver.add(variable.ge(0));
    return variable;
  });

  for (let counterIndex = 0; counterIndex < targets.length; counterIndex++) {
    let constraint: IntNum<"main"> = Int.val(0);
    buttons.forEach((button, buttonIndex) => {
      if (button.includes(counterIndex)) {
        constraint = constraint.add(variables[buttonIndex]) as IntNum<"main">;
      }
    });
    solver.add(constraint.eq(Int.val(targets[counterIndex])));
  }

  const presses: Arith<"main"> = variables.reduce(
    (sum, variable) => sum.add(variable),
    Int.val(0)
  );
  solver.minimize(presses);

  if ((await solver.check()) === "sat") {
    return Number(solver.model().eval(presses).toString());
  }

  return 0;
}

function testCombination(
  lightMatrix: number[][],
  targetPattern: number[],
  buttonCount: number,
  presses: number
): number[] | null {
  const pressPattern = new Array(buttonCount).fill(0);

  function backtrack(position: number, remaining: number): boolean {
    if (remaining === 0) {
      const lightState = new Array(lightMatrix.length).fill(0);
      for (let buttonIndex = 0; buttonIndex < buttonCount; buttonIndex++) {
        if (pressPattern[buttonIndex] === 1) {
          for (
            let lightIndex = 0;
            lightIndex < lightMatrix.length;
            lightIndex++
          ) {
            lightState[lightIndex] ^= lightMatrix[lightIndex][buttonIndex];
          }
        }
      }
      return lightState.every((value, index) => value === targetPattern[index]);
    }

    if (position >= buttonCount) {
      return false;
    }

    if (backtrack(position + 1, remaining)) {
      return true;
    }
    pressPattern[position] = 1;

    if (backtrack(position + 1, remaining - 1)) {
      return true;
    }
    pressPattern[position] = 0;

    return false;
  }

  return backtrack(0, presses) ? [...pressPattern] : null;
}

function part1(): number {
  let total = 0;
  for (const machine of machines) {
    const { targets, buttons } = machine;
    const targetPattern = targets.map((light) => (light ? 1 : 0));

    const grid = createGrid(targets.length, buttons.length, 0);
    for (const [buttonIndex, button] of buttons.entries()) {
      for (const lightIndex of button) {
        grid[lightIndex][buttonIndex] = 1;
      }
    }

    const presses = findMinimalPresses1(grid, targetPattern);

    if (presses) {
      total += presses.reduce((sum, presses) => sum + presses, 0);
    }
  }
  return total;
}

async function part2(): Promise<number> {
  const { Context } = await init();
  const results = await Promise.all(
    machines.map((machine) =>
      findMinimalPresses2(machine.buttons, machine.joltageRequirements, Context)
    )
  );

  return results.reduce((sum, result) => sum + result, 0);
}

const machines = readMachines(10, "input.txt");
console.time("Part 1");
const part1Result = part1();
console.timeEnd("Part 1");
console.log("Part 1:", part1Result);

console.time("Part 2");
part2().then((part2Result) => {
  console.timeEnd("Part 2");
  console.log("Part 2:", part2Result);
});
