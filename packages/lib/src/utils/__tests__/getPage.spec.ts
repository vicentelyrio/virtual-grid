import type { Layout } from '@types'

import { getPage } from '@utils/getPage'
import { getScrollProps } from '@utils/getScrollProps'
import { getPageSizes } from '@utils/getPageSizes'

// Mock dependencies
jest.mock('@utils/getScrollProps')
jest.mock('@utils/getPageSizes')

describe('getPage', () => {
  const mockGetScrollProps = getScrollProps as jest.Mock
  const mockGetPageSizes = getPageSizes as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    // Default mock implementations
    mockGetScrollProps.mockReturnValue({
      scrollTop: 0,
      scrollLeft: 0
    })

    mockGetPageSizes.mockReturnValue({
      index: 0,
      page: 0,
      pageRange: [0, 0]
    })
  })

  it('should handle null scrollElement', () => {
    const result = getPage({
      scrollElement: null,
      layout: {} as Layout,
      gap: 10
    })

    expect(result).toEqual({
      index: 0,
      page: 0,
      pageRange: [0, 0]
    })
  })

  it('should handle null layout', () => {
    const result = getPage({
      scrollElement: document.createElement('div'),
      layout: null as any,
      gap: 10
    })

    expect(result).toEqual({})
  })

  it('should calculate vertical page correctly', () => {
    mockGetScrollProps.mockReturnValue({
      scrollTop: 500,
      scrollLeft: 0
    })

    mockGetPageSizes.mockReturnValue({
      index: 2,
      page: 1,
      pageRange: [2, 4]
    })

    const layout: Layout = {
      itemHeight: 200,
      itemWidth: 150,
      rowsOnViewport: 4,
      columnsOnViewport: 3,
      horizontal: false,
      scrollWidth: 800,
      scrollHeight: 1000,
      rows: 10,
      columns: 3,
      total: 30,
      pages: 3,
      itemsPerRow: 3,
      itemsPerColumn: 4,
      itemsPerPage: 12,
      gridHeight: 2200,
      gridWidth: 800
    }

    const result = getPage({
      scrollElement: document.createElement('div'),
      layout,
      gap: 10
    })

    expect(mockGetPageSizes).toHaveBeenCalledWith({
      screenStart: 500,
      itemSize: 200,
      scrollSize: 1000,
      itemsOnPage: 4,
      gap: 10
    })

    expect(result).toEqual({
      index: 2,
      page: 1,
      pageRange: [2, 4]
    })
  })

  it('should calculate horizontal page correctly', () => {
    mockGetScrollProps.mockReturnValue({
      scrollTop: 0,
      scrollLeft: 300
    })

    mockGetPageSizes.mockReturnValue({
      index: 1,
      page: 1,
      pageRange: [1, 3]
    })

    const layout: Layout = {
      itemHeight: 200,
      itemWidth: 150,
      rowsOnViewport: 4,
      columnsOnViewport: 3,
      horizontal: true,
      scrollWidth: 800,
      scrollHeight: 1000,
      rows: 4,
      columns: 8,
      total: 32,
      pages: 3,
      itemsPerRow: 8,
      itemsPerColumn: 4,
      itemsPerPage: 12,
      gridHeight: 1000,
      gridWidth: 1400
    }

    const result = getPage({
      scrollElement: document.createElement('div'),
      layout,
      gap: 10
    })

    expect(mockGetPageSizes).toHaveBeenCalledWith({
      screenStart: 300,
      itemSize: 150,
      scrollSize: 800,
      itemsOnPage: 3,
      gap: 10
    })

    expect(result).toEqual({
      index: 1,
      page: 1,
      pageRange: [1, 3]
    })
  })

  it('should handle scroll with default values', () => {
    mockGetScrollProps.mockReturnValue({})

    const layout: Layout = {
      itemHeight: 200,
      itemWidth: 150,
      rowsOnViewport: 4,
      columnsOnViewport: 3,
      horizontal: false,
      scrollWidth: 800,
      scrollHeight: 1000,
      rows: 10,
      columns: 3,
      total: 30,
      pages: 3,
      itemsPerRow: 3,
      itemsPerColumn: 4,
      itemsPerPage: 12,
      gridHeight: 2200,
      gridWidth: 800
    }

    getPage({
      scrollElement: document.createElement('div'),
      layout,
      gap: 10
    })

    expect(mockGetPageSizes).toHaveBeenCalledWith({
      screenStart: 0,
      itemSize: 200,
      scrollSize: 1000,
      itemsOnPage: 4,
      gap: 10
    })
  })

  it('should handle errors gracefully', () => {
    mockGetScrollProps.mockImplementation(() => {
      throw new Error('Test error')
    })

    const layout: Layout = {
      itemHeight: 200,
      itemWidth: 150,
      rowsOnViewport: 4,
      columnsOnViewport: 3,
      horizontal: false,
      scrollWidth: 800,
      scrollHeight: 1000,
      rows: 10,
      columns: 3,
      total: 30,
      pages: 3,
      itemsPerRow: 3,
      itemsPerColumn: 4,
      itemsPerPage: 12,
      gridHeight: 2200,
      gridWidth: 800
    }

    const result = getPage({
      scrollElement: document.createElement('div'),
      layout,
      gap: 10
    })

    expect(result).toEqual({})
  })
})
