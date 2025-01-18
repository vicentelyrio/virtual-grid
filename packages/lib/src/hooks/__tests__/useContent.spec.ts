import { renderHook } from '@testing-library/react'
import { useContent } from '@hooks/useContent'
import { computeGrid } from '@utils/computeGrid'
import { Layout } from '@types'

// Mock the computeGrid utility
jest.mock('@utils/computeGrid', () => ({
  computeGrid: jest.fn()
}))

describe('useContent', () => {
  const mockComputeGrid = computeGrid as jest.Mock

  // Reset mock between tests
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Create a mock layout that satisfies the Layout type
  const mockLayout: Layout = {
    scrollWidth: 1000,
    scrollHeight: 2000,
    rows: 20,
    horizontal: false,
    rowsOnViewport: 5,
    columns: 4,
    columnsOnViewport: 3,
    total: 80,
    pages: 4,
    itemsPerRow: 4,
    itemsPerColumn: 5,
    itemsPerPage: 20,
    itemHeight: 100,
    itemWidth: 250,
    gridHeight: 2000,
    gridWidth: 1000
  }

  it('should compute styles and slice data correctly', async () => {
    // Setup mock data
    const data = Array.from({ length: 100 }, (_, i) => ({ id: i }))
    const mockProps = {
      data,
      gap: 10,
      layout: mockLayout,
      page: 0,
      padding: [20, 20, 20, 20],
      offScreenPages: 1
    }

    // Mock computeGrid return value
    mockComputeGrid.mockReturnValue({
      width: mockLayout.gridWidth,
      paddingTop: 20,
      paddingRight: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      start: 0,
      end: 15 // 5 rows * 3 cols
    })

    // Render the hook
    const { result } = renderHook(() => useContent(mockProps))

    // Check if computeGrid was called with correct props
    expect(mockComputeGrid).toHaveBeenCalledWith({
      layout: mockProps.layout,
      page: mockProps.page,
      padding: mockProps.padding,
      offScreenPages: mockProps.offScreenPages,
      gap: mockProps.gap
    })

    // Check styles
    expect(result.current.styles).toEqual({
      width: mockLayout.gridWidth,
      paddingTop: '20px',
      paddingRight: '20px',
      paddingBottom: '20px',
      paddingLeft: '20px',
      gap: '10px'
    })

    // Check sliced data
    expect(result.current.items).toHaveLength(15)
    expect(result.current.items[0]).toEqual({ id: 0 })
    expect(result.current.items[14]).toEqual({ id: 14 })
  })

  it('should handle undefined padding values', async () => {
    const mockProps = {
      data: [],
      gap: 10,
      layout: mockLayout,
      page: 0,
      padding: [],
      offScreenPages: 1
    }

    mockComputeGrid.mockReturnValue({
      width: mockLayout.gridWidth,
      paddingTop: undefined,
      paddingRight: undefined,
      paddingBottom: undefined,
      paddingLeft: undefined,
      start: 0,
      end: 0
    })

    const { result } = renderHook(() => useContent(mockProps))

    expect(result.current.styles).toEqual({
      width: mockLayout.gridWidth,
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      gap: '10px'
    })
  })

  it('should handle invalid start/end values', async () => {
    const data = Array.from({ length: 10 }, (_, i) => ({ id: i }))
    const mockProps = {
      data,
      gap: 10,
      layout: mockLayout,
      page: 0,
      padding: [20, 20, 20, 20],
      offScreenPages: 1
    }

    mockComputeGrid.mockReturnValue({
      width: mockLayout.gridWidth,
      paddingTop: 20,
      paddingRight: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      start: NaN,
      end: NaN
    })

    const { result } = renderHook(() => useContent(mockProps))

    // When start/end are NaN, should return full data array
    expect(result.current.items).toEqual(data)
  })

  it('should memoize results with same inputs', async () => {
    const data = Array.from({ length: 10 }, (_, i) => ({ id: i }))
    const mockProps = {
      data,
      gap: 10,
      layout: mockLayout,
      page: 0,
      padding: [20, 20, 20, 20],
      offScreenPages: 1
    }

    mockComputeGrid.mockReturnValue({
      width: mockLayout.gridWidth,
      paddingTop: 20,
      paddingRight: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      start: 0,
      end: 5
    })

    const { result, rerender } = renderHook(() => useContent(mockProps))
    const firstResult = result.current

    // Rerender with same props
    rerender()

    // Should have same values
    expect(result.current.items).toStrictEqual(firstResult.items)
    expect(result.current.styles).toStrictEqual(firstResult.styles)
    // computeGrid should only be called once - this verifies memoization is working
    expect(mockComputeGrid).toHaveBeenCalledTimes(1)
  })

  it('should recompute when inputs change', async () => {
    const data = Array.from({ length: 10 }, (_, i) => ({ id: i }))
    const initialProps = {
      data,
      gap: 10,
      layout: mockLayout,
      page: 0,
      padding: [20, 20, 20, 20],
      offScreenPages: 1
    }

    mockComputeGrid.mockReturnValue({
      width: mockLayout.gridWidth,
      paddingTop: 20,
      paddingRight: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      start: 0,
      end: 5
    })

    const { result, rerender } = renderHook(
      (props) => useContent(props),
      { initialProps }
    )
    const firstResult = result.current

    // Rerender with different page
    rerender({
      ...initialProps,
      page: 1
    })

    // Should return new object instance
    expect(result.current).not.toBe(firstResult)
    // computeGrid should be called twice
    expect(mockComputeGrid).toHaveBeenCalledTimes(2)
  })
})
