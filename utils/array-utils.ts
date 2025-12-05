interface Range {
  start: number;
  end: number;
}
export function sum(array: number[]): number {
  return array.reduce((acc, val) => acc + val, 0);
}

export function max(array: number[]): number {
  return Math.max(...array);
}

export function min(array: number[]): number {
  return Math.min(...array);
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function isInBounds<T>(
  grid: T[][],
  row: number,
  column: number
): boolean {
  return (
    row >= 0 && row < grid.length && column >= 0 && column < grid[0].length
  );
}

export function readRanges(rangeLines: string[]): Range[] {
  return rangeLines.map((line) => {
    const [start, end] = line.split("-").map(Number);
    return { start, end };
  });
}

export function isInRanges(id: number, ranges: Range[]): boolean {
  return ranges.some((range) => id >= range.start && id <= range.end);
}

export function mergeOverlappingRanges(ranges: Range[]): Range[] {
  if (ranges.length === 0) {
    return [];
  }

  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged = [sorted[0]];

  for (const current of sorted.slice(1)) {
    const last = merged[merged.length - 1];

    if (current.start <= last.end + 1) {
      last.end = max([last.end, current.end]);
    } else {
      merged.push(current);
    }
  }

  return merged;
}
