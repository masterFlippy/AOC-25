export function modulo(number: number, modulus: number): number {
  return ((number % modulus) + modulus) % modulus;
}
