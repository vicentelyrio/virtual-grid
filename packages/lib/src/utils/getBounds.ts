import { getRect } from '@utils/getRect'
import { isBrowser } from '@utils/isBrowser'

export type GetBoundsProps = {
  gridElement: HTMLElement | null
  scrollElement: HTMLElement | Window | null
}

export type GetBoundsReturnType = {
  width: number
  height: number
  isWindow: boolean
}

export function getBounds({
  gridElement,
  scrollElement
}: GetBoundsProps): GetBoundsReturnType {
  const scrollBounds = getRect(scrollElement)
  const containerBounds = getRect(gridElement?.parentNode as HTMLElement)

  if (!scrollBounds.isWindow) {
    return scrollBounds
  }

  const innerHeight = isBrowser ? window.innerHeight : 0
  const innerWidth = isBrowser ? window.innerWidth : 0
  const { width, height } = containerBounds

  return {
    ...scrollBounds,
    width: innerWidth < width ? innerWidth : width,
    height: innerHeight < height ? innerHeight : height,
  }
}
