import { getBounds } from '@utils/getBounds'
import { getRect } from '@utils/getRect'

jest.mock('@utils/getRect')
const mockedGetRect = jest.mocked(getRect)

describe('getBounds', () => {
  const originalInnerWidth = window.innerWidth
  const originalInnerHeight = window.innerHeight

  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight
    })
  })

  describe('non-window scroll element', () => {
    it('should return scroll bounds directly when not window', () => {
      const scrollBounds = { width: 800, height: 600, isWindow: false }
      mockedGetRect.mockReturnValueOnce(scrollBounds)

      const result = getBounds({
        gridElement: document.createElement('div'),
        scrollElement: document.createElement('div')
      })

      expect(result).toEqual(scrollBounds)
    })
  })

  describe('window scroll element', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768
      })
    })

    it('should handle window scroll element with smaller window dimensions', () => {
      mockedGetRect
        .mockReturnValueOnce({ width: 0, height: 0, isWindow: true }) // scrollBounds
        .mockReturnValueOnce({ width: 1200, height: 900, isWindow: false }) // containerBounds

      const result = getBounds({
        gridElement: document.createElement('div'),
        scrollElement: window as unknown as HTMLElement
      })

      expect(result).toEqual({
        isWindow: true,
        width: 1024,  // window.innerWidth
        height: 768   // window.innerHeight
      })
    })

    it('should handle window scroll element with larger window dimensions', () => {
      mockedGetRect
        .mockReturnValueOnce({ width: 0, height: 0, isWindow: true }) // scrollBounds
        .mockReturnValueOnce({ width: 800, height: 600, isWindow: false }) // containerBounds

      const result = getBounds({
        gridElement: document.createElement('div'),
        scrollElement: window as unknown as HTMLElement
      })

      expect(result).toEqual({
        isWindow: true,
        width: 800,   // container width
        height: 600   // container height
      })
    })
  })

  describe('edge cases', () => {
    it('should handle null grid element', () => {
      mockedGetRect
        .mockReturnValueOnce({ width: 800, height: 600, isWindow: false }) // scrollBounds
        .mockReturnValueOnce({ width: 0, height: 0, isWindow: false }) // containerBounds (null parent)

      const result = getBounds({
        gridElement: null,
        scrollElement: document.createElement('div')
      })

      expect(result).toEqual({
        width: 800,
        height: 600,
        isWindow: false
      })
    })

    it('should handle null scroll element', () => {
      mockedGetRect
        .mockReturnValueOnce({ width: 0, height: 0, isWindow: false }) // scrollBounds (null)
        .mockReturnValueOnce({ width: 800, height: 600, isWindow: false }) // containerBounds

      const result = getBounds({
        gridElement: document.createElement('div'),
        scrollElement: null
      })

      expect(result).toEqual({
        width: 0,
        height: 0,
        isWindow: false
      })
    })
  })
})
