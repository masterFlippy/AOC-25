import { readDigits } from "../utils/file-utils";

function getJoltage(bank: number[]): number {
  const combos = bank.flatMap((first, i) =>
    bank.slice(i + 1).map((second) => first * 10 + second)
  );

  return Math.max(...combos);
}

function getJoltage2(bank: number[]): number {
  const joltage: number[] = [];
  const toRemove = bank.length - 12;
  let removed: number = 0;

  for (const digit of bank) {
    while (
      joltage.length > 0 &&
      digit > joltage[joltage.length - 1] &&
      removed < toRemove
    ) {
      joltage.pop();
      removed++;
    }
    joltage.push(digit);
  }

  return Number(joltage.slice(0, 12).join(""));
}

function calculateJoltage(joltageFunction: (bank: number[]) => number): number {
  const joltages: number[] = [];
  for (const bank of banks) {
    joltages.push(joltageFunction(bank));
  }
  return joltages.reduce((accumulator, value) => accumulator + value, 0);
}

function part1(): number {
  return calculateJoltage(getJoltage);
}

function part2(): number {
  return calculateJoltage(getJoltage2);
}

const banks = readDigits(3);
console.log("Part 1:", part1());
console.log("Part 2:", part2());
