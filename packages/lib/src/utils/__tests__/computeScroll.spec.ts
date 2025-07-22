import { computeScroll, type ComputeScrollProps } from '@utils/computeScroll'

describe('computeScroll', () => {
  const baseProps: ComputeScrollProps = {
    index: 1,
    itemSize: 100,
    padding: 10,
    gap: 8,
    itemsPerPage: 4
  }

  describe('basic calculations', () => {
    it('should return just padding for first index', () => {
      const result = computeScroll(baseProps)
      expect(result).toBe(10) // just padding for index 1
    })

    it('should calculate correctly for second index', () => {
      const result = computeScroll({
        ...baseProps,
        index: 2
      })

      // For index 2:
      // itemsSum = 100 * 4 * (2-1) = 400
      // gapSum = 8 * 4 * (2-1) = 32
      // total = 400 + 32 + 10 = 442
      expect(result).toBe(442)
    })

    it('should calculate correctly for larger index', () => {
      const result = computeScroll({
        ...baseProps,
        index: 5
      })

      // For index 5:
      // itemsSum = 100 * 4 * (5-1) = 1600
      // gapSum = 8 * 4 * (5-1) = 128
      // total = 1600 + 128 + 10 = 1738
      expect(result).toBe(1738)
    })
  })

  describe('edge cases', () => {
    it('should handle zero padding', () => {
      const result = computeScroll({
        ...baseProps,
        padding: 0
      })
      expect(result).toBe(0)
    })

    it('should handle zero gap', () => {
      const result = computeScroll({
        ...baseProps,
        gap: 0,
        index: 2
      })

      // For index 2 with no gap:
      // itemsSum = 100 * 4 * (2-1) = 400
      // gapSum = 0
      // total = 400 + 0 + 10 = 410
      expect(result).toBe(410)
    })

    it('should handle single item per page', () => {
      const result = computeScroll({
        ...baseProps,
        itemsPerPage: 1,
        index: 3
      })

      // For index 3, 1 item per page:
      // itemsSum = 100 * 1 * (3-1) = 200
      // gapSum = 8 * 1 * (3-1) = 16
      // total = 200 + 16 + 10 = 226
      expect(result).toBe(226)
    })

    it('should handle large numbers correctly', () => {
      const result = computeScroll({
        ...baseProps,
        index: 1000,
        itemSize: 50,
        itemsPerPage: 10
      })

      // For index 1000:
      // itemsSum = 50 * 10 * (1000-1) = 499500
      // gapSum = 8 * 10 * (1000-1) = 79920
      // total = 499500 + 79920 + 10 = 579430
      expect(result).toBe(579430)
    })

    it('should handle decimal item sizes', () => {
      const result = computeScroll({
        ...baseProps,
        itemSize: 100.5,
        index: 2
      })

      // For index 2 with decimal item size:
      // itemsSum = 100.5 * 4 * (2-1) = 402
      // gapSum = 8 * 4 * (2-1) = 32
      // total = 402 + 32 + 10 = 444
      expect(result).toBe(444)
    })

    it('should handle decimal gaps', () => {
      const result = computeScroll({
        ...baseProps,
        gap: 8.5,
        index: 2
      })

      // For index 2 with decimal gap:
      // itemsSum = 100 * 4 * (2-1) = 400
      // gapSum = 8.5 * 4 * (2-1) = 34
      // total = 400 + 34 + 10 = 444
      expect(result).toBe(444)
    })
  })

  describe('boundary conditions', () => {
    it('should handle minimum values', () => {
      const result = computeScroll({
        index: 1,
        itemSize: 1,
        padding: 0,
        gap: 0,
        itemsPerPage: 1
      })
      expect(result).toBe(0)
    })

    it('should handle zero index gracefully', () => {
      const result = computeScroll({
        ...baseProps,
        index: 0
      })

      // For index 0:
      // itemsSum = 100 * 4 * (0-1) = -400
      // gapSum = 8 * 4 * (0-1) = -32
      // total = -400 + -32 + 10 = -422
      expect(result).toBe(-422)
    })

    it('should handle negative index gracefully', () => {
      const result = computeScroll({
        ...baseProps,
        index: -1
      })

      // For index -1:
      // itemsSum = 100 * 4 * (-1-1) = -800
      // gapSum = 8 * 4 * (-1-1) = -64
      // total = -800 + -64 + 10 = -854
      expect(result).toBe(-854)
    })
  })

  describe('performance with different combinations', () => {
    it('should handle different itemsPerPage values correctly', () => {
      const results = [1, 5, 10, 20].map(itemsPerPage =>
        computeScroll({
          ...baseProps,
          itemsPerPage,
          index: 3
        })
      )

      // Verify each result matches expected calculation
      results.forEach((result, i) => {
        const itemsPerPage = [1, 5, 10, 20][i]
        const expected = (
          baseProps.itemSize * itemsPerPage * (3-1) +
          baseProps.gap * itemsPerPage * (3-1) +
          baseProps.padding
        )
        expect(result).toBe(expected)
      })
    })

    it('should maintain proportional scaling with item size and gap', () => {
      const baseResult = computeScroll({
        ...baseProps,
        index: 2
      })

      const doubledResult = computeScroll({
        ...baseProps,
        index: 2,
        itemSize: baseProps.itemSize * 2,
        gap: baseProps.gap * 2
      })

      // Should be almost double but not quite since padding remains constant
      expect(doubledResult).toBeLessThanOrEqual(baseResult * 2)
      expect(doubledResult).toBeGreaterThan(baseResult * 1.9) // Allow some margin
    })
  })
})
