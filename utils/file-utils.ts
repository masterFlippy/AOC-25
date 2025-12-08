import { readFileSync } from "fs";
import { join } from "path";
import { parseNumbers } from "./string-utils";

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export function readInput(
  day: number,
  filename: string = "input.txt",
  shouldTrim: boolean = true
): string {
  const dayFolder = `day${day.toString().padStart(2, "0")}`;
  const filePath = join(process.cwd(), dayFolder, filename);
  return shouldTrim
    ? readFileSync(filePath, "utf-8").trim()
    : readFileSync(filePath, "utf-8");
}

export function readLines(
  day: number,
  filename: string = "input.txt",
  shouldTrim: boolean = true
): string[] {
  return readInput(day, filename, shouldTrim).split("\n");
}

export function readNumbers(
  day: number,
  filename: string = "input.txt"
): number[] {
  return readLines(day, filename).map((line) => Number(line));
}

export function readDigits(
  day: number,
  filename: string = "input.txt"
): number[][] {
  return readLines(day, filename).map((line) =>
    line.split("").map((digit) => Number(digit))
  );
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

export function read3dCoordinates(
  day: number,
  filename: string = "input.txt"
): Point3D[] {
  return readLines(day, filename).map((line) => {
    const [x, y, z] = parseNumbers(line, ",");
    return { x, y, z };
  });
}
