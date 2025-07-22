import { Layout } from '@types'
import { computeGrid, MAX_SIZE, type ComputeGridProps } from '@utils/computeGrid'

describe('computeGrid', () => {
  const baseLayout: Layout = {
    scrollWidth: 1200,
    scrollHeight: 800,
    rows: 20,
    horizontal: false,
    rowsOnViewport: 4,
    columns: 15,
    columnsOnViewport: 3,
    total: 60,
    pages: 5,
    itemsPerRow: 4,
    itemsPerColumn: 3,
    itemsPerPage: 12,
    itemHeight: 100,
    itemWidth: 150,
    gridHeight: 800,
    gridWidth: 1000,
  }

  const baseProps: ComputeGridProps = {
    layout: baseLayout,
    page: 2,
    padding: [10, 10, 10, 10],
    offScreenPages: 1,
    gap: 8,
  }

  describe('input validation', () => {
    it('should return empty object when layout is missing', () => {
      const result = computeGrid({
        ...baseProps,
        layout: undefined as unknown as Layout,
      })
      expect(result).toEqual({})
    })

    it('should return empty object when page is 0', () => {
      const result = computeGrid({
        ...baseProps,
        page: 0,
      })
      expect(result).toEqual({})
    })
  })

  describe('vertical layout calculations', () => {
    it('should calculate correct boundaries and padding for middle page', () => {
      const result = computeGrid(baseProps)

      const itemH = baseLayout.itemHeight + baseProps.gap
      const minBoundary = Math.max(0, baseProps.page - baseProps.offScreenPages - 1)
      const maxBoundary = Math.min(baseLayout.pages, baseProps.page + 1 + baseProps.offScreenPages)

      expect(result).toEqual({
        start: minBoundary * baseLayout.itemsPerPage,
        end: maxBoundary * baseLayout.itemsPerPage,
        width: 'auto',
        paddingTop: minBoundary * baseLayout.rowsOnViewport * itemH + baseProps.padding[0],
        paddingRight: baseProps.padding[1],
        paddingBottom: Math.max(0, (baseLayout.rows - maxBoundary * baseLayout.rowsOnViewport) * itemH) + baseProps.padding[2],
        paddingLeft: baseProps.padding[3],
      })
    })

    it('should handle first page correctly', () => {
      const result = computeGrid({
        ...baseProps,
        page: 1,
      })

      expect(result.paddingTop).toBe(baseProps.padding[0])
      expect(result.start).toBe(0)
    })

    it('should handle last page correctly', () => {
      const result = computeGrid({
        ...baseProps,
        page: baseLayout.pages,
      })

      expect(result.paddingBottom).toBe(baseProps.padding[2])
      expect(result.end).toBe(baseLayout.pages * baseLayout.itemsPerPage)
    })

    it('should respect MAX_SIZE for bottom padding', () => {
      const largeLayout: Layout = {
        ...baseLayout,
        rows: 1000000,
        total: 1000000,
        pages: Math.ceil(1000000 / baseLayout.itemsPerPage),
      }

      const result = computeGrid({
        ...baseProps,
        layout: largeLayout,
      })

      expect(result.paddingBottom).toBeLessThanOrEqual(MAX_SIZE - result.paddingTop)
    })
  })

  describe('horizontal layout calculations', () => {
    const horizontalLayout: Layout = {
      ...baseLayout,
      horizontal: true,
      scrollWidth: 800,
      scrollHeight: 1200,
    }

    const horizontalProps = {
      ...baseProps,
      layout: horizontalLayout,
    }

    it('should calculate correct boundaries and padding for middle page', () => {
      const result = computeGrid(horizontalProps)

      const itemW = horizontalLayout.itemWidth + horizontalProps.gap
      const minBoundary = Math.max(0, horizontalProps.page - horizontalProps.offScreenPages - 1)
      const maxBoundary = Math.min(horizontalLayout.pages, horizontalProps.page + 1 + horizontalProps.offScreenPages)

      expect(result).toEqual({
        start: minBoundary * horizontalLayout.itemsPerPage,
        end: maxBoundary * horizontalLayout.itemsPerPage,
        width: horizontalLayout.gridWidth,
        paddingTop: horizontalProps.padding[0],
        paddingRight: Math.max(0, (horizontalLayout.columns - maxBoundary * horizontalLayout.columnsOnViewport) * itemW) + horizontalProps.padding[1],
        paddingBottom: horizontalProps.padding[2],
        paddingLeft: minBoundary * horizontalLayout.columnsOnViewport * itemW + horizontalProps.padding[3],
      })
    })

    it('should handle first page correctly in horizontal layout', () => {
      const result = computeGrid({
        ...horizontalProps,
        page: 1,
      })

      expect(result.paddingLeft).toBe(horizontalProps.padding[3])
      expect(result.start).toBe(0)
    })

    it('should handle last page correctly in horizontal layout', () => {
      const result = computeGrid({
        ...horizontalProps,
        page: horizontalLayout.pages,
      })

      expect(result.paddingRight).toBe(horizontalProps.padding[1])
      expect(result.end).toBe(horizontalLayout.pages * horizontalLayout.itemsPerPage)
    })

    it('should respect MAX_SIZE for right padding', () => {
      const largeLayout: Layout = {
        ...horizontalLayout,
        columns: 1000000,
        total: 1000000,
        pages: Math.ceil(1000000 / horizontalLayout.itemsPerPage),
      }

      const result = computeGrid({
        ...horizontalProps,
        layout: largeLayout,
      })

      expect(result.paddingRight).toBeLessThanOrEqual(MAX_SIZE - result.paddingLeft)
    })
  })

  describe('edge cases and boundary conditions', () => {
    it('should handle zero gap correctly', () => {
      const result = computeGrid({
        ...baseProps,
        gap: 0,
      })

      expect(result.start).toBeDefined()
      expect(result.end).toBeDefined()
      // Verify padding calculations without gap
      expect(result.paddingTop).toBe(
        Math.max(0, baseProps.page - baseProps.offScreenPages - 1) *
        baseLayout.rowsOnViewport * baseLayout.itemHeight +
        baseProps.padding[0]
      )
    })

    it('should handle zero padding correctly', () => {
      const result = computeGrid({
        ...baseProps,
        padding: [0, 0, 0, 0],
      })

      expect(result.paddingTop).toBe(
        Math.max(0, baseProps.page - baseProps.offScreenPages - 1) *
        baseLayout.rowsOnViewport * (baseLayout.itemHeight + baseProps.gap)
      )
      expect(result.paddingRight).toBe(0)
      expect(result.paddingBottom).toBeGreaterThanOrEqual(0)
      expect(result.paddingLeft).toBe(0)
    })

    it('should handle minimum grid dimensions', () => {
      const minLayout: Layout = {
        ...baseLayout,
        itemsPerPage: 1,
        itemsPerRow: 1,
        itemsPerColumn: 1,
        rowsOnViewport: 1,
        columnsOnViewport: 1,
        rows: 1,
        columns: 1,
        total: 1,
        pages: 1,
        gridHeight: 100,
        gridWidth: 150,
      }

      const result = computeGrid({
        ...baseProps,
        layout: minLayout,
        page: 1,
      })

      expect(result).toEqual({
        start: 0,
        end: 1,
        width: 'auto',
        paddingTop: baseProps.padding[0],
        paddingRight: baseProps.padding[1],
        paddingBottom: baseProps.padding[2],
        paddingLeft: baseProps.padding[3],
      })
    })

    it('should handle maximum allowed dimensions', () => {
      const maxPossibleItems = Math.floor(MAX_SIZE / (baseLayout.itemHeight + baseProps.gap))
      const maxLayout: Layout = {
        ...baseLayout,
        rows: maxPossibleItems,
        total: maxPossibleItems,
        pages: Math.ceil(maxPossibleItems / baseLayout.itemsPerPage),
      }

      const result = computeGrid({
        ...baseProps,
        layout: maxLayout,
      })

      const totalPadding = result.paddingTop + result.paddingBottom
      expect(totalPadding).toBeLessThanOrEqual(MAX_SIZE)
    })
  })
})
