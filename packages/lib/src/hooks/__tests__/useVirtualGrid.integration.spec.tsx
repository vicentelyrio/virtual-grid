import React, { useEffect, useRef, useCallback } from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { useVirtualGrid } from '@hooks/useVirtualGrid'

const mockResizeObserverCallback = jest.fn()

beforeAll(() => {
  global.ResizeObserver = jest.fn().mockImplementation((callback) => {
    mockResizeObserverCallback.mockImplementation(callback)
    return {
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn()
    }
  })
})

afterEach(() => {
  jest.clearAllMocks()
})

/**
 * Test component that uses useVirtualGrid and exposes results via data attributes
 */
interface TestComponentProps<T> {
  data: T[]
  horizontal?: boolean
  gap?: number
  padding?: number[]
  viewportWidth: number
  viewportHeight: number
  itemWidth: number
  itemHeight: number
  onResult?: (result: ReturnType<typeof useVirtualGrid<T>>) => void
  onScrollCall?: (position: number) => void
}

function TestComponent<T>({
  data,
  horizontal = false,
  gap = 16,
  padding = [0, 0, 0, 0],
  viewportWidth,
  viewportHeight,
  itemWidth,
  itemHeight,
  onResult,
  onScrollCall
}: TestComponentProps<T>) {
  const result = useVirtualGrid({
    data,
    horizontal,
    gap,
    padding,
  })

  const scrollCallRef = useRef(onScrollCall)
  scrollCallRef.current = onScrollCall

  // Store result for test assertions
  useEffect(() => {
    onResult?.(result)
  }, [result, onResult])

  // Mock getBoundingClientRect on the scroll container
  const scrollRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.getBoundingClientRect = () => ({
        width: viewportWidth,
        height: viewportHeight,
        top: 0,
        left: 0,
        right: viewportWidth,
        bottom: viewportHeight,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })

      // Mock scroll method to capture scroll position
      node.scroll = jest.fn((optionsOrX?: ScrollToOptions | number, y?: number) => {
        if (typeof optionsOrX === 'object') {
          const position = horizontal ? optionsOrX.left : optionsOrX.top
          scrollCallRef.current?.(position as number)
        } else if (typeof optionsOrX === 'number') {
          scrollCallRef.current?.(horizontal ? optionsOrX : (y ?? 0))
        }
      }) as typeof node.scroll

      // Assign to the scrollRef returned by useVirtualGrid
      ;(result.scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = node
    }
  }, [viewportWidth, viewportHeight, horizontal, result.scrollRef])

  // Mock getBoundingClientRect on grid items
  const gridRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.getBoundingClientRect = () => ({
        width: viewportWidth,
        height: viewportHeight,
        top: 0,
        left: 0,
        right: viewportWidth,
        bottom: viewportHeight,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })
      // Assign to the ref
      ;(result.gridRef as React.MutableRefObject<HTMLDivElement | null>).current = node
    }
  }, [viewportWidth, viewportHeight, result.gridRef])

  // Mock getBoundingClientRect on items
  const itemRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.getBoundingClientRect = () => ({
        width: itemWidth,
        height: itemHeight,
        top: 0,
        left: 0,
        right: itemWidth,
        bottom: itemHeight,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })
    }
  }, [itemWidth, itemHeight])

  // Navigation handlers
  const handleScrollTo = useCallback((page: number) => {
    result.onScrollTo(page)
  }, [result])

  return (
    <div
      ref={scrollRefCallback}
      data-testid="scroll-container"
      style={{ width: viewportWidth, height: viewportHeight, overflow: 'auto' }}>
      <div
        ref={gridRefCallback}
        data-testid="grid-container"
        style={result.styles}>
        <div ref={itemRefCallback} data-testid="grid-item" style={{ width: itemWidth, height: itemHeight }}>
          Item
        </div>
      </div>
      {/* Expose result values for assertions */}
      <div data-testid="result-pages">{result.pages ?? 'undefined'}</div>
      <div data-testid="result-rows-on-viewport">{result.rowsOnViewport ?? 'undefined'}</div>
      <div data-testid="result-columns-on-viewport">{result.columnsOnViewport ?? 'undefined'}</div>
      <div data-testid="result-items-per-page">{result.itemsPerPage ?? 'undefined'}</div>
      <div data-testid="result-items-per-row">{result.itemsPerRow ?? 'undefined'}</div>
      <div data-testid="result-items-per-column">{result.itemsPerColumn ?? 'undefined'}</div>
      <div data-testid="result-page">{result.page ?? 'undefined'}</div>
      <div data-testid="result-mounting">{result.mounting ? 'true' : 'false'}</div>
      <div data-testid="result-item-height">{result.itemHeight ?? 'undefined'}</div>
      <div data-testid="result-item-width">{result.itemWidth ?? 'undefined'}</div>
      {/* Navigation buttons for testing onScrollTo */}
      <button data-testid="scroll-to-1" onClick={() => handleScrollTo(1)}>Page 1</button>
      <button data-testid="scroll-to-2" onClick={() => handleScrollTo(2)}>Page 2</button>
      <button data-testid="scroll-to-3" onClick={() => handleScrollTo(3)}>Page 3</button>
      <button data-testid="scroll-to-10" onClick={() => handleScrollTo(10)}>Page 10</button>
    </div>
  )
}

