import { getPageSizes } from '@utils/getPageSizes'

describe('getPageSizes', () => {
  it('should calculate page sizes correctly with standard inputs', () => {
    const result = getPageSizes({
      screenStart: 0,
      scrollSize: 1000,
      itemSize: 200,
      itemsOnPage: 10,
      gap: 20
    })

    expect(result).toEqual({
      index: 2.3, // Center position (500) / (itemSize + gap) = 500/220 ≈ 2.3
      page: 0, // end/itemsOnPage = 4.5/10 = 0.45 -> Math.floor = 0
      pageRange: [0, 4.5] // start = 0, end = 1000/(200+20) = 4.5
    })
  })

  it('should handle scrolled position', () => {
    const result = getPageSizes({
      screenStart: 440, // Two items scrolled (2 * (200 + 20))
      scrollSize: 1000,
      itemSize: 200,
      itemsOnPage: 10,
      gap: 20
    })

    expect(result).toEqual({
      index: 4.3, // (440 + 500)/(200 + 20) ≈ 4.3
      page: 0, // 6.5/10 = 0.65 -> Math.floor = 0
      pageRange: [2.0, 6.5] // start = 440/220 = 2, end = (440+1000)/220 = 6.5
    })
  })

  it('should handle different screen sizes', () => {
    const result = getPageSizes({
      screenStart: 0,
      scrollSize: 500, // Smaller screen
      itemSize: 200,
      itemsOnPage: 10,
      gap: 20
    })

    expect(result).toEqual({
      index: 1.1, // 250/220 ≈ 1.1
      page: 0, // 2.3/10 = 0.23 -> Math.floor = 0
      pageRange: [0, 2.3] // end = 500/220 ≈ 2.3
    })
  })

  it('should handle different item sizes and gaps', () => {
    const result = getPageSizes({
      screenStart: 0,
      scrollSize: 1000,
      itemSize: 100, // Smaller items
      itemsOnPage: 10,
      gap: 10 // Smaller gaps
    })

    expect(result).toEqual({
      index: 4.5, // 500/110 ≈ 4.5
      page: 0, // 9.1/10 = 0.91 -> Math.floor = 0
      pageRange: [0, 9.1] // end = 1000/110 ≈ 9.1
    })
  })

  it('should handle multiple pages', () => {
    const result = getPageSizes({
      screenStart: 2200, // 10 items scrolled (10 * (200 + 20))
      scrollSize: 1000,
      itemSize: 200,
      itemsOnPage: 5, // Smaller pages
      gap: 20
    })

    expect(result).toEqual({
      index: 12.3, // (2200 + 500)/220 ≈ 12.3
      page: 2, // 14.5/5 = 2.9 -> Math.floor = 2
      pageRange: [10.0, 14.5]
    })
  })
})
