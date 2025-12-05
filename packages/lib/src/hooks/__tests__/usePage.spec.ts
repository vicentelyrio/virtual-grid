import { act, renderHook } from '@testing-library/react'
import { getPage } from '@utils/getPage'
import { computeScroll } from '@utils/computeScroll'
import { usePage, UsePageProps } from '@hooks/usePage'

jest.mock('@utils/computeScroll', () => ({
  computeScroll: jest.fn()
}))

jest.mock('@utils/getPage', () => ({
  getPage: jest.fn()
}))

const mockComputeScroll = computeScroll as jest.Mock

describe('usePage', () => {
  const mockGetPage = getPage as jest.Mock
  let mockScrollElement: HTMLDivElement
  let scrollLeft = 0
  let scrollTop = 0
  let defaultProps: UsePageProps

  beforeEach(() => {
    mockScrollElement = document.createElement('div')

    Object.defineProperty(mockScrollElement, 'scrollLeft', {
      get: () => scrollLeft,
      set: (value) => { scrollLeft = value }
    })
    Object.defineProperty(mockScrollElement, 'scrollTop', {
      get: () => scrollTop,
      set: (value) => { scrollTop = value }
    })

    mockScrollElement.scroll = jest.fn()
    mockScrollElement.addEventListener = jest.fn()
    mockScrollElement.removeEventListener = jest.fn()

    scrollLeft = 0
    scrollTop = 0

    jest.resetAllMocks()
    jest.useFakeTimers()

    defaultProps = {
      scrollElement: mockScrollElement,
      layout: {
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
      },
      gap: 10,
      padding: [20, 20, 20, 20],
      horizontal: false
    }

    window.requestAnimationFrame = jest.fn((cb) => {
      cb(performance.now())
      return 1
    })
  })

  it('should register scroll listener and respond to layout changes', () => {
    mockGetPage.mockClear()
    mockGetPage.mockReturnValue({ index: 1, page: 1, pageRange: [0, 19] })

    const { result, rerender } = renderHook(
      (props: UsePageProps) => usePage(props),
      { initialProps: defaultProps }
    )

    // Verify scroll listener was registered
    expect(mockScrollElement.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    )

    // Verify initial page state
    expect(mockGetPage).toHaveBeenCalledTimes(1)
    expect(result.current.page).toBe(1)
    expect(result.current.pageRange).toEqual([0, 19])

    // Verify responds to layout changes
    mockGetPage.mockReturnValue({ index: 2, page: 2, pageRange: [20, 39] })
    const newLayout = { ...defaultProps.layout, pages: 5 }

    rerender({ ...defaultProps, layout: newLayout })

    expect(mockGetPage).toHaveBeenCalledTimes(2)
    expect(result.current.page).toBe(2)
    expect(result.current.pageRange).toEqual([20, 39])
  })

  it('should register scroll listener with horizontal layout', () => {
    mockGetPage.mockClear()
    mockGetPage.mockReturnValue({ index: 1, page: 1, pageRange: [0, 19] })

    const { result, rerender } = renderHook(
      (props: UsePageProps) => usePage(props),
      { initialProps: { ...defaultProps, horizontal: true } }
    )

    // Verify scroll listener was registered
    expect(mockScrollElement.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    )

    // Verify initial page state
    expect(mockGetPage).toHaveBeenCalledTimes(1)
    expect(result.current.page).toBe(1)
    expect(result.current.pageRange).toEqual([0, 19])

    // Verify responds to layout changes
    mockGetPage.mockReturnValue({ index: 2, page: 2, pageRange: [20, 39] })
    const newLayout = { ...defaultProps.layout, pages: 5 }

    rerender({ ...defaultProps, horizontal: true, layout: newLayout })

    expect(mockGetPage).toHaveBeenCalledTimes(2)
    expect(result.current.page).toBe(2)
    expect(result.current.pageRange).toEqual([20, 39])
  })

  it('should cleanup resources on unmount', () => {
    const { unmount } = renderHook(() => usePage(defaultProps))

    const removeEventListenerMock = mockScrollElement.removeEventListener as jest.Mock

    unmount()

    // Check if removeEventListener was called with any function
    expect(removeEventListenerMock).toHaveBeenCalled()
    const calls = removeEventListenerMock.mock.calls
    expect(calls[0][0]).toBe('scroll') // First argument should be 'scroll'
    expect(typeof calls[0][1]).toBe('function') // Second argument should be a function
  })

  describe('onScrollTo with multi-item pages', () => {
    it('should pass rowsOnViewport and columnsOnViewport for vertical scroll', () => {
      mockGetPage.mockReturnValue({ index: 1, page: 1, pageRange: [0, 19] })
      mockComputeScroll.mockReturnValue(200)

      // Layout with multiple items per page:
      // - 2 items per row (itemsPerRow = 2)
      // - 2 rows visible (rowsOnViewport = 2)
      // - itemsPerPage = 2 * 2 = 4
      const multiItemLayout = {
        ...defaultProps.layout,
        itemsPerRow: 2,
        rowsOnViewport: 2,
        columnsOnViewport: 2,
        itemsPerPage: 4,
        itemHeight: 100,
        horizontal: false
      }

      const { result } = renderHook(() => usePage({
        ...defaultProps,
        layout: multiItemLayout,
        horizontal: false
      }))

      act(() => {
        result.current.onScrollTo(2, 'instant')
      })

      expect(mockComputeScroll).toHaveBeenCalledWith({
        index: 2,
        gap: 10,
        rowsOnViewport: 2,
        columnsOnViewport: 2,
        horizontal: false,
        itemSize: 100,
        padding: 20
      })
    })

    it('should pass rowsOnViewport and columnsOnViewport for horizontal scroll', () => {
      mockGetPage.mockReturnValue({ index: 1, page: 1, pageRange: [0, 19] })
      mockComputeScroll.mockReturnValue(300)

      // Layout with multiple items per page in horizontal mode:
      // - 3 items per column (itemsPerColumn = 3)
      // - 2 columns visible (columnsOnViewport = 2)
      // - itemsPerPage = 3 * 2 = 6
      const multiItemLayout = {
        ...defaultProps.layout,
        itemsPerColumn: 3,
        rowsOnViewport: 3,
        columnsOnViewport: 2,
        itemsPerPage: 6,
        itemWidth: 150,
        horizontal: true
      }

      const { result } = renderHook(() => usePage({
        ...defaultProps,
        layout: multiItemLayout,
        horizontal: true
      }))

      act(() => {
        result.current.onScrollTo(2, 'instant')
      })

      expect(mockComputeScroll).toHaveBeenCalledWith({
        index: 2,
        gap: 10,
        rowsOnViewport: 3,
        columnsOnViewport: 2,
        horizontal: true,
        itemSize: 150,
        padding: 20
      })
    })

    it('should handle single item per page correctly', () => {
      mockGetPage.mockReturnValue({ index: 1, page: 1, pageRange: [0, 1] })
      mockComputeScroll.mockReturnValue(100)

      // Layout with single item per page (carousel-like):
      // - 1 item per row
      // - 1 row visible
      // - itemsPerPage = 1
      const singleItemLayout = {
        ...defaultProps.layout,
        itemsPerRow: 1,
        rowsOnViewport: 1,
        columnsOnViewport: 1,
        itemsPerPage: 1,
        itemHeight: 100,
        horizontal: false
      }

      const { result } = renderHook(() => usePage({
        ...defaultProps,
        layout: singleItemLayout,
        horizontal: false
      }))

      act(() => {
        result.current.onScrollTo(3, 'instant')
      })

      expect(mockComputeScroll).toHaveBeenCalledWith({
        index: 3,
        gap: 10,
        rowsOnViewport: 1,
        columnsOnViewport: 1,
        horizontal: false,
        itemSize: 100,
        padding: 20
      })
    })
  })
})

