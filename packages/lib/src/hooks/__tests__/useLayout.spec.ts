import { renderHook, act } from '@testing-library/react'
import { getBounds } from '@utils/getBounds'
import { getLayout } from '@utils/getLayout'
import { useLayout } from '@hooks/useLayout'

// Mock utilities
jest.mock('@utils/getBounds', () => ({
  getBounds: jest.fn()
}))

jest.mock('@utils/getLayout', () => ({
  getLayout: jest.fn()
}))

describe('useLayout', () => {
  const mockGetBounds = getBounds as jest.Mock
  const mockGetLayout = getLayout as jest.Mock

  // Create DOM elements
  const mockGridElement = document.createElement('div')
  const mockScrollElement = document.createElement('div')

  const defaultProps = {
    gridElement: mockGridElement,
    scrollElement: mockScrollElement,
    gap: 10,
    padding: [20, 20, 20, 20],
    total: 100,
    horizontal: false
  }

  const mockLayout = {
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

  let resizeCallback: ResizeObserverCallback
  let mockDisconnect: jest.Mock
  let mockObserve: jest.Mock
  let mockUnobserve: jest.Mock

  beforeAll(() => {
    mockDisconnect = jest.fn()
    mockObserve = jest.fn()
    mockUnobserve = jest.fn()

    class MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback
        this.observe = mockObserve
        this.disconnect = mockDisconnect
        this.unobserve = mockUnobserve
      }
      observe = mockObserve
      disconnect = mockDisconnect
      unobserve = mockUnobserve
    }

    // @ts-ignore
    window.ResizeObserver = MockResizeObserver
  })

  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => setTimeout(cb, 0))
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => clearTimeout(id))
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  const createMockResizeObserverEntry = (target: Element): ResizeObserverEntry => ({
    target,
    contentRect: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      top: 0,
      right: 100,
      bottom: 100,
      left: 0,
      toJSON: () => ({})
    },
    borderBoxSize: [{ blockSize: 100, inlineSize: 100 }],
    contentBoxSize: [{ blockSize: 100, inlineSize: 100 }],
    devicePixelContentBoxSize: [{ blockSize: 100, inlineSize: 100 }]
  })

  it('should initialize with empty layout and not resizing', async () => {
    mockGetBounds.mockReturnValue({
      width: 1000,
      height: 800,
      top: 0,
      left: 0
    })

    mockGetLayout.mockReturnValue(mockLayout)

    const { result } = renderHook(() => useLayout(defaultProps))
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.resizing).toBe(false)
    expect(result.current.layout).toStrictEqual(mockLayout)
  })

  it('should setup resize observer and calculate initial layout', async () => {
    mockGetBounds.mockReturnValue({
      width: 1000,
      height: 800,
      top: 0,
      left: 0
    })

    mockGetLayout.mockReturnValue(mockLayout)

    renderHook(() => useLayout(defaultProps))
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Should set up resize observer
    expect(mockObserve).toHaveBeenCalledWith(mockScrollElement)

    // Should calculate initial layout
    expect(mockGetBounds).toHaveBeenCalledWith({
      scrollElement: mockScrollElement,
      gridElement: mockGridElement
    })
    expect(mockGetLayout).toHaveBeenCalledWith({
      gridElement: mockGridElement,
      scrollElement: mockScrollElement,
      horizontal: false,
      gap: 10,
      padding: [20, 20, 20, 20],
      bounds: {
        width: 1000,
        height: 800,
        top: 0,
        left: 0
      },
      total: 100
    })
  })

  it('should not setup resize observer if elements are null', () => {
    const { result } = renderHook(() => useLayout({
      ...defaultProps,
      gridElement: null,
      scrollElement: null
    }))

    expect(mockObserve).not.toHaveBeenCalled()
    expect(mockGetBounds).not.toHaveBeenCalled()
    expect(mockGetLayout).not.toHaveBeenCalled()
    expect(result.current.layout).toStrictEqual({})
  })

  it('should cleanup resize observer and RAF on unmount', async () => {
    const { unmount } = renderHook(() => useLayout(defaultProps))
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    unmount()
    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('should update layout when dependencies change', async () => {
    mockGetBounds.mockReturnValue({
      width: 1000,
      height: 800,
      top: 0,
      left: 0
    })

    mockGetLayout.mockReturnValue(mockLayout)

    const { rerender } = renderHook(
      (props) => useLayout(props),
      { initialProps: defaultProps }
    )

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    mockGetLayout.mockClear()

    // Change a dependency
    await act(async () => {
      rerender({
        ...defaultProps,
        gap: 20
      })
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockGetLayout).toHaveBeenCalled()
  })

  it('should handle resize events with RAF', async () => {
    const { result } = renderHook(() => useLayout(defaultProps))

    // Wait for initial setup
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    mockGetLayout.mockReturnValue(mockLayout)
    mockGetBounds.mockReturnValue({
      width: 1000,
      height: 800,
      top: 0,
      left: 0
    })

    // Trigger resize event
    act(() => {
      const entry = createMockResizeObserverEntry(mockScrollElement)
      resizeCallback([entry], {} as ResizeObserver)
    })

    // Should be resizing after callback
    expect(result.current.resizing).toBe(true)

    // Wait for RAF to execute
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Should have calculated new layout and set resizing false
    expect(mockGetLayout).toHaveBeenCalled()
    expect(result.current.resizing).toBe(false)
  })

  it('should not update layout if new layout is equal to current', async () => {
    // Setup initial mocks
    mockGetBounds.mockReturnValue({
      width: 1000,
      height: 800,
      top: 0,
      left: 0
    })

    const sameLayout = { ...mockLayout }
    mockGetLayout.mockReturnValue(sameLayout)

    const { result } = renderHook(() => useLayout(defaultProps))

    // Wait for initial setup
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Store the initial layout call count
    const initialCallCount = mockGetLayout.mock.calls.length

    // Trigger resize event with same layout
    await act(async () => {
      const entry = createMockResizeObserverEntry(mockScrollElement)
      resizeCallback([entry], {} as ResizeObserver)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // The layout shouldn't have been updated since it's the same
    expect(mockGetLayout.mock.calls.length).toBe(initialCallCount + 1)
    expect(result.current.layout).toEqual(sameLayout)
  })
})
