export type GetScrollPropsProps = {
  scrollElement: HTMLElement
}

export function getScrollProps({ scrollElement }: GetScrollPropsProps) {
  if (scrollElement as Window === window) {
    return {
      scrollTop: scrollElement?.scrollY,
      scrollLeft: scrollElement?.scrollX,
    }
  }

  const { scrollTop, scrollLeft } = scrollElement

  return {
    scrollTop,
    scrollLeft,
  }
}

