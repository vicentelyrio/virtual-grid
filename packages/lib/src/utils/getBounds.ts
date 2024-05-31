import { getRect } from './getRect'

export type GetBoundsProps = {
  gridElement: HTMLElement
  scrollElement: HTMLElement
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

  const { innerHeight, innerWidth } = window ?? {}
  const { width, height } = containerBounds

  return {
    ...scrollBounds,
    width: innerWidth < width ? innerWidth : width,
    height: innerHeight < height ? innerHeight : height,
  }
}

