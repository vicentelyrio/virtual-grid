import { Layout } from '@types'
import { computeGrid, MAX_SIZE, type ComputeGridProps } from '@utils/computeGrid'

describe('computeGrid', () => {
  const baseLayout: Layout = {
    scrollWidth: 1200,
    scrollHeight: 800,
    rows: 15,
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
    gridOffsetTop: 0,
    gridOffsetLeft: 0,
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
      const maxBoundary = Math.min(baseLayout.pages, baseProps.page + baseProps.offScreenPages)

      const rowsBefore = minBoundary * baseLayout.rowsOnViewport
      const rowsAfter = Math.max(0, baseLayout.rows - maxBoundary * baseLayout.rowsOnViewport)

      expect(result).toEqual({
        start: minBoundary * baseLayout.itemsPerPage,
        end: maxBoundary * baseLayout.itemsPerPage,
        width: 'auto',
        paddingTop: rowsBefore * itemH + baseProps.padding[0],
        paddingRight: baseProps.padding[1],
        paddingBottom: Math.max(baseProps.padding[2], rowsAfter * itemH + baseProps.padding[2]),
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
      const maxBoundary = Math.min(horizontalLayout.pages, horizontalProps.page + horizontalProps.offScreenPages)

      const columnsBefore = minBoundary * horizontalLayout.columnsOnViewport
      const columnsAfter = Math.max(0, horizontalLayout.columns - maxBoundary * horizontalLayout.columnsOnViewport)

      const pr = columnsAfter * itemW + horizontalProps.padding[1]

      expect(result).toEqual({
        start: minBoundary * horizontalLayout.itemsPerPage,
        end: maxBoundary * horizontalLayout.itemsPerPage,
        width: horizontalLayout.gridWidth,
        paddingTop: horizontalProps.padding[0],
        paddingRight: Math.max(horizontalProps.padding[1], pr),
        paddingBottom: horizontalProps.padding[2],
        paddingLeft: columnsBefore * itemW + horizontalProps.padding[3],
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

  describe('user padding scenarios', () => {
    it('should only have user padding when all items visible (vertical)', () => {
      const smallLayout: Layout = {
        ...baseLayout,
        total: 4,
        pages: 1,
        rows: 1,
      }

      const result = computeGrid({
        layout: smallLayout,
        page: 1,
        padding: [20, 20, 20, 20],
        offScreenPages: 1,
        gap: 10,
      })

      expect(result.paddingTop).toBe(20)
      expect(result.paddingBottom).toBe(20)
      expect(result.paddingLeft).toBe(20)
      expect(result.paddingRight).toBe(20)
    })

    it('should only have user padding when all items visible (horizontal)', () => {
      const smallLayout: Layout = {
        ...baseLayout,
        horizontal: true,
        total: 3,
        pages: 1,
        columns: 1,
      }

      const result = computeGrid({
        layout: smallLayout,
        page: 1,
        padding: [20, 20, 20, 20],
        offScreenPages: 1,
        gap: 10,
      })

      expect(result.paddingTop).toBe(20)
      expect(result.paddingBottom).toBe(20)
      expect(result.paddingLeft).toBe(20)
      expect(result.paddingRight).toBe(20)
    })

    it('should work correctly with zero top/bottom padding (vertical)', () => {
      const result = computeGrid({
        ...baseProps,
        padding: [0, 20, 0, 20],
        page: 1,
      })

      expect(result.paddingTop).toBe(0)
      expect(result.paddingLeft).toBe(20)
      expect(result.paddingRight).toBe(20)
    })

    it('should work correctly with zero left/right padding (horizontal)', () => {
      const horizontalLayout: Layout = {
        ...baseLayout,
        horizontal: true,
      }

      const result = computeGrid({
        layout: horizontalLayout,
        page: 1,
        padding: [20, 0, 20, 0],
        offScreenPages: 1,
        gap: 8,
      })

      expect(result.paddingTop).toBe(20)
      expect(result.paddingBottom).toBe(20)
      expect(result.paddingLeft).toBe(0)
    })
  })

  describe('horizontal grid with 1000 items - real world scenario', () => {
    it('should have only user padding at last page', () => {
      // Simulate: 1000 items, 3 rows (rowsOnViewport=3), so 334 columns
      // Viewport shows 4 columns at a time (columnsOnViewport=4)
      // itemsPerPage = 3*4 = 12
      // pages = ceil(1000/12) = 84
      // columns must be based on rowsOnViewport for consistency: ceil(1000/3) = 334
      const total = 1000
      const columnsOnViewport = 4
      const rowsOnViewport = 3
      const itemsPerPage = rowsOnViewport * columnsOnViewport
      const pages = Math.ceil(total / itemsPerPage)
      // columns = ceil(total / rowsOnViewport) to be consistent with pages calculation
      const totalColumns = Math.ceil(total / rowsOnViewport)

      const layout: Layout = {
        ...baseLayout,
        horizontal: true,
        total,
        itemsPerColumn: rowsOnViewport,
        columnsOnViewport,
        rowsOnViewport,
        itemsPerPage,
        pages,
        columns: totalColumns,
      }

      const result = computeGrid({
        layout,
        page: pages,
        padding: [20, 20, 20, 20],
        offScreenPages: 1,
        gap: 20,
      })

      // At last page, paddingRight should only be user padding (20)
      expect(result.paddingRight).toBe(20)
    })

    it('should have correct paddingLeft at first page', () => {
      const total = 1000
      const columnsOnViewport = 4
      const rowsOnViewport = 3
      const itemsPerPage = rowsOnViewport * columnsOnViewport
      const pages = Math.ceil(total / itemsPerPage)
      const totalColumns = Math.ceil(total / rowsOnViewport)

      const layout: Layout = {
        ...baseLayout,
        horizontal: true,
        total,
        itemsPerColumn: rowsOnViewport,
        columnsOnViewport,
        rowsOnViewport,
        itemsPerPage,
        pages,
        columns: totalColumns,
      }

      const result = computeGrid({
        layout,
        page: 1,
        padding: [20, 20, 20, 20],
        offScreenPages: 1,
        gap: 20,
      })

      // At first page, paddingLeft should only be user padding (20)
      expect(result.paddingLeft).toBe(20)
    })

    it('should calculate columnsAfter correctly at last page', () => {
      const total = 1000
      const columnsOnViewport = 4
      const rowsOnViewport = 3
      const itemsPerPage = rowsOnViewport * columnsOnViewport
      const pages = Math.ceil(total / itemsPerPage)
      // columns = ceil(total / rowsOnViewport) for consistency
      const totalColumns = Math.ceil(total / rowsOnViewport)

      // At last page:
      // maxBoundary = pages = 84
      // columnsAfter = columns - maxBoundary * columnsOnViewport
      //              = 334 - 84 * 4 = 334 - 336 = -2 -> 0
      const columnsAfter = Math.max(0, totalColumns - pages * columnsOnViewport)
      expect(columnsAfter).toBe(0)
    })

    it('should verify pages * columnsOnViewport >= columns (consistency requirement)', () => {
      // This test verifies the key invariant that prevents excessive paddingRight
      const total = 1000
      const rowsOnViewport = 3
      const columnsOnViewport = 4
      const itemsPerPage = rowsOnViewport * columnsOnViewport
      const pages = Math.ceil(total / itemsPerPage)
      // columns must be calculated as ceil(total / rowsOnViewport)
      const columns = Math.ceil(total / rowsOnViewport)

      // This invariant must hold for padding to work correctly
      expect(pages * columnsOnViewport).toBeGreaterThanOrEqual(columns)
    })
  })

  describe('edge cases and boundary conditions', () => {
    it('should handle zero gap correctly', () => {
      const result = computeGrid({
        ...baseProps,
        gap: 0,
        page: 1,
      })

      expect(result.start).toBe(0)
      expect(result.paddingTop).toBe(baseProps.padding[0])
    })

    it('should handle zero padding correctly', () => {
      const result = computeGrid({
        ...baseProps,
        padding: [0, 0, 0, 0],
        page: 1,
      })

      expect(result.paddingTop).toBe(0)
      expect(result.paddingRight).toBe(0)
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
