import { getLayout } from '@utils/getLayout'
import { getRect } from '@utils/getRect'
import { calculateGridSize } from '@utils/calculateGridSize'

jest.mock('@utils/getRect')
jest.mock('@utils/calculateGridSize')

describe('getLayout', () => {
  const mockGetRect = getRect as jest.Mock
  const mockCalculateGridSize = calculateGridSize as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    mockGetRect.mockImplementation(() => ({
      width: 1000,
      height: 800
    }))

    mockCalculateGridSize.mockImplementation(() => ({
      width: 1000,
      height: 800
    }))
  })

  it('should handle null elements', () => {
    const result = getLayout({
      gridElement: null,
      scrollElement: null,
      total: 0,
      bounds: { width: 0, height: 0 },
      gap: 10,
      padding: [0, 0, 0, 0],
      horizontal: false
    })

    expect(result).toEqual({})
  })

  it('should calculate vertical layout correctly', () => {
    const gridElement = document.createElement('div')
    const childElement = document.createElement('div')
    gridElement.appendChild(childElement)

    mockGetRect
      .mockImplementationOnce(() => ({ width: 1000, height: 800 })) // scrollElement
      .mockImplementationOnce(() => ({ width: 200, height: 150 })) // firstItem

    mockCalculateGridSize.mockReturnValue({
      width: 1000,
      height: 1600
    })

    const result = getLayout({
      gridElement,
      scrollElement: document.createElement('div'),
      total: 20,
      bounds: { width: 1000, height: 800 },
      gap: 10,
      padding: [20, 20, 20, 20],
      horizontal: false
    })

    expect(result).toEqual({
      scrollWidth: 1000,
      scrollHeight: 800,
      rowsOnViewport: 5, // round(800/150) = round(5.33) = 5
      rows: 10, // 1600/(150+10) rounded up
      columnsOnViewport: 5, // round(1000/200) = 5
      columns: 4, // 1000/(200+10) rounded down
      total: 20,
      pages: 1, // ceil(total/itemsPerPage)
      itemsPerRow: 4, // 1000/(200+10) rounded down
      itemsPerColumn: 5, // 800/(150+10) rounded down
      itemsPerPage: 20, // 5 * 4
      itemHeight: 150,
      itemWidth: 200,
      gridHeight: 1600,
      gridWidth: 1000,
      horizontal: false
    })
  })

  it('should calculate horizontal layout correctly', () => {
    const gridElement = document.createElement('div')
    const childElement = document.createElement('div')
    gridElement.appendChild(childElement)

    mockGetRect
      .mockImplementationOnce(() => ({ width: 1000, height: 800 })) // scrollElement
      .mockImplementationOnce(() => ({ width: 200, height: 150 })) // firstItem

    mockCalculateGridSize.mockReturnValue({
      width: 2000,
      height: 800
    })

    const result = getLayout({
      gridElement,
      scrollElement: document.createElement('div'),
      total: 20,
      bounds: { width: 1000, height: 800 },
      gap: 10,
      padding: [20, 20, 20, 20],
      horizontal: true
    })

    expect(result).toEqual({
      scrollWidth: 1000,
      scrollHeight: 800,
      rowsOnViewport: 5, // round(800/150) = round(5.33) = 5
      rows: 5,
      columnsOnViewport: 5, // round(1000/200) = 5
      columns: 9, // 2000/(200+10) rounded down
      total: 20,
      pages: 1, // ceil(total/itemsPerPage)
      itemsPerRow: 4, // 1000/(200+10) rounded down
      itemsPerColumn: 5, // 800/(150+10) rounded down
      itemsPerPage: 25, // 5 * 5 (columnsOnViewport * itemsPerColumn)
      itemHeight: 150,
      itemWidth: 200,
      gridHeight: 800,
      gridWidth: 2000,
      horizontal: true
    })
  })

  it('should handle minimum values correctly', () => {
    const gridElement = document.createElement('div')
    const childElement = document.createElement('div')
    gridElement.appendChild(childElement)

    // Mock very small dimensions
    mockGetRect
      .mockImplementationOnce(() => ({ width: 100, height: 100 })) // scrollElement
      .mockImplementationOnce(() => ({ width: 150, height: 150 })) // firstItem

    mockCalculateGridSize.mockReturnValue({
      width: 150,
      height: 150
    })

    const result = getLayout({
      gridElement,
      scrollElement: document.createElement('div'),
      total: 1,
      bounds: { width: 100, height: 100 },
      gap: 10,
      padding: [10, 10, 10, 10],
      horizontal: false
    })

    expect(result.itemsPerRow).toBe(1)
    expect(result.itemsPerColumn).toBe(1)
    expect(result.rowsOnViewport).toBe(1)
    expect(result.columnsOnViewport).toBe(1)
  })

  it('should handle errors gracefully', () => {
    mockGetRect.mockImplementation(() => {
      throw new Error('Test error')
    })

    const result = getLayout({
      gridElement: document.createElement('div'),
      scrollElement: document.createElement('div'),
      total: 10,
      bounds: { width: 1000, height: 800 },
      gap: 10,
      padding: [0, 0, 0, 0],
      horizontal: false
    })

    expect(result).toEqual({})
  })
})