describe('useVirtualGrid - Integration Tests', () => {
  const TOTAL_ITEMS = 1000
  const GAP = 16

  const createData = (count: number) => Array(count).fill(0).map((_, i) => ({ id: i }))

  /**
   * Helper to trigger ResizeObserver and wait for layout calculation
   */
  const triggerResize = async (width: number, height: number) => {
    await act(async () => {
      mockResizeObserverCallback([{ contentRect: { width, height } }])
      await new Promise(resolve => setTimeout(resolve, 100))
    })
  }

  describe('Layout calculations', () => {
    describe('Layout A: Single item visible (1×1)', () => {
      const VIEWPORT = 400
      const ITEM_SIZE = 380

      it('A1. Vertical scroll - should calculate 1000 pages', async () => {
        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={false}
            gap={GAP}
            viewportWidth={VIEWPORT}
            viewportHeight={VIEWPORT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
          />
        )

        await triggerResize(VIEWPORT, VIEWPORT)

        await waitFor(() => {
          const pages = screen.getByTestId('result-pages').textContent
          expect(pages).not.toBe('undefined')
        }, { timeout: 2000 })

        expect(screen.getByTestId('result-rows-on-viewport').textContent).toBe('1')
        expect(screen.getByTestId('result-items-per-row').textContent).toBe('1')
        expect(screen.getByTestId('result-items-per-page').textContent).toBe('1')
        expect(screen.getByTestId('result-pages').textContent).toBe('1000')
      })

      it('A2. Horizontal scroll - should calculate 1000 pages', async () => {
        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            viewportWidth={VIEWPORT}
            viewportHeight={VIEWPORT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
          />
        )

        await triggerResize(VIEWPORT, VIEWPORT)

        await waitFor(() => {
          const pages = screen.getByTestId('result-pages').textContent
          expect(pages).not.toBe('undefined')
        }, { timeout: 2000 })

        expect(screen.getByTestId('result-columns-on-viewport').textContent).toBe('1')
        expect(screen.getByTestId('result-items-per-column').textContent).toBe('1')
        expect(screen.getByTestId('result-items-per-page').textContent).toBe('1')
        expect(screen.getByTestId('result-pages').textContent).toBe('1000')
      })
    })

    describe('Layout B: Two items in scroll direction (2×1 or 1×2)', () => {
      const VIEWPORT_SMALL = 400
      const VIEWPORT_LARGE = 800
      const ITEM_SIZE = 380

      it('B1. Vertical scroll (2 rows × 1 col) - should calculate 500 pages', async () => {
        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={false}
            gap={GAP}
            viewportWidth={VIEWPORT_SMALL}
            viewportHeight={VIEWPORT_LARGE}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
          />
        )

        await triggerResize(VIEWPORT_SMALL, VIEWPORT_LARGE)

        await waitFor(() => {
          const pages = screen.getByTestId('result-pages').textContent
          expect(pages).not.toBe('undefined')
        }, { timeout: 2000 })

        expect(screen.getByTestId('result-rows-on-viewport').textContent).toBe('2')
        expect(screen.getByTestId('result-items-per-row').textContent).toBe('1')
        expect(screen.getByTestId('result-items-per-page').textContent).toBe('2')
        expect(screen.getByTestId('result-pages').textContent).toBe('500')
      })

      it('B2. Horizontal scroll (1 row × 2 cols) - should calculate 500 pages', async () => {
        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            viewportWidth={VIEWPORT_LARGE}
            viewportHeight={VIEWPORT_SMALL}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
          />
        )

        await triggerResize(VIEWPORT_LARGE, VIEWPORT_SMALL)

        await waitFor(() => {
          const pages = screen.getByTestId('result-pages').textContent
          expect(pages).not.toBe('undefined')
        }, { timeout: 2000 })

        expect(screen.getByTestId('result-columns-on-viewport').textContent).toBe('2')
        expect(screen.getByTestId('result-items-per-column').textContent).toBe('1')
        expect(screen.getByTestId('result-items-per-page').textContent).toBe('2')
        expect(screen.getByTestId('result-pages').textContent).toBe('500')
      })
    })

    describe('Layout C: 2×2 grid (4 items visible)', () => {
      const VIEWPORT = 800
      const ITEM_SIZE = 380

      it('C1. Vertical scroll - should calculate 250 pages', async () => {
        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={false}
            gap={GAP}
            viewportWidth={VIEWPORT}
            viewportHeight={VIEWPORT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
          />
        )

        await triggerResize(VIEWPORT, VIEWPORT)

        await waitFor(() => {
          const pages = screen.getByTestId('result-pages').textContent
          expect(pages).not.toBe('undefined')
        }, { timeout: 2000 })

        expect(screen.getByTestId('result-rows-on-viewport').textContent).toBe('2')
        expect(screen.getByTestId('result-items-per-row').textContent).toBe('2')
        expect(screen.getByTestId('result-items-per-page').textContent).toBe('4')
        expect(screen.getByTestId('result-pages').textContent).toBe('250')
      })

      it('C2. Horizontal scroll - should calculate 250 pages', async () => {
        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            viewportWidth={VIEWPORT}
            viewportHeight={VIEWPORT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
          />
        )

        await triggerResize(VIEWPORT, VIEWPORT)

        await waitFor(() => {
          const pages = screen.getByTestId('result-pages').textContent
          expect(pages).not.toBe('undefined')
        }, { timeout: 2000 })

        expect(screen.getByTestId('result-columns-on-viewport').textContent).toBe('2')
        expect(screen.getByTestId('result-items-per-column').textContent).toBe('2')
        expect(screen.getByTestId('result-items-per-page').textContent).toBe('4')
        expect(screen.getByTestId('result-pages').textContent).toBe('250')
      })
    })

    describe('Layout D: User carousel dimensions (766×656 viewport, 383×320 items)', () => {
      const VIEWPORT_WIDTH = 766
      const VIEWPORT_HEIGHT = 656
      const ITEM_WIDTH = 383
      const ITEM_HEIGHT = 320

      // Viewport calculations (for paging):
      // - rowsOnViewport = round(656/320) = 2
      // - columnsOnViewport = round(766/383) = 2
      // - itemsPerPage = 2 × 2 = 4
      // - pages = ceil(1000/4) = 250
      //
      // Capacity calculations (for grid sizing):
      // - itemsPerRow = floor((766+16)/(383+16)) = floor(1.96) = 1
      // - itemsPerColumn = floor((656+16)/(320+16)) = floor(2.0) = 2

      it('D1. Vertical scroll - should calculate 250 pages (2×2 visible)', async () => {
        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={false}
            gap={GAP}
            viewportWidth={VIEWPORT_WIDTH}
            viewportHeight={VIEWPORT_HEIGHT}
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
          />
        )

        await triggerResize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT)

        await waitFor(() => {
          const pages = screen.getByTestId('result-pages').textContent
          expect(pages).not.toBe('undefined')
        }, { timeout: 2000 })

        // Viewport-based (for paging)
        expect(screen.getByTestId('result-rows-on-viewport').textContent).toBe('2')
        expect(screen.getByTestId('result-columns-on-viewport').textContent).toBe('2')
        expect(screen.getByTestId('result-items-per-page').textContent).toBe('4')
        expect(screen.getByTestId('result-pages').textContent).toBe('250')
        // Capacity-based (for grid sizing) - can differ from viewport
        expect(screen.getByTestId('result-items-per-row').textContent).toBe('1')
        expect(screen.getByTestId('result-items-per-column').textContent).toBe('2')
      })

      it('D2. Horizontal scroll - should calculate 250 pages (2×2 visible)', async () => {
        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            viewportWidth={VIEWPORT_WIDTH}
            viewportHeight={VIEWPORT_HEIGHT}
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
          />
        )

        await triggerResize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT)

        await waitFor(() => {
          const pages = screen.getByTestId('result-pages').textContent
          expect(pages).not.toBe('undefined')
        }, { timeout: 2000 })

        // Viewport-based (for paging)
        expect(screen.getByTestId('result-columns-on-viewport').textContent).toBe('2')
        expect(screen.getByTestId('result-rows-on-viewport').textContent).toBe('2')
        expect(screen.getByTestId('result-items-per-page').textContent).toBe('4')
        expect(screen.getByTestId('result-pages').textContent).toBe('250')
        // Capacity-based (for grid sizing) - can differ from viewport
        expect(screen.getByTestId('result-items-per-column').textContent).toBe('2')
        expect(screen.getByTestId('result-items-per-row').textContent).toBe('1')
      })
    })

    describe('Layout E: Partial visibility (cropped last column/row)', () => {
      /**
       * Tests for when items are partially visible at the viewport edge.
       * Example: 766px viewport with 275px items shows 2 full columns + ~73% of 3rd column
       *
       * The columnsOnViewport/rowsOnViewport uses Math.round, so:
       * - round(766/275) = round(2.78) = 3 (includes partial column)
       * - This means paging considers the partial item as part of the page
       */

      it('E1. Horizontal: 2 full columns + partial 3rd, 2 rows (3×2 = 6 items/page)', async () => {
        // 766px wide viewport, 275px items, 16px gap
        // 2 full columns: 275 + 16 + 275 = 566px
        // Remaining: 766 - 566 = 200px (shows ~73% of 3rd column)
        // round(766/275) = round(2.78) = 3 columns
        const VIEWPORT_WIDTH = 766
        const VIEWPORT_HEIGHT = 600  // Fits 2 rows: round(600/275) = 2
        const ITEM_SIZE = 275

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            viewportWidth={VIEWPORT_WIDTH}
            viewportHeight={VIEWPORT_HEIGHT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
          />
        )

        await triggerResize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT)

        await waitFor(() => {
          const pages = screen.getByTestId('result-pages').textContent
          expect(pages).not.toBe('undefined')
        }, { timeout: 2000 })

        // round(766/275) = 3 columns (2 full + partial)
        expect(screen.getByTestId('result-columns-on-viewport').textContent).toBe('3')
        // round(600/275) = 2 rows
        expect(screen.getByTestId('result-rows-on-viewport').textContent).toBe('2')
        expect(screen.getByTestId('result-items-per-page').textContent).toBe('6')  // 3 × 2
        expect(screen.getByTestId('result-pages').textContent).toBe('167')  // ceil(1000/6)
      })

      it('E2. Vertical: 2 full rows + partial 3rd, 2 columns (2×3 = 6 items/page)', async () => {
        // Same as E1 but rotated - vertical scroll with partial bottom row
        const VIEWPORT_WIDTH = 600   // Fits 2 columns: round(600/275) = 2
        const VIEWPORT_HEIGHT = 766  // 2 full rows + partial 3rd
        const ITEM_SIZE = 275

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={false}
            gap={GAP}
            viewportWidth={VIEWPORT_WIDTH}
            viewportHeight={VIEWPORT_HEIGHT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
          />
        )

        await triggerResize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT)

        await waitFor(() => {
          const pages = screen.getByTestId('result-pages').textContent
          expect(pages).not.toBe('undefined')
        }, { timeout: 2000 })

        // round(600/275) = 2 columns
        expect(screen.getByTestId('result-columns-on-viewport').textContent).toBe('2')
        // round(766/275) = 3 rows (2 full + partial)
        expect(screen.getByTestId('result-rows-on-viewport').textContent).toBe('3')
        expect(screen.getByTestId('result-items-per-page').textContent).toBe('6')  // 2 × 3
        expect(screen.getByTestId('result-pages').textContent).toBe('167')  // ceil(1000/6)
      })

      it('E3. Horizontal: 3 full columns + small peek of 4th (rounds down)', async () => {
        // Testing edge case where partial is < 50% so rounds down
        // 900px viewport, 275px items
        // 3 full columns: 275*3 + 16*2 = 825 + 32 = 857px
        // Remaining: 900 - 857 = 43px (~16% of item - rounds down)
        // round(900/275) = round(3.27) = 3 columns
        const VIEWPORT_WIDTH = 900
        const VIEWPORT_HEIGHT = 320  // round(320/275) = 1 row
        const ITEM_SIZE = 275

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            viewportWidth={VIEWPORT_WIDTH}
            viewportHeight={VIEWPORT_HEIGHT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
          />
        )

        await triggerResize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT)

        await waitFor(() => {
          const pages = screen.getByTestId('result-pages').textContent
          expect(pages).not.toBe('undefined')
        }, { timeout: 2000 })

        // round(900/275) = 3 columns (small peek doesn't count)
        expect(screen.getByTestId('result-columns-on-viewport').textContent).toBe('3')
        expect(screen.getByTestId('result-rows-on-viewport').textContent).toBe('1')
        expect(screen.getByTestId('result-items-per-page').textContent).toBe('3')  // 3 × 1
        expect(screen.getByTestId('result-pages').textContent).toBe('334')  // ceil(1000/3)
      })

      it('E4. Horizontal: exactly 50% visible rounds up to include', async () => {
        // 412.5px would be 50% of 275px item visible
        // Testing boundary: round(0.5) = 1 in JavaScript
        // Viewport where partial item is ~50%: 275 * 2.5 = 687.5 ≈ 688px
        // round(688/275) = round(2.50) = 3 (rounds to nearest even, but JS rounds up)
        const VIEWPORT_WIDTH = 688
        const VIEWPORT_HEIGHT = 275
        const ITEM_SIZE = 275

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            viewportWidth={VIEWPORT_WIDTH}
            viewportHeight={VIEWPORT_HEIGHT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
          />
        )

        await triggerResize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT)

        await waitFor(() => {
          const pages = screen.getByTestId('result-pages').textContent
          expect(pages).not.toBe('undefined')
        }, { timeout: 2000 })

        // round(688/275) = round(2.50) = 3 (JS rounds 0.5 up)
        expect(screen.getByTestId('result-columns-on-viewport').textContent).toBe('3')
        expect(screen.getByTestId('result-rows-on-viewport').textContent).toBe('1')
        expect(screen.getByTestId('result-items-per-page').textContent).toBe('3')
      })

      it('E5. Carousel-like: wide items with partial next item peeking', async () => {
        // Common carousel pattern: show 1 full item + peek of next
        // 500px viewport, 400px items
        // 1 full item + 100px peek (25% of next item)
        // round(500/400) = round(1.25) = 1 (peek doesn't count as full page item)
        const VIEWPORT_WIDTH = 500
        const VIEWPORT_HEIGHT = 400
        const ITEM_WIDTH = 400
        const ITEM_HEIGHT = 400

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            viewportWidth={VIEWPORT_WIDTH}
            viewportHeight={VIEWPORT_HEIGHT}
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
          />
        )

        await triggerResize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT)

        await waitFor(() => {
          const pages = screen.getByTestId('result-pages').textContent
          expect(pages).not.toBe('undefined')
        }, { timeout: 2000 })

        // Small peek doesn't count: round(500/400) = round(1.25) = 1
        expect(screen.getByTestId('result-columns-on-viewport').textContent).toBe('1')
        expect(screen.getByTestId('result-rows-on-viewport').textContent).toBe('1')
        expect(screen.getByTestId('result-items-per-page').textContent).toBe('1')
        expect(screen.getByTestId('result-pages').textContent).toBe('1000')
      })

      it('E6. Carousel-like: wide items with substantial next item visible', async () => {
        // Carousel showing 1 full item + 60% of next item
        // 640px viewport, 400px items
        // round(640/400) = round(1.6) = 2
        const VIEWPORT_WIDTH = 640
        const VIEWPORT_HEIGHT = 400
        const ITEM_WIDTH = 400
        const ITEM_HEIGHT = 400

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            viewportWidth={VIEWPORT_WIDTH}
            viewportHeight={VIEWPORT_HEIGHT}
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
          />
        )

        await triggerResize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT)

        await waitFor(() => {
          const pages = screen.getByTestId('result-pages').textContent
          expect(pages).not.toBe('undefined')
        }, { timeout: 2000 })

        // Substantial partial counts: round(640/400) = round(1.6) = 2
        expect(screen.getByTestId('result-columns-on-viewport').textContent).toBe('2')
        expect(screen.getByTestId('result-rows-on-viewport').textContent).toBe('1')
        expect(screen.getByTestId('result-items-per-page').textContent).toBe('2')
        expect(screen.getByTestId('result-pages').textContent).toBe('500')
      })
    })

    describe('Symmetry: same layout should give same pages for both scroll directions', () => {
      it('800×800 viewport with 380×380 items should give 250 pages for both', async () => {
        const VIEWPORT = 800
        const ITEM_SIZE = 380

        const { unmount: unmountV } = render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={false}
            gap={GAP}
            viewportWidth={VIEWPORT}
            viewportHeight={VIEWPORT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
          />
        )

        await triggerResize(VIEWPORT, VIEWPORT)

        await waitFor(() => {
          expect(screen.getByTestId('result-pages').textContent).not.toBe('undefined')
        }, { timeout: 2000 })

        const verticalPages = screen.getByTestId('result-pages').textContent
        unmountV()

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            viewportWidth={VIEWPORT}
            viewportHeight={VIEWPORT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
          />
        )

        await triggerResize(VIEWPORT, VIEWPORT)

        await waitFor(() => {
          expect(screen.getByTestId('result-pages').textContent).not.toBe('undefined')
        }, { timeout: 2000 })

        const horizontalPages = screen.getByTestId('result-pages').textContent

        expect(verticalPages).toBe('250')
        expect(horizontalPages).toBe('250')
        expect(verticalPages).toBe(horizontalPages)
      })
    })
  })

  describe('Navigation (onScrollTo)', () => {
    /**
     * Scroll position formula:
     * position = padding + (unitsPerPage * (pageIndex - 1) * itemSize) + (unitsPerPage * (pageIndex - 1) * gap)
     *
     * Where unitsPerPage = rowsOnViewport (vertical) or columnsOnViewport (horizontal)
     */

    describe('Single item per page (1×1 grid)', () => {
      const VIEWPORT = 400
      const ITEM_SIZE = 380
      const PADDING = 10

      it('vertical: should scroll to correct position for each page', async () => {
        const scrollPositions: number[] = []

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={false}
            gap={GAP}
            padding={[PADDING, PADDING, PADDING, PADDING]}
            viewportWidth={VIEWPORT}
            viewportHeight={VIEWPORT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
            onScrollCall={(pos) => scrollPositions.push(pos)}
          />
        )

        await triggerResize(VIEWPORT, VIEWPORT)

        await waitFor(() => {
          expect(screen.getByTestId('result-pages').textContent).not.toBe('undefined')
        }, { timeout: 2000 })

        // rowsOnViewport = 1, itemSize = 380, gap = 16, padding = 10
        // Page 1: padding = 10
        // Page 2: 10 + (1 * 1 * 380) + (1 * 1 * 16) = 10 + 380 + 16 = 406
        // Page 3: 10 + (1 * 2 * 380) + (1 * 2 * 16) = 10 + 760 + 32 = 802

        await act(async () => {
          screen.getByTestId('scroll-to-1').click()
        })
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING) // Page 1 = just padding

        await act(async () => {
          screen.getByTestId('scroll-to-2').click()
        })
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING + ITEM_SIZE + GAP) // 406

        await act(async () => {
          screen.getByTestId('scroll-to-3').click()
        })
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING + 2 * (ITEM_SIZE + GAP)) // 802
      })

      it('horizontal: should scroll to correct position for each page', async () => {
        const scrollPositions: number[] = []

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            padding={[PADDING, PADDING, PADDING, PADDING]}
            viewportWidth={VIEWPORT}
            viewportHeight={VIEWPORT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
            onScrollCall={(pos) => scrollPositions.push(pos)}
          />
        )

        await triggerResize(VIEWPORT, VIEWPORT)

        await waitFor(() => {
          expect(screen.getByTestId('result-pages').textContent).not.toBe('undefined')
        }, { timeout: 2000 })

        // columnsOnViewport = 1, same calculation as vertical

        await act(async () => {
          screen.getByTestId('scroll-to-1').click()
        })
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING)

        await act(async () => {
          screen.getByTestId('scroll-to-2').click()
        })
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING + ITEM_SIZE + GAP)

        await act(async () => {
          screen.getByTestId('scroll-to-3').click()
        })
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING + 2 * (ITEM_SIZE + GAP))
      })
    })

    describe('Two items per page (2×1 vertical, 1×2 horizontal)', () => {
      const VIEWPORT_SMALL = 400
      const VIEWPORT_LARGE = 800
      const ITEM_SIZE = 380
      const PADDING = 10

      it('vertical (2 rows): should scroll by 2 rows worth per page', async () => {
        const scrollPositions: number[] = []

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={false}
            gap={GAP}
            padding={[PADDING, PADDING, PADDING, PADDING]}
            viewportWidth={VIEWPORT_SMALL}
            viewportHeight={VIEWPORT_LARGE}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
            onScrollCall={(pos) => scrollPositions.push(pos)}
          />
        )

        await triggerResize(VIEWPORT_SMALL, VIEWPORT_LARGE)

        await waitFor(() => {
          expect(screen.getByTestId('result-rows-on-viewport').textContent).toBe('2')
        }, { timeout: 2000 })

        // rowsOnViewport = 2, itemSize = 380, gap = 16, padding = 10
        // Page 1: padding = 10
        // Page 2: 10 + (2 * 1 * 380) + (2 * 1 * 16) = 10 + 760 + 32 = 802
        // Page 3: 10 + (2 * 2 * 380) + (2 * 2 * 16) = 10 + 1520 + 64 = 1594

        await act(async () => {
          screen.getByTestId('scroll-to-1').click()
        })
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING)

        await act(async () => {
          screen.getByTestId('scroll-to-2').click()
        })
        // 2 rows * (itemSize + gap) = 2 * 396 = 792 + padding = 802
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING + 2 * (ITEM_SIZE + GAP))

        await act(async () => {
          screen.getByTestId('scroll-to-3').click()
        })
        // 4 rows * (itemSize + gap) = 4 * 396 = 1584 + padding = 1594
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING + 4 * (ITEM_SIZE + GAP))
      })

      it('horizontal (2 cols): should scroll by 2 columns worth per page', async () => {
        const scrollPositions: number[] = []

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            padding={[PADDING, PADDING, PADDING, PADDING]}
            viewportWidth={VIEWPORT_LARGE}
            viewportHeight={VIEWPORT_SMALL}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
            onScrollCall={(pos) => scrollPositions.push(pos)}
          />
        )

        await triggerResize(VIEWPORT_LARGE, VIEWPORT_SMALL)

        await waitFor(() => {
          expect(screen.getByTestId('result-columns-on-viewport').textContent).toBe('2')
        }, { timeout: 2000 })

        // columnsOnViewport = 2, same calculation as vertical

        await act(async () => {
          screen.getByTestId('scroll-to-1').click()
        })
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING)

        await act(async () => {
          screen.getByTestId('scroll-to-2').click()
        })
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING + 2 * (ITEM_SIZE + GAP))

        await act(async () => {
          screen.getByTestId('scroll-to-3').click()
        })
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING + 4 * (ITEM_SIZE + GAP))
      })
    })

    describe('2×2 grid (4 items per page)', () => {
      const VIEWPORT = 800
      const ITEM_SIZE = 380
      const PADDING = 10

      it('vertical: should scroll by rowsOnViewport (2), not itemsPerPage (4)', async () => {
        const scrollPositions: number[] = []

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={false}
            gap={GAP}
            padding={[PADDING, PADDING, PADDING, PADDING]}
            viewportWidth={VIEWPORT}
            viewportHeight={VIEWPORT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
            onScrollCall={(pos) => scrollPositions.push(pos)}
          />
        )

        await triggerResize(VIEWPORT, VIEWPORT)

        await waitFor(() => {
          expect(screen.getByTestId('result-rows-on-viewport').textContent).toBe('2')
          expect(screen.getByTestId('result-items-per-page').textContent).toBe('4')
        }, { timeout: 2000 })

        // rowsOnViewport = 2 (NOT itemsPerPage = 4)
        // Scroll should move by 2 rows, not 4 items

        await act(async () => {
          screen.getByTestId('scroll-to-2').click()
        })

        // Should scroll by 2 rows worth, not 4 items worth
        const expectedForPage2 = PADDING + 2 * (ITEM_SIZE + GAP) // 802
        expect(scrollPositions[scrollPositions.length - 1]).toBe(expectedForPage2)

        await act(async () => {
          screen.getByTestId('scroll-to-3').click()
        })
        const expectedForPage3 = PADDING + 4 * (ITEM_SIZE + GAP) // 1594
        expect(scrollPositions[scrollPositions.length - 1]).toBe(expectedForPage3)
      })

      it('horizontal: should scroll by columnsOnViewport (2), not itemsPerPage (4)', async () => {
        const scrollPositions: number[] = []

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            padding={[PADDING, PADDING, PADDING, PADDING]}
            viewportWidth={VIEWPORT}
            viewportHeight={VIEWPORT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
            onScrollCall={(pos) => scrollPositions.push(pos)}
          />
        )

        await triggerResize(VIEWPORT, VIEWPORT)

        await waitFor(() => {
          expect(screen.getByTestId('result-columns-on-viewport').textContent).toBe('2')
          expect(screen.getByTestId('result-items-per-page').textContent).toBe('4')
        }, { timeout: 2000 })

        // columnsOnViewport = 2 (NOT itemsPerPage = 4)

        await act(async () => {
          screen.getByTestId('scroll-to-2').click()
        })
        const expectedForPage2 = PADDING + 2 * (ITEM_SIZE + GAP)
        expect(scrollPositions[scrollPositions.length - 1]).toBe(expectedForPage2)

        await act(async () => {
          screen.getByTestId('scroll-to-3').click()
        })
        const expectedForPage3 = PADDING + 4 * (ITEM_SIZE + GAP)
        expect(scrollPositions[scrollPositions.length - 1]).toBe(expectedForPage3)
      })
    })

    describe('User carousel dimensions', () => {
      const VIEWPORT_WIDTH = 766
      const VIEWPORT_HEIGHT = 656
      const ITEM_WIDTH = 383
      const ITEM_HEIGHT = 320
      const PADDING = 0

      it('vertical: navigation should work correctly with 2 rows visible', async () => {
        const scrollPositions: number[] = []

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={false}
            gap={GAP}
            padding={[PADDING, PADDING, PADDING, PADDING]}
            viewportWidth={VIEWPORT_WIDTH}
            viewportHeight={VIEWPORT_HEIGHT}
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
            onScrollCall={(pos) => scrollPositions.push(pos)}
          />
        )

        await triggerResize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT)

        await waitFor(() => {
          expect(screen.getByTestId('result-rows-on-viewport').textContent).toBe('2')
        }, { timeout: 2000 })

        // rowsOnViewport = 2, itemHeight = 320, gap = 16

        await act(async () => {
          screen.getByTestId('scroll-to-1').click()
        })
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING)

        await act(async () => {
          screen.getByTestId('scroll-to-2').click()
        })
        // 2 rows * (320 + 16) = 672
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING + 2 * (ITEM_HEIGHT + GAP))

        await act(async () => {
          screen.getByTestId('scroll-to-10').click()
        })
        // 18 rows * (320 + 16) = 6048
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING + 18 * (ITEM_HEIGHT + GAP))
      })

      it('horizontal: navigation should work correctly with 2 columns visible', async () => {
        const scrollPositions: number[] = []

        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            padding={[PADDING, PADDING, PADDING, PADDING]}
            viewportWidth={VIEWPORT_WIDTH}
            viewportHeight={VIEWPORT_HEIGHT}
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
            onScrollCall={(pos) => scrollPositions.push(pos)}
          />
        )

        await triggerResize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT)

        await waitFor(() => {
          expect(screen.getByTestId('result-columns-on-viewport').textContent).toBe('2')
        }, { timeout: 2000 })

        // columnsOnViewport = 2, itemWidth = 383, gap = 16

        await act(async () => {
          screen.getByTestId('scroll-to-1').click()
        })
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING)

        await act(async () => {
          screen.getByTestId('scroll-to-2').click()
        })
        // 2 cols * (383 + 16) = 798
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING + 2 * (ITEM_WIDTH + GAP))

        await act(async () => {
          screen.getByTestId('scroll-to-10').click()
        })
        // 18 cols * (383 + 16) = 7182
        expect(scrollPositions[scrollPositions.length - 1]).toBe(PADDING + 18 * (ITEM_WIDTH + GAP))
      })
    })

    describe('Navigation symmetry', () => {
      it('same layout should produce same scroll distance for both directions', async () => {
        const VIEWPORT = 800
        const ITEM_SIZE = 380
        const PADDING = 10

        const verticalScrollPositions: number[] = []
        const horizontalScrollPositions: number[] = []

        // Vertical
        const { unmount } = render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={false}
            gap={GAP}
            padding={[PADDING, PADDING, PADDING, PADDING]}
            viewportWidth={VIEWPORT}
            viewportHeight={VIEWPORT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
            onScrollCall={(pos) => verticalScrollPositions.push(pos)}
          />
        )

        await triggerResize(VIEWPORT, VIEWPORT)
        await waitFor(() => {
          expect(screen.getByTestId('result-pages').textContent).not.toBe('undefined')
        }, { timeout: 2000 })

        await act(async () => {
          screen.getByTestId('scroll-to-2').click()
        })
        await act(async () => {
          screen.getByTestId('scroll-to-3').click()
        })

        unmount()

        // Horizontal
        render(
          <TestComponent
            data={createData(TOTAL_ITEMS)}
            horizontal={true}
            gap={GAP}
            padding={[PADDING, PADDING, PADDING, PADDING]}
            viewportWidth={VIEWPORT}
            viewportHeight={VIEWPORT}
            itemWidth={ITEM_SIZE}
            itemHeight={ITEM_SIZE}
            onScrollCall={(pos) => horizontalScrollPositions.push(pos)}
          />
        )

        await triggerResize(VIEWPORT, VIEWPORT)
        await waitFor(() => {
          expect(screen.getByTestId('result-pages').textContent).not.toBe('undefined')
        }, { timeout: 2000 })

        await act(async () => {
          screen.getByTestId('scroll-to-2').click()
        })
        await act(async () => {
          screen.getByTestId('scroll-to-3').click()
        })

        // Same viewport and item sizes should produce same scroll positions
        expect(verticalScrollPositions).toEqual(horizontalScrollPositions)
      })
    })
  })
})
