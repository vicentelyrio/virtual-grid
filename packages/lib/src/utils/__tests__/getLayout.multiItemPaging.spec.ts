import { getLayout } from '@utils/getLayout'
import { getRect } from '@utils/getRect'
import { calculateGridSize } from '@utils/calculateGridSize'

jest.mock('@utils/getRect')
jest.mock('@utils/calculateGridSize')

/**
 * Multi-item paging scenarios test
 *
 * These tests verify that the page count is calculated correctly
 * when multiple items are visible in the viewport.
 *
 * Key formulas:
 * - rowsOnViewport: Math.round(bounds.height / itemHeight)
 * - columnsOnViewport: Math.round(bounds.width / itemWidth)
 * - itemsPerRow: Math.floor(width / (itemWidth + gap))
 * - itemsPerColumn: Math.floor(height / (itemHeight + gap))
 *
 * For vertical scrolling:
 *   itemsPerPage = rowsOnViewport * itemsPerRow
 *
 * For horizontal scrolling:
 *   itemsPerPage = columnsOnViewport * itemsPerColumn
 */
describe('getLayout - Multi-item paging scenarios', () => {
  const mockGetRect = getRect as jest.Mock
  const mockCalculateGridSize = calculateGridSize as jest.Mock

  const TOTAL_ITEMS = 1000
  const ITEM_SIZE = 380
  const GAP = 16

  const createMockGridElement = () => {
    const gridElement = document.createElement('div')
    const childElement = document.createElement('div')
    gridElement.appendChild(childElement)
    return gridElement
  }

  const setupMocks = (
    viewportWidth: number,
    viewportHeight: number,
    itemWidth: number = ITEM_SIZE,
    itemHeight: number = ITEM_SIZE,
    gridWidth?: number,
    gridHeight?: number
  ) => {
    mockGetRect
      .mockImplementationOnce(() => ({ width: viewportWidth, height: viewportHeight })) // scrollElement
      .mockImplementationOnce(() => ({ width: itemWidth, height: itemHeight })) // firstItem

    mockCalculateGridSize.mockReturnValue({
      width: gridWidth ?? viewportWidth,
      height: gridHeight ?? viewportHeight * 10 // Simulate scrollable content
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe.only('Layout A: Single item visible (1×1)', () => {
    const VIEWPORT = 400

    it.only('A1. Vertical scroll - should calculate 1 item per page, 1000 pages', () => {
      setupMocks(VIEWPORT, VIEWPORT, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: VIEWPORT, height: VIEWPORT },
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: false
      })

      // round(400/380) = round(1.05) = 1
      expect(result.rowsOnViewport).toBe(1)
      // floor(400/396) = floor(1.01) = 1
      expect(result.itemsPerRow).toBe(1)
      // 1 * 1 = 1
      expect(result.itemsPerPage).toBe(1)
      // 1000 / 1 = 1000
      expect(result.pages).toBe(1000)
    })

    it('A2. Horizontal scroll - should calculate 1 item per page, 1000 pages', () => {
      setupMocks(VIEWPORT, VIEWPORT, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: VIEWPORT, height: VIEWPORT },
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: true
      })

      // round(400/380) = round(1.05) = 1
      expect(result.columnsOnViewport).toBe(1)
      // floor(400/396) = floor(1.01) = 1
      expect(result.itemsPerColumn).toBe(1)
      // 1 * 1 = 1
      expect(result.itemsPerPage).toBe(1)
      // 1000 / 1 = 1000
      expect(result.pages).toBe(1000)
    })
  })

  describe('Layout B: Two items in scroll direction (2×1 or 1×2)', () => {
    const VIEWPORT_SMALL = 400
    const VIEWPORT_LARGE = 800

    it('B1. Vertical scroll (2 rows × 1 col) - should calculate 2 items per page, 500 pages', () => {
      setupMocks(VIEWPORT_SMALL, VIEWPORT_LARGE, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: VIEWPORT_SMALL, height: VIEWPORT_LARGE },
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: false
      })

      // round(800/380) = round(2.1) = 2
      expect(result.rowsOnViewport).toBe(2)
      // floor(400/396) = floor(1.01) = 1
      expect(result.itemsPerRow).toBe(1)
      // 2 * 1 = 2
      expect(result.itemsPerPage).toBe(2)
      // 1000 / 2 = 500
      expect(result.pages).toBe(500)
    })

    it('B2. Horizontal scroll (1 row × 2 cols) - should calculate 2 items per page, 500 pages', () => {
      setupMocks(VIEWPORT_LARGE, VIEWPORT_SMALL, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: VIEWPORT_LARGE, height: VIEWPORT_SMALL },
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: true
      })

      // round(800/380) = round(2.1) = 2
      expect(result.columnsOnViewport).toBe(2)
      // floor(400/396) = floor(1.01) = 1
      expect(result.itemsPerColumn).toBe(1)
      // 2 * 1 = 2
      expect(result.itemsPerPage).toBe(2)
      // 1000 / 2 = 500
      expect(result.pages).toBe(500)
    })
  })

  describe('Layout C: 2×2 grid (4 items visible)', () => {
    const VIEWPORT = 800

    it('C1. Vertical scroll - should calculate 4 items per page, 250 pages', () => {
      setupMocks(VIEWPORT, VIEWPORT, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: VIEWPORT, height: VIEWPORT },
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: false
      })

      // round(800/380) = round(2.1) = 2
      expect(result.rowsOnViewport).toBe(2)
      // floor(800/396) = floor(2.02) = 2
      expect(result.itemsPerRow).toBe(2)
      // 2 * 2 = 4
      expect(result.itemsPerPage).toBe(4)
      // 1000 / 4 = 250
      expect(result.pages).toBe(250)
    })

    it('C2. Horizontal scroll - should calculate 4 items per page, 250 pages', () => {
      setupMocks(VIEWPORT, VIEWPORT, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: VIEWPORT, height: VIEWPORT },
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: true
      })

      // round(800/380) = round(2.1) = 2
      expect(result.columnsOnViewport).toBe(2)
      // floor(800/396) = floor(2.02) = 2
      expect(result.itemsPerColumn).toBe(2)
      // 2 * 2 = 4
      expect(result.itemsPerPage).toBe(4)
      // 1000 / 4 = 250
      expect(result.pages).toBe(250)
    })
  })

  describe('Layout D: 3×2 grid (6 items visible)', () => {
    const VIEWPORT_WIDE = 1200
    const VIEWPORT_TALL = 800

    it('D1. Vertical scroll - should calculate 6 items per page, 167 pages', () => {
      setupMocks(VIEWPORT_WIDE, VIEWPORT_TALL, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: VIEWPORT_WIDE, height: VIEWPORT_TALL },
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: false
      })

      // round(800/380) = round(2.1) = 2
      expect(result.rowsOnViewport).toBe(2)
      // floor(1200/396) = floor(3.03) = 3
      expect(result.itemsPerRow).toBe(3)
      // 2 * 3 = 6
      expect(result.itemsPerPage).toBe(6)
      // ceil(1000 / 6) = 167
      expect(result.pages).toBe(167)
    })

    it('D2. Horizontal scroll - should calculate 6 items per page, 167 pages', () => {
      setupMocks(VIEWPORT_WIDE, VIEWPORT_TALL, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: VIEWPORT_WIDE, height: VIEWPORT_TALL },
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: true
      })

      // round(1200/380) = round(3.16) = 3
      expect(result.columnsOnViewport).toBe(3)
      // floor(800/396) = floor(2.02) = 2
      expect(result.itemsPerColumn).toBe(2)
      // 3 * 2 = 6
      expect(result.itemsPerPage).toBe(6)
      // ceil(1000 / 6) = 167
      expect(result.pages).toBe(167)
    })
  })

  describe('Diagnostic: Items FULLY visible (no overlap)', () => {
    /**
     * When 2 items are FULLY visible with gap between them:
     * - Required height = 2 × itemHeight + 1 × gap
     * - For itemHeight=380, gap=16: height = 760 + 16 = 776px
     * - Ratio = 776 / 380 = 2.04
     * - Math.round(2.04) = 2 ✓
     */
    it('Vertical: 2 items FULLY visible should give rowsOnViewport=2', () => {
      // Viewport exactly fits 2 items + 1 gap
      const viewportHeight = 2 * ITEM_SIZE + GAP // 776px
      setupMocks(400, viewportHeight, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: 400, height: viewportHeight },
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: false
      })

      console.log(`2 items fully visible: viewport=${viewportHeight}, item=${ITEM_SIZE}, gap=${GAP}`)
      console.log(`  ratio=${viewportHeight/ITEM_SIZE}, rowsOnViewport=${result.rowsOnViewport}, pages=${result.pages}`)

      expect(result.rowsOnViewport).toBe(2)
      expect(result.pages).toBe(500)
    })

    it('Horizontal: 2 items FULLY visible should give columnsOnViewport=2', () => {
      // Viewport exactly fits 2 items + 1 gap
      const viewportWidth = 2 * ITEM_SIZE + GAP // 776px
      setupMocks(viewportWidth, 400, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: viewportWidth, height: 400 },
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: true
      })

      console.log(`2 items fully visible (horizontal): viewport=${viewportWidth}, item=${ITEM_SIZE}, gap=${GAP}`)
      console.log(`  ratio=${viewportWidth/ITEM_SIZE}, columnsOnViewport=${result.columnsOnViewport}, pages=${result.pages}`)

      expect(result.columnsOnViewport).toBe(2)
      expect(result.pages).toBe(500)
    })

    /**
     * What if bounds is smaller than actual visible area?
     * This could happen if bounds is calculated incorrectly.
     */
    it('BUG SIMULATION: What if bounds.height is wrong?', () => {
      // Simulating: items visually show 2, but bounds reports smaller
      const actualVisibleHeight = 2 * ITEM_SIZE + GAP // 776px - what we SEE
      const reportedBoundsHeight = ITEM_SIZE + GAP // 396px - what bounds reports (BUG!)

      setupMocks(400, actualVisibleHeight, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: 400, height: reportedBoundsHeight }, // Using wrong bounds!
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: false
      })

      console.log(`BUG SIMULATION: actualVisible=${actualVisibleHeight}, reportedBounds=${reportedBoundsHeight}`)
      console.log(`  ratio=${reportedBoundsHeight/ITEM_SIZE}, rowsOnViewport=${result.rowsOnViewport}, pages=${result.pages}`)

      // This would give rowsOnViewport=1 even though 2 items are visible!
      expect(result.rowsOnViewport).toBe(1)
      expect(result.pages).toBe(1000)
    })
  })

  describe('Edge cases: Items nearly fill viewport', () => {
    it('Should count 2 rows when viewport/itemHeight = 1.6 (rounds to 2)', () => {
      // 608 / 380 = 1.6 → rounds to 2
      const viewportHeight = 608
      setupMocks(400, viewportHeight, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: 400, height: viewportHeight },
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: false
      })

      expect(result.rowsOnViewport).toBe(2)
      expect(result.itemsPerPage).toBe(2)
      expect(result.pages).toBe(500)
    })

    it('Should count 1 row when viewport/itemHeight = 1.4 (rounds to 1)', () => {
      // 532 / 380 = 1.4 → rounds to 1
      const viewportHeight = 532
      setupMocks(400, viewportHeight, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: 400, height: viewportHeight },
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: false
      })

      expect(result.rowsOnViewport).toBe(1)
      expect(result.itemsPerPage).toBe(1)
      expect(result.pages).toBe(1000)
    })

    it('Should count 2 columns when viewport/itemWidth = 1.6 (rounds to 2)', () => {
      // 608 / 380 = 1.6 → rounds to 2
      const viewportWidth = 608
      setupMocks(viewportWidth, 400, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: viewportWidth, height: 400 },
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: true
      })

      expect(result.columnsOnViewport).toBe(2)
      expect(result.itemsPerPage).toBe(2)
      expect(result.pages).toBe(500)
    })

    it('Should count 1 column when viewport/itemWidth = 1.4 (rounds to 1)', () => {
      // 532 / 380 = 1.4 → rounds to 1
      const viewportWidth = 532
      setupMocks(viewportWidth, 400, ITEM_SIZE, ITEM_SIZE)

      const result = getLayout({
        gridElement: createMockGridElement(),
        scrollElement: document.createElement('div'),
        total: TOTAL_ITEMS,
        bounds: { width: viewportWidth, height: 400 },
        gap: GAP,
        padding: [0, 0, 0, 0],
        horizontal: true
      })

      expect(result.columnsOnViewport).toBe(1)
      expect(result.itemsPerPage).toBe(1)
      expect(result.pages).toBe(1000)
    })
  })
})

