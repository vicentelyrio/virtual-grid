export type GetScrollPropsProps = {
  scrollElement: HTMLElement | null
}

export function getScrollProps({ scrollElement }: GetScrollPropsProps) {
  if (scrollElement as unknown as Window === window) {
    const { scrollY, scrollX } = (scrollElement as unknown as Window) ?? {}
    return {
      scrollTop: scrollY,
      scrollLeft: scrollX,
    }
  }

  const { scrollTop, scrollLeft } = scrollElement ?? {}

  return {
    scrollTop,
    scrollLeft,
  }
}

