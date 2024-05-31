export function roundTo(input: number, digits: number): number {
  const rounder = Math.pow(10, digits)
  return Math.round(input * rounder) / rounder
}

