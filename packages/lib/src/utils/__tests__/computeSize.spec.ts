import { computeSize, type ComputeSizeProps } from '@utils/computeSize'

describe('computeSize', () => {
  const baseProps: ComputeSizeProps = {
    total: 20,
    itemsPerPage: 4,
    itemSize: 100,
    padding: 10,
    gap: 8,
  }

  describe('basic calculations', () => {
    it('should calculate correctly with default values', () => {
      const result = computeSize(baseProps)

      // itemsCount = 20/4 = 5
      // itemsSum = 100 * 5 = 500
      // gapSum = (5-1) * 8 = 32
      // total = 500 + 32 + 10 = 542
      expect(result).toBe(542)
    })

    it('should use itemsPerPage when total is smaller', () => {
      const result = computeSize({
        ...baseProps,
        total: 2,
      })

      // itemsCount = max(2,4)/4 = 1
      // itemsSum = 100 * 1 = 100
      // gapSum = (1-1) * 8 = 0
      // total = 100 + 0 + 10 = 110
      expect(result).toBe(110)
    })

    it('should handle exact multiples correctly', () => {
      const result = computeSize({
        ...baseProps,
        total: 16,
        itemsPerPage: 4,
      })

      // itemsCount = 16/4 = 4
      // itemsSum = 100 * 4 = 400
      // gapSum = (4-1) * 8 = 24
      // total = 400 + 24 + 10 = 434
      expect(result).toBe(434)
    })
  })

  describe('edge cases', () => {
    it('should handle zero total', () => {
      const result = computeSize({
        ...baseProps,
        total: 0,
      })

      // Should use itemsPerPage (4) since max(0,4) = 4
      // itemsCount = 4/4 = 1
      // itemsSum = 100 * 1 = 100
      // gapSum = (1-1) * 8 = 0
      // total = 100 + 0 + 10 = 110
      expect(result).toBe(110)
    })

    it('should handle zero padding', () => {
      const result = computeSize({
        ...baseProps,
        padding: 0,
      })

      // itemsCount = 20/4 = 5
      // itemsSum = 100 * 5 = 500
      // gapSum = (5-1) * 8 = 32
      // total = 500 + 32 + 0 = 532
      expect(result).toBe(532)
    })

    it('should handle zero gap', () => {
      const result = computeSize({
        ...baseProps,
        gap: 0,
      })

      // itemsCount = 20/4 = 5
      // itemsSum = 100 * 5 = 500
      // gapSum = (5-1) * 0 = 0
      // total = 500 + 0 + 10 = 510
      expect(result).toBe(510)
    })

    it('should handle single item per page', () => {
      const result = computeSize({
        ...baseProps,
        itemsPerPage: 1,
        total: 5,
      })

      // itemsCount = 5/1 = 5
      // itemsSum = 100 * 5 = 500
      // gapSum = (5-1) * 8 = 32
      // total = 500 + 32 + 10 = 542
      expect(result).toBe(542)
    })

    it('should handle decimal item sizes', () => {
      const result = computeSize({
        ...baseProps,
        itemSize: 100.5,
      })

      // itemsCount = 20/4 = 5
      // itemsSum = 100.5 * 5 = 502.5
      // gapSum = (5-1) * 8 = 32
      // total = 502.5 + 32 + 10 = 544.5
      expect(result).toBe(544.5)
    })
  })

  describe('boundary conditions', () => {
    it('should handle minimum values', () => {
      const result = computeSize({
        total: 1,
        itemsPerPage: 1,
        itemSize: 1,
        padding: 0,
        gap: 0,
      })
      expect(result).toBe(1)
    })

    it('should handle large numbers', () => {
      const result = computeSize({
        total: 1000,
        itemsPerPage: 10,
        itemSize: 50,
        padding: 20,
        gap: 5,
      })

      // itemsCount = 1000/10 = 100
      // itemsSum = 50 * 100 = 5000
      // gapSum = (100-1) * 5 = 495
      // total = 5000 + 495 + 20 = 5515
      expect(result).toBe(5515)
    })

    it('should handle non-integer division', () => {
      const result = computeSize({
        ...baseProps,
        total: 10,
        itemsPerPage: 3,
      })

      // itemsCount = ceil(10/3) = 4
      // itemsSum = 100 * 4 = 400
      // gapSum = (4 - 1) * 8 = 24
      // total = 400 + 24 + 10 = 434
      expect(result).toBe(434)
    })

    it('should guard against zero itemsPerPage', () => {
      const result = computeSize({
        ...baseProps,
        itemsPerPage: 0,
      })

      expect(result).toBe(baseProps.padding)
    })
  })
})
