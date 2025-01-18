import { renderHook, act } from '@testing-library/react'
import { computeScroll } from '@utils/computeScroll'
import { GetPageReturnType, getPage } from '@utils/getPage'
import { usePage } from '@hooks/usePage'
import { Layout } from '@types'

// Mock utilities
jest.mock('@utils/computeScroll', () => ({
  computeScroll: jest.fn()
}))

jest.mock('@utils/getPage', () => ({
  getPage: jest.fn()
}))

describe('usePage', () => {
  const mockComputeScroll = computeScroll as jest.Mock
  const mockGetPage = getPage as jest.Mock

  // Create DOM elements
  let mockScrollElement: HTMLDivElement
  let scrollLeft = 0
  let scrollTop = 0
  let registeredScrollHandler: EventListener | null = null

  const createMockElement = () => {
    const element = document.createElement('div')
    
    Object.defineProperty(element, 'scrollLeft', {
      configurable: true,
      get: () => scrollLeft,
      set: (value) => { scrollLeft = value }
    })

    Object.defineProperty(element, 'scrollTop', {
      configurable: true,
      get: () => scrollTop,
      set: (value) => { scrollTop = value }
    })

    element.scroll = jest.fn()
    element.addEventListener = jest.fn((event, handler) => {
      if (event === 'scroll' && typeof handler === 'function') {
        registeredScrollHandler = handler
      }
    })

    element.removeEventListener = jest.fn((event, handler) => {
      if (event === 'scroll' && handler === registeredScrollHandler) {
        registeredScrollHandler = null
      }
    })

    return element
  }

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

  beforeEach(() => {
    mockScrollElement = createMockElement()
    jest.resetAllMocks()
    jest.useFakeTimers()
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => setTimeout(cb, 0))
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => clearTimeout(id))
    scrollLeft = 0
    scrollTop = 0
    registeredScrollHandler = null
  })

  const defaultProps = {
    scrollElement: mockScrollElement,
    layout: mockLayout,
    gap: 10,
    padding: [20, 20, 20, 20],
    horizontal: false
  }

  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('should initialize with default page state', async () => {
    const initialPage: GetPageReturnType = {
      index: 1,
      page: 1,
      pageRange: [0, 0]
    }

    mockGetPage.mockReturnValue(initialPage)

    const { result } = renderHook(() => usePage(defaultProps))
    
    await act(async () => {
      jest.runAllTimers()
    })

    expect(result.current).toEqual({
      ...initialPage,
      scrolling: false,
      onScrollTo: expect.any(Function)
    })
  })

  it('should handle scroll events correctly', async () => {
    const pageSequence = [
      { index: 1, page: 1, pageRange: [0, 19] },
      { index: 2, page: 2, pageRange: [20, 39] }
    ]

    let pageIndex = 0
    mockGetPage.mockImplementation(() => pageSequence[pageIndex++])

    const { result } = renderHook(() => usePage(defaultProps))

    // Initial render
    await act(async () => {
      jest.runAllTimers()
    })

    // Simulate scroll event
    await act(async () => {
      scrollTop = 500
      registeredScrollHandler?.(new Event('scroll'))
      jest.runAllTimers()
    })

    expect(result.current.scrolling).toBe(false)
    expect(result.current.page).toBe(2)
    expect(result.current.pageRange).toEqual([20, 39])
  })

  it('should handle scroll events with horizontal layout', async () => {
    const pageSequence = [
      { index: 1, page: 1, pageRange: [0, 19] },
      { index: 2, page: 2, pageRange: [20, 39] }
    ]

    let pageIndex = 0
    mockGetPage.mockImplementation(() => pageSequence[pageIndex++])

    const { result } = renderHook(() => usePage({
      ...defaultProps,
      horizontal: true
    }))

    // Initial render
    await act(async () => {
      jest.runAllTimers()
    })

    // Simulate scroll event
    await act(async () => {
      scrollLeft = 500
      registeredScrollHandler?.(new Event('scroll'))
      jest.runAllTimers()
    })

    expect(result.current.scrolling).toBe(false)
    expect(result.current.page).toBe(2)
    expect(result.current.pageRange).toEqual([20, 39])
  })

  it('should calculate scroll position correctly', async () => {
    mockGetPage.mockReturnValue({
      index: 1,
      page: 1,
      pageRange: [0, 19]
    })

    mockComputeScroll.mockReturnValue(500)

    const { result } = renderHook(() => usePage(defaultProps))

    await act(async () => {
      jest.runAllTimers()
    })

    // Test scrolling to a specific index
    await act(async () => {
      result.current.onScrollTo(25)
      jest.runAllTimers()
    })

    expect(mockComputeScroll).toHaveBeenCalledWith({
      index: 25,
      gap: 10,
      itemsPerPage: 20,
      itemSize: 100,
      padding: 20
    })

    expect(mockScrollElement.scroll).toHaveBeenCalledWith({
      behavior: 'smooth',
      top: 500,
      left: 0
    })
  })

  it('should calculate scroll position correctly for horizontal layout', async () => {
    mockGetPage.mockReturnValue({
      index: 1,
      page: 1,
      pageRange: [0, 19]
    })

    mockComputeScroll.mockReturnValue(500)

    const { result } = renderHook(() => usePage({
      ...defaultProps,
      horizontal: true
    }))

    await act(async () => {
      jest.runAllTimers()
    })

    // Test scrolling to a specific index
    await act(async () => {
      result.current.onScrollTo(25)
      jest.runAllTimers()
    })

    expect(mockComputeScroll).toHaveBeenCalledWith({
      index: 25,
      gap: 10,
      itemsPerPage: 20,
      itemSize: 250,
      padding: 20
    })

    expect(mockScrollElement.scroll).toHaveBeenCalledWith({
      behavior: 'smooth',
      left: 500,
      top: 0
    })
  })

  it('should update page on layout change', async () => {
    const pageSequence = [
      { index: 1, page: 1, pageRange: [0, 19] },
      { index: 1, page: 1, pageRange: [0, 24] }
    ]

    let pageIndex = 0
    mockGetPage.mockImplementation(() => pageSequence[pageIndex++])

    const { rerender } = renderHook(
      (props) => usePage(props),
      { initialProps: defaultProps }
    )

    // Initial render
    await act(async () => {
      jest.runAllTimers()
    })

    const newLayout = {
      ...mockLayout,
      itemsPerPage: 25
    }

    // Reset mock calls
    mockGetPage.mockClear()

    // Change layout
    await act(async () => {
      rerender({
        ...defaultProps,
        layout: newLayout
      })
      jest.runAllTimers()
    })

    expect(mockGetPage).toHaveBeenCalledWith({
      scrollElement: mockScrollElement,
      layout: newLayout,
      gap: 10
    })
  })

  it('should cleanup resources on unmount', async () => {
    const { unmount } = renderHook(() => usePage(defaultProps))

    await act(async () => {
      jest.runAllTimers()
    })

    unmount()

    expect(mockScrollElement.removeEventListener).toHaveBeenCalledWith('scroll', registeredScrollHandler)
  })

  it('should not update page if scroll delta is small', async () => {
    mockGetPage.mockReturnValue({
      index: 1,
      page: 1,
      pageRange: [0, 19]
    })

    renderHook(() => usePage(defaultProps))

    // Initial render
    await act(async () => {
      jest.runAllTimers()
    })

    // Reset mock calls
    mockGetPage.mockClear()

    // Simulate small scroll change
    await act(async () => {
      scrollTop = 0.5
      registeredScrollHandler?.(new Event('scroll'))
      jest.runAllTimers()
    })

    expect(mockGetPage).not.toHaveBeenCalled()
  })

  it('should handle null scrollElement', async () => {
    mockGetPage.mockReturnValue({
      index: 1,
      page: 1,
      pageRange: [0, 19]
    })

    const { result } = renderHook(() => usePage({
      ...defaultProps,
      scrollElement: null
    }))

    await act(async () => {
      jest.runAllTimers()
    })

    act(() => {
      result.current.onScrollTo(25)
    })

    expect(mockComputeScroll).not.toHaveBeenCalled()
    expect(result.current.scrolling).toBe(false)
  })
})