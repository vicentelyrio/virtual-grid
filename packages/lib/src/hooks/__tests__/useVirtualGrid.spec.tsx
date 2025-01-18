import { renderHook } from '@testing-library/react'
import { useLayout } from '@hooks/useLayout'
import { usePage } from '@hooks/usePage'
import { useContent } from '@hooks/useContent'
import { useVirtualGrid } from '@hooks/useVirtualGrid'
import { Layout, VirtualGridProps } from '@types'

// Mock all dependent hooks
jest.mock('@hooks/useLayout', () => ({
  useLayout: jest.fn()
}))

jest.mock('@hooks/usePage', () => ({
  usePage: jest.fn()
}))

jest.mock('@hooks/useContent', () => ({
  useContent: jest.fn()
}))

describe('useVirtualGrid', () => {
  // Mock hook returns
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

  const mockLayoutHook = {
    resizing: false,
    layout: mockLayout
  }

  const mockPageHook = {
    page: 1,
    pageRange: [0, 19],
    scrolling: false,
    onScrollTo: jest.fn()
  }

  const mockContentHook = {
    items: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
    styles: {
      grid: {
        padding: '20px',
        display: 'grid'
      },
      scroll: {
        overflow: 'auto',
        height: '100%'
      }
    }
  }

  const mockUseLayout = useLayout as jest.Mock
  const mockUsePage = usePage as jest.Mock
  const mockUseContent = useContent as jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()

    // Setup default mock returns
    mockUseLayout.mockReturnValue(mockLayoutHook)
    mockUsePage.mockReturnValue(mockPageHook)
    mockUseContent.mockReturnValue(mockContentHook)
  })

  const defaultProps: VirtualGridProps<{ id: number; name: string }> = {
    data: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ],
    offScreenPages: 1,
    padding: [20, 20, 20, 20],
    gap: 20,
    horizontal: false
  }

  it('should initialize with default props', () => {
    const { result } = renderHook(() => useVirtualGrid(defaultProps))

    // Verify refs are initialized
    expect(result.current.gridRef).toBeDefined()
    expect(result.current.scrollRef).toBeDefined()

    // Verify hooks are called with correct props
    expect(mockUseLayout).toHaveBeenCalledWith({
      gridElement: null,
      scrollElement: null,
      gap: 20,
      padding: [20, 20, 20, 20],
      total: 2,
      horizontal: false
    })

    expect(mockUsePage).toHaveBeenCalledWith({
      gap: 20,
      scrollElement: null,
      layout: mockLayout,
      horizontal: false,
      padding: [20, 20, 20, 20]
    })

    expect(mockUseContent).toHaveBeenCalledWith({
      data: defaultProps.data,
      layout: mockLayout,
      page: 1,
      padding: [20, 20, 20, 20],
      offScreenPages: 1,
      gap: 20
    })

    // Verify return value structure
    expect(result.current).toEqual({
      ...mockLayout,
      gridRef: expect.any(Object),
      scrollRef: expect.any(Object),
      items: mockContentHook.items,
      styles: mockContentHook.styles,
      page: mockPageHook.page,
      pageRange: mockPageHook.pageRange,
      onScrollTo: mockPageHook.onScrollTo,
      scrolling: mockPageHook.scrolling,
      resizing: mockLayoutHook.resizing,
      mounting: false
    })
  })

  it('should handle empty data', () => {
    const { result } = renderHook(() => useVirtualGrid({ ...defaultProps, data: [] }))

    expect(mockUseLayout).toHaveBeenCalledWith(
      expect.objectContaining({
        total: 0
      })
    )

    expect(result.current.mounting).toBe(false)
  })

  it('should handle undefined data', () => {
    const { result } = renderHook(() => useVirtualGrid({ ...defaultProps, data: undefined as any }))

    expect(mockUseLayout).toHaveBeenCalledWith(
      expect.objectContaining({
        total: 0
      })
    )

    expect(result.current.mounting).toBe(false)
  })

  it('should handle horizontal layout', () => {
    const horizontalLayout: Layout = {
      ...mockLayout,
      horizontal: true
    }

    mockUseLayout.mockReturnValue({
      ...mockLayoutHook,
      layout: horizontalLayout
    })

    const { result } = renderHook(() => useVirtualGrid({
      ...defaultProps,
      horizontal: true
    }))

    expect(mockUseLayout).toHaveBeenCalledWith(
      expect.objectContaining({
        horizontal: true
      })
    )

    expect(mockUsePage).toHaveBeenCalledWith(
      expect.objectContaining({
        horizontal: true
      })
    )

    expect(result.current.horizontal).toBe(true)
  })

  it('should handle mounting state', () => {
    mockUseContent.mockReturnValue({ items: null, styles: null })
    mockUseLayout.mockReturnValue({ resizing: false, layout: null })
    mockUsePage.mockReturnValue({ ...mockPageHook, page: null })

    const { result } = renderHook(() => useVirtualGrid(defaultProps))

    expect(result.current.mounting).toBe(true)
  })

  it('should handle resizing state', () => {
    mockUseLayout.mockReturnValue({
      ...mockLayoutHook,
      resizing: true
    })

    const { result } = renderHook(() => useVirtualGrid(defaultProps))

    expect(result.current.resizing).toBe(true)
  })

  it('should handle scrolling state', () => {
    mockUsePage.mockReturnValue({
      ...mockPageHook,
      scrolling: true
    })

    const { result } = renderHook(() => useVirtualGrid(defaultProps))

    expect(result.current.scrolling).toBe(true)
  })

  it('should handle custom off-screen pages', () => {
    renderHook(() => useVirtualGrid({
      ...defaultProps,
      offScreenPages: 2
    }))

    expect(mockUseContent).toHaveBeenCalledWith(
      expect.objectContaining({
        offScreenPages: 2
      })
    )
  })

  it('should handle custom gap', () => {
    renderHook(() => useVirtualGrid({
      ...defaultProps,
      gap: 30
    }))

    expect(mockUseLayout).toHaveBeenCalledWith(
      expect.objectContaining({
        gap: 30
      })
    )

    expect(mockUsePage).toHaveBeenCalledWith(
      expect.objectContaining({
        gap: 30
      })
    )

    expect(mockUseContent).toHaveBeenCalledWith(
      expect.objectContaining({
        gap: 30
      })
    )
  })

  it('should handle custom padding', () => {
    const customPadding = [30, 30, 30, 30]
    renderHook(() => useVirtualGrid({
      ...defaultProps,
      padding: customPadding
    }))

    expect(mockUseLayout).toHaveBeenCalledWith(
      expect.objectContaining({
        padding: customPadding
      })
    )

    expect(mockUsePage).toHaveBeenCalledWith(
      expect.objectContaining({
        padding: customPadding
      })
    )

    expect(mockUseContent).toHaveBeenCalledWith(
      expect.objectContaining({
        padding: customPadding
      })
    )
  })
})
