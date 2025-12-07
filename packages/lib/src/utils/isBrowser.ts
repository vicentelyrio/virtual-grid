export const isBrowser = typeof window !== 'undefined'

export function isWindow(element: unknown): element is Window {
  return isBrowser && element === window
}
