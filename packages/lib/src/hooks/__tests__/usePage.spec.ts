import { act, renderHook } from '@testing-library/react'
import { getPage } from '@utils/getPage'
import { usePage, UsePageProps } from '@hooks/usePage'

// Mock utilities
jest.mock('@utils/computeScroll', () => ({
  computeScroll: jest.fn()
}))

jest.mock('@utils/getPage', () => ({
  getPage: jest.fn()
}))

describe('usePage', () => {
  const mockGetPage = getPage as jest.Mock
  let mockScrollElement: HTMLDivElement
  let scrollLeft = 0
  let scrollTop = 0
  let registeredScrollHandler: EventListener | null = null
  let defaultProps: UsePageProps

  beforeEach(() => {
    // Create fresh mock element
    mockScrollElement = document.createElement('div')

    // Set up scroll properties
    Object.defineProperty(mockScrollElement, 'scrollLeft', {
      get: () => scrollLeft,
      set: (value) => { scrollLeft = value }
    })
    Object.defineProperty(mockScrollElement, 'scrollTop', {
      get: () => scrollTop,
      set: (value) => { scrollTop = value }
    })

    // Set up mock methods
    mockScrollElement.scroll = jest.fn()
    mockScrollElement.addEventListener = jest.fn((event, handler) => {
      if (event === 'scroll') {
        registeredScrollHandler = handler as any
      }
    })
    mockScrollElement.removeEventListener = jest.fn()

    // Reset scroll values
    scrollLeft = 0
    scrollTop = 0
    registeredScrollHandler = null

    // Reset all mocks
    jest.resetAllMocks()
    jest.useFakeTimers()

    // Use requestAnimationFrame mock that executes immediately
    window.requestAnimationFrame = jest.fn(cb => {
      cb(performance.now())
      return 1
    })

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

    const storedCallbacks: ((time: number) => void)[] = []

    window.requestAnimationFrame = jest.fn((cb) => {
      storedCallbacks.push(cb)
      return storedCallbacks.length
    })

    // Helper to run stored RAF callbacks
    ;(window as any).runRAFCallbacks = () => {
      storedCallbacks.forEach(cb => cb(performance.now()))
      storedCallbacks.length = 0  // Clear the queue
    }
  })

  it('should handle scroll events correctly', () => {
    mockGetPage.mockClear()
    mockGetPage
      .mockReturnValueOnce({ index: 1, page: 1, pageRange: [0, 19] })
      .mockReturnValueOnce({ index: 25, page: 1, pageRange: [20, 39] })

    const { result } = renderHook(() => usePage(defaultProps))

    // Initial mount
    expect(mockGetPage).toHaveBeenCalledTimes(1)
    expect(result.current.pageRange).toEqual([0, 19])

    // Trigger scroll event
    act(() => {
      scrollTop = 500
      registeredScrollHandler?.(new Event('scroll'))
    })

    // Run RAF callbacks
    act(() => {
      ;(window as any).runRAFCallbacks()
    })

    // Run scroll timeout
    act(() => {
      jest.advanceTimersByTime(150)
    })

    expect(mockGetPage).toHaveBeenCalledTimes(2)
    expect(result.current.scrolling).toBe(false)
    expect(result.current.page).toBe(1)
    expect(result.current.pageRange).toEqual([20, 39])
  })

  it('should handle scroll events with horizontal layout', () => {
    mockGetPage.mockClear()
    mockGetPage
      .mockReturnValueOnce({ index: 1, page: 1, pageRange: [0, 19] })
      .mockReturnValueOnce({ index: 25, page: 1, pageRange: [20, 39] })

    const { result } = renderHook(() => usePage({
      ...defaultProps,
      horizontal: true
    }))

    // Initial mount
    expect(mockGetPage).toHaveBeenCalledTimes(1)
    expect(result.current.pageRange).toEqual([0, 19])

    // Trigger scroll event
    act(() => {
      scrollLeft = 500
      registeredScrollHandler?.(new Event('scroll'))
    })

    // Run RAF callbacks
    act(() => {
      ;(window as any).runRAFCallbacks()
    })

    // Run scroll timeout
    act(() => {
      jest.advanceTimersByTime(150)
    })

    expect(mockGetPage).toHaveBeenCalledTimes(2)
    expect(result.current.scrolling).toBe(false)
    expect(result.current.page).toBe(1)
    expect(result.current.pageRange).toEqual([20, 39])
  })

  it('should cleanup resources on unmount', () => {
    const { unmount } = renderHook(() => usePage(defaultProps))

    // Store the handler after mount
    const removeEventListenerMock = mockScrollElement.removeEventListener as jest.Mock

    unmount()

    // Check if removeEventListener was called with any function
    expect(removeEventListenerMock).toHaveBeenCalled()
    const calls = removeEventListenerMock.mock.calls
    expect(calls[0][0]).toBe('scroll') // First argument should be 'scroll'
    expect(typeof calls[0][1]).toBe('function') // Second argument should be a function
  })
})

