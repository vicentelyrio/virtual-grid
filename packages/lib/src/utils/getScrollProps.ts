import { isWindow } from '@utils/isBrowser'

export type GetScrollPropsProps = {
  scrollElement: HTMLElement | Window | null
}

export function getScrollProps({ scrollElement }: GetScrollPropsProps) {
  if (isWindow(scrollElement)) {
    const { scrollY, scrollX } = window
    return {
      scrollTop: scrollY,
      scrollLeft: scrollX,
    }
  }

  const { scrollTop, scrollLeft } = (scrollElement as HTMLElement) ?? {}

  return {
    scrollTop,
    scrollLeft,
  }
}

