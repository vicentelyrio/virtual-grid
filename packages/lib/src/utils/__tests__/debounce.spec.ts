import { debounce } from '@utils/debounce'

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: false })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should delay function execution', () => {
    const mockFn = jest.fn<void, []>()
    const debouncedFn = debounce(mockFn, 500)

    debouncedFn()
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(499)
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should use default delay of 300ms when not specified', () => {
    const mockFn = jest.fn<void, []>()
    const debouncedFn = debounce(mockFn)

    debouncedFn()
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(299)
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should cancel previous timer on subsequent calls', () => {
    const mockFn = jest.fn<void, []>()
    const debouncedFn = debounce(mockFn, 500)

    debouncedFn()
    jest.advanceTimersByTime(400)
    debouncedFn()
    jest.advanceTimersByTime(400)
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should preserve function arguments', () => {
    const mockFn = jest.fn<void, [number, string, { foo: string }]>()
    const debouncedFn = debounce(mockFn, 500)

    debouncedFn(1, 'test', { foo: 'bar' })
    jest.advanceTimersToNextTimer()

    expect(mockFn).toHaveBeenCalledWith(1, 'test', { foo: 'bar' })
  })

  it('should preserve this context', function() {
    const context = { value: 42 }
    const mockFn = jest.fn<void, []>(function(this: typeof context) {
      expect(this.value).toBe(42)
    })

    const debouncedFn = debounce.call(context, mockFn, 500)
    debouncedFn()
    jest.advanceTimersToNextTimer()

    expect(mockFn).toHaveBeenCalled()
  })

  it('should handle multiple arguments over multiple calls', () => {
    const mockFn = jest.fn<void, [number, number, number]>()
    const debouncedFn = debounce(mockFn, 500)

    debouncedFn(1, 2, 3)
    debouncedFn(4, 5, 6)
    debouncedFn(7, 8, 9)

    jest.advanceTimersToNextTimer()

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith(7, 8, 9)
  })

  it('should work with async functions', async () => {
    const mockAsyncFn = jest.fn<Promise<string>, []>().mockResolvedValue('result')
    const debouncedFn = debounce(mockAsyncFn, 500)

    debouncedFn()
    jest.advanceTimersToNextTimer()

    expect(mockAsyncFn).toHaveBeenCalled()
  })
})
