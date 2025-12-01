import { readFileSync } from "fs";
import { join } from "path";

export function readInput(day: number, filename: string = "input.txt"): string {
  const dayFolder = `day${day.toString().padStart(2, "0")}`;
  const filePath = join(process.cwd(), dayFolder, filename);
  return readFileSync(filePath, "utf-8").trim();
}

export function readLines(
  day: number,
  filename: string = "input.txt"
): string[] {
  return readInput(day, filename).split("\n");
}

export function readNumbers(
  day: number,
  filename: string = "input.txt"
): number[] {
  return readLines(day, filename).map((line) => parseInt(line, 10));
}

export function readGroups(
  day: number,
  filename: string = "input.txt"
): string[][] {
  const content = readInput(day, filename);
  return content.split("\n\n").map((group) => group.split("\n"));
}

export function readGrid(
  day: number,
  filename: string = "input.txt"
): string[][] {
  return readLines(day, filename).map((line) => line.split(""));
}
