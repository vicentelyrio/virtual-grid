import { getRect } from '@utils/getRect'

describe('getRect', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true })
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })
  })

  it('should handle null input', () => {
    const result = getRect(null)
    expect(result).toEqual({
      height: 0,
      width: 0,
      isWindow: false
    })
  })

  it('should handle window input', () => {
    const result = getRect(window)
    expect(result).toEqual({
      height: 768,
      width: 1024,
      isWindow: true
    })
  })

  it('should handle HTMLElement input', () => {
    const element = document.createElement('div')
    jest.spyOn(element, 'getBoundingClientRect').mockImplementation(() => ({
      width: 200,
      height: 150,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 200,
      bottom: 150,
      toJSON: () => {}
    }))

    const result = getRect(element)
    expect(result).toEqual({
      height: 150,
      width: 200,
      isWindow: false
    })
  })

  it('should handle element with zero dimensions', () => {
    const element = document.createElement('div')
    jest.spyOn(element, 'getBoundingClientRect').mockImplementation(() => ({
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      toJSON: () => {}
    }))

    const result = getRect(element)
    expect(result).toEqual({
      height: 0,
      width: 0,
      isWindow: false
    })
  })
})
