export function extractNumbers(string: string): number[] {
  const matches = string.match(/-?\d+/g);
  return matches ? matches.map(Number) : [];
}

export function reverse(string: string): string {
  return string.split("").reverse().join("");
}

export function isPalindrome(string: string): boolean {
  const cleaned = string.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === reverse(cleaned);
}

export function parseNumbers(
  string: string,
  delimiter: string = ","
): number[] {
  return string.split(delimiter).map((s) => parseFloat(s.trim()));
}

export function splitByDelimiter(
  string: string,
  delimiter: string = ","
): string[] {
  return string.split(delimiter).map((s) => s.trim());
}

export function parseRange(range: string): { start: number; end: number } {
  const [start, end] = range.trim().split("-").map(Number);
  return { start, end };
}

export function isRepeatedPattern(string: string, length: number): boolean {
  return string.substring(0, length).repeat(string.length / length) === string;
}
