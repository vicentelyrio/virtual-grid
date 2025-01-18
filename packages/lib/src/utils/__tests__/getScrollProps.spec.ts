import { getScrollProps } from '@utils/getScrollProps'

describe('getScrollProps', () => {
  const originalWindow = window

  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true })
    Object.defineProperty(window, 'scrollX', { value: 50, configurable: true })
  })

  afterEach(() => {
    window = originalWindow
  })

  it('should handle null input', () => {
    const result = getScrollProps({ scrollElement: null })
    expect(result).toEqual({
      scrollTop: undefined,
      scrollLeft: undefined
    })
  })

  it('should handle window scroll', () => {
    const result = getScrollProps({
      scrollElement: window as unknown as HTMLElement
    })
    expect(result).toEqual({
      scrollTop: 100,
      scrollLeft: 50
    })
  })

  it('should handle HTMLElement scroll', () => {
    const element = document.createElement('div')
    Object.defineProperty(element, 'scrollTop', { value: 200 })
    Object.defineProperty(element, 'scrollLeft', { value: 150 })

    const result = getScrollProps({ scrollElement: element })
    expect(result).toEqual({
      scrollTop: 200,
      scrollLeft: 150
    })
  })

  it('should handle HTMLElement with zero scroll', () => {
    const element = document.createElement('div')
    Object.defineProperty(element, 'scrollTop', { value: 0 })
    Object.defineProperty(element, 'scrollLeft', { value: 0 })

    const result = getScrollProps({ scrollElement: element })
    expect(result).toEqual({
      scrollTop: 0,
      scrollLeft: 0
    })
  })
})
