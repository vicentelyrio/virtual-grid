import { roundTo } from '@utils/roundTo'

describe('roundTo', () => {
  it('should round to 0 decimal places', () => {
    expect(roundTo(3.14159, 0)).toBe(3)
    expect(roundTo(2.7, 0)).toBe(3)
    expect(roundTo(2.2, 0)).toBe(2)
  })

  it('should round to 2 decimal places', () => {
    expect(roundTo(3.14159, 2)).toBe(3.14)
    expect(roundTo(2.719, 2)).toBe(2.72)
    expect(roundTo(2.001, 2)).toBe(2.00)
  })

  it('should round to negative decimal places', () => {
    expect(roundTo(123, -1)).toBe(120)
    expect(roundTo(155, -2)).toBe(200)
    expect(roundTo(1234, -3)).toBe(1000)
  })

  it('should handle zero input', () => {
    expect(roundTo(0, 2)).toBe(0)
    expect(roundTo(0, 0)).toBe(0)
    expect(roundTo(0, -2)).toBe(0)
  })

  it('should handle negative numbers', () => {
    expect(roundTo(-3.14159, 2)).toBe(-3.14)
    expect(roundTo(-2.719, 1)).toBe(-2.7)
    expect(roundTo(-155, -2)).toBe(-200)
  })
})
