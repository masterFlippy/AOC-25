import { readLines } from "../utils/file-utils";
import { applyOperator } from "../utils/math-utils";
import { extractNumbers } from "../utils/string-utils";

interface ColumnData {
  numbers: number[];
  operator: string;
}

function parseColumns(lines: string[]): ColumnData[] {
  const rows = lines.slice(0, -1);
  const operatorRow = lines[lines.length - 1];

  const operators = operatorRow
    .split("")
    .filter((character) => character.trim());

  const numberArrays = rows.map((row) => extractNumbers(row));

  return Array.from({ length: numberArrays[0].length }, (_, columnIndex) => ({
    numbers: numberArrays.map((row) => row[columnIndex]),
    operator: operators[columnIndex],
  }));
}

function parseColumns2(lines: string[]): ColumnData[] {
  const rows = lines.slice(0, -1);
  const operatorRow = lines[lines.length - 1];

  const operatorMatches = [...operatorRow.matchAll(/\*|\+/g)];

  return operatorMatches.map((match, i) => {
    const start = match.index;
    const end =
      i + 1 < operatorMatches.length
        ? operatorMatches[i + 1].index
        : operatorRow.length;
    const operator = match[0];

    const column = Array.from({ length: end - start }, (_, offset) =>
      rows
        .map((line) => line[start + offset] || " ")
        .join("")
        .trim()
    ).filter(Boolean);

    return {
      numbers: column.map(Number),
      operator,
    };
  });
}

function calculateSum(columns: ColumnData[]): number {
  return columns
    .map((column) =>
      column.numbers.reduce((a, b) => applyOperator(a, b, column.operator))
    )
    .reduce((a, b) => a + b, 0);
}

function part1(): number {
  const lines = readLines(6, "input.txt");

  return calculateSum(parseColumns(lines));
}

function part2(): number {
  const lines = readLines(6, "input.txt", false);

  return calculateSum(parseColumns2(lines));
}

console.log("Part 1:", part1());
console.log("Part 2:", part2());
