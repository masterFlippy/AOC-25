export function modulo(number: number, modulus: number): number {
  return ((number % modulus) + modulus) % modulus;
}
export function applyOperator(a: number, b: number, operator: string): number {
  switch (operator) {
    case "+":
      return a + b;
    case "*":
      return a * b;
    case "-":
      return a - b;
    case "/":
      return a / b;
    default:
      return a + b;
  }
}
