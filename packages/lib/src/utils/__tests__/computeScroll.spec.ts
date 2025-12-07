import { computeScroll, type ComputeScrollProps } from '@utils/computeScroll'

describe('computeScroll', () => {
  // Base props for vertical scrolling (uses rowsOnViewport = 4)
  const baseVerticalProps: ComputeScrollProps = {
    index: 1,
    itemSize: 100,
    padding: 10,
    gap: 8,
    rowsOnViewport: 4,
    columnsOnViewport: 2,
    horizontal: false
  }

  // Base props for horizontal scrolling (uses columnsOnViewport = 2)
  const baseHorizontalProps: ComputeScrollProps = {
    ...baseVerticalProps,
    horizontal: true
  }

  describe('vertical scrolling (uses rowsOnViewport)', () => {
    it('should return just padding for first index', () => {
      const result = computeScroll(baseVerticalProps)
      expect(result).toBe(10) // just padding for index 1
    })

    it('should calculate correctly for second index', () => {
      const result = computeScroll({
        ...baseVerticalProps,
        index: 2
      })

      // For index 2 (vertical, rowsOnViewport = 4):
      // itemsSum = 100 * 4 * (2-1) = 400
      // gapSum = 8 * 4 * (2-1) = 32
      // total = 400 + 32 + 10 = 442
      expect(result).toBe(442)
    })

    it('should calculate correctly for larger index', () => {
      const result = computeScroll({
        ...baseVerticalProps,
        index: 5
      })

      // For index 5 (vertical, rowsOnViewport = 4):
      // itemsSum = 100 * 4 * (5-1) = 1600
      // gapSum = 8 * 4 * (5-1) = 128
      // total = 1600 + 128 + 10 = 1738
      expect(result).toBe(1738)
    })
  })

  describe('horizontal scrolling (uses columnsOnViewport)', () => {
    it('should return just padding for first index', () => {
      const result = computeScroll(baseHorizontalProps)
      expect(result).toBe(10) // just padding for index 1
    })

    it('should calculate correctly for second index', () => {
      const result = computeScroll({
        ...baseHorizontalProps,
        index: 2
      })

      // For index 2 (horizontal, columnsOnViewport = 2):
      // itemsSum = 100 * 2 * (2-1) = 200
      // gapSum = 8 * 2 * (2-1) = 16
      // total = 200 + 16 + 10 = 226
      expect(result).toBe(226)
    })

    it('should calculate correctly for larger index', () => {
      const result = computeScroll({
        ...baseHorizontalProps,
        index: 5
      })

      // For index 5 (horizontal, columnsOnViewport = 2):
      // itemsSum = 100 * 2 * (5-1) = 800
      // gapSum = 8 * 2 * (5-1) = 64
      // total = 800 + 64 + 10 = 874
      expect(result).toBe(874)
    })
  })

  describe('direction affects calculation', () => {
    it('vertical and horizontal should give different results with same viewport values', () => {
      const props = {
        index: 3,
        itemSize: 100,
        padding: 10,
        gap: 8,
        rowsOnViewport: 4,
        columnsOnViewport: 2
      }

      const vertical = computeScroll({ ...props, horizontal: false })
      const horizontal = computeScroll({ ...props, horizontal: true })

      // Vertical uses rowsOnViewport = 4
      // itemsSum = 100 * 4 * (3-1) = 800
      // gapSum = 8 * 4 * (3-1) = 64
      // total = 800 + 64 + 10 = 874
      expect(vertical).toBe(874)

      // Horizontal uses columnsOnViewport = 2
      // itemsSum = 100 * 2 * (3-1) = 400
      // gapSum = 8 * 2 * (3-1) = 32
      // total = 400 + 32 + 10 = 442
      expect(horizontal).toBe(442)

      expect(vertical).not.toBe(horizontal)
    })
  })

  describe('edge cases', () => {
    it('should handle zero padding', () => {
      const result = computeScroll({
        ...baseVerticalProps,
        padding: 0
      })
      expect(result).toBe(0)
    })

    it('should handle zero gap', () => {
      const result = computeScroll({
        ...baseVerticalProps,
        gap: 0,
        index: 2
      })

      // For index 2 with no gap (rowsOnViewport = 4):
      // itemsSum = 100 * 4 * (2-1) = 400
      // gapSum = 0
      // total = 400 + 0 + 10 = 410
      expect(result).toBe(410)
    })

    it('should handle single row on viewport', () => {
      const result = computeScroll({
        ...baseVerticalProps,
        rowsOnViewport: 1,
        index: 3
      })

      // For index 3, 1 row on viewport:
      // itemsSum = 100 * 1 * (3-1) = 200
      // gapSum = 8 * 1 * (3-1) = 16
      // total = 200 + 16 + 10 = 226
      expect(result).toBe(226)
    })

    it('should handle large numbers correctly', () => {
      const result = computeScroll({
        ...baseVerticalProps,
        index: 1000,
        itemSize: 50,
        rowsOnViewport: 10
      })

      // For index 1000:
      // itemsSum = 50 * 10 * (1000-1) = 499500
      // gapSum = 8 * 10 * (1000-1) = 79920
      // total = 499500 + 79920 + 10 = 579430
      expect(result).toBe(579430)
    })

    it('should handle decimal item sizes', () => {
      const result = computeScroll({
        ...baseVerticalProps,
        itemSize: 100.5,
        index: 2
      })

      // For index 2 with decimal item size (rowsOnViewport = 4):
      // itemsSum = 100.5 * 4 * (2-1) = 402
      // gapSum = 8 * 4 * (2-1) = 32
      // total = 402 + 32 + 10 = 444
      expect(result).toBe(444)
    })

    it('should handle decimal gaps', () => {
      const result = computeScroll({
        ...baseVerticalProps,
        gap: 8.5,
        index: 2
      })

      // For index 2 with decimal gap (rowsOnViewport = 4):
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
        rowsOnViewport: 1,
        columnsOnViewport: 1,
        horizontal: false
      })
      expect(result).toBe(0)
    })

    it('should handle zero index gracefully', () => {
      const result = computeScroll({
        ...baseVerticalProps,
        index: 0
      })

      // For index 0 (rowsOnViewport = 4):
      // itemsSum = 100 * 4 * (0-1) = -400
      // gapSum = 8 * 4 * (0-1) = -32
      // total = -400 + -32 + 10 = -422
      expect(result).toBe(-422)
    })

    it('should handle negative index gracefully', () => {
      const result = computeScroll({
        ...baseVerticalProps,
        index: -1
      })

      // For index -1 (rowsOnViewport = 4):
      // itemsSum = 100 * 4 * (-1-1) = -800
      // gapSum = 8 * 4 * (-1-1) = -64
      // total = -800 + -64 + 10 = -854
      expect(result).toBe(-854)
    })
  })

  describe('multi-item page scenarios', () => {
    it('should use rowsOnViewport for vertical with multi-column layout', () => {
      // 2x2 grid: 2 rows, 2 columns = 4 items per page
      // But scroll should only move by 2 rows worth
      const result = computeScroll({
        index: 2,
        itemSize: 100,
        padding: 0,
        gap: 10,
        rowsOnViewport: 2,
        columnsOnViewport: 2,
        horizontal: false
      })

      // Vertical uses rowsOnViewport = 2
      // itemsSum = 100 * 2 * (2-1) = 200
      // gapSum = 10 * 2 * (2-1) = 20
      // total = 200 + 20 + 0 = 220
      expect(result).toBe(220)
    })

    it('should use columnsOnViewport for horizontal with multi-row layout', () => {
      // 2x2 grid: 2 rows, 2 columns = 4 items per page
      // But scroll should only move by 2 columns worth
      const result = computeScroll({
        index: 2,
        itemSize: 100,
        padding: 0,
        gap: 10,
        rowsOnViewport: 2,
        columnsOnViewport: 2,
        horizontal: true
      })

      // Horizontal uses columnsOnViewport = 2
      // itemsSum = 100 * 2 * (2-1) = 200
      // gapSum = 10 * 2 * (2-1) = 20
      // total = 200 + 20 + 0 = 220
      expect(result).toBe(220)
    })
  })
})
