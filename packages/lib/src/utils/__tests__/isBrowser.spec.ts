import { isBrowser, isWindow } from '@utils/isBrowser'

describe('isBrowser', () => {
  it('should return true in browser environment (jest with jsdom)', () => {
    // In Jest with jsdom, window is defined
    expect(isBrowser).toBe(true)
  })
})

describe('isWindow', () => {
  it('should return true when element is window', () => {
    expect(isWindow(window)).toBe(true)
  })

  it('should return false when element is null', () => {
    expect(isWindow(null)).toBe(false)
  })

  it('should return false when element is undefined', () => {
    expect(isWindow(undefined)).toBe(false)
  })

  it('should return false when element is an HTMLElement', () => {
    const div = document.createElement('div')
    expect(isWindow(div)).toBe(false)
  })

  it('should return false when element is a plain object', () => {
    expect(isWindow({})).toBe(false)
  })
})

