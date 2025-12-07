import { isWindow as isWindowCheck } from '@utils/isBrowser'

export type GetRectReturnType = {
  height: number
  width: number
  isWindow: boolean
}

export function getRect(el: HTMLElement | Window | null): GetRectReturnType {
  if (!el) {
    return {
      height: 0,
      width: 0,
      isWindow: false
    }
  }

  if (isWindowCheck(el)) {
    return {
      height: el.innerHeight,
      width: el.innerWidth,
      isWindow: true,
    }
  }
  const { width, height } = (el as HTMLElement).getBoundingClientRect()

  return {
    height,
    width,
    isWindow: false,
  }
}

