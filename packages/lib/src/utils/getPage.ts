import { Layout } from "../types"
import { GetPageSizesReturnType, getPageSizes } from "./getPageSizes"
import { getScrollProps } from "./getScrollProps"

export type GetPageProps = {
  scrollElement: HTMLElement | null
  layout: Layout
  gap: number
}

export type GetPageReturnType = GetPageSizesReturnType

export function getPage({
  scrollElement,
  layout,
  gap
}: GetPageProps): GetPageSizesReturnType {
  try {
    const { scrollTop = 0, scrollLeft = 0 } = getScrollProps({ scrollElement })

    if (!layout) return {} as GetPageSizesReturnType

    const {
      itemHeight,
      itemWidth,
      rowsOnViewport,
      columnsOnViewport,
      horizontal,
      scrollWidth,
      scrollHeight,
    } = layout

    const verticalProps = {
      screenStart: scrollTop,
      itemSize: itemHeight,
      scrollSize: scrollHeight,
      itemsOnPage: rowsOnViewport,
      gap,
    }

    const horizontalProps = {
      screenStart: scrollLeft,
      itemSize: itemWidth,
      scrollSize: scrollWidth,
      itemsOnPage: columnsOnViewport,
      gap,
    }

    return getPageSizes(horizontal ? horizontalProps : verticalProps)
  } catch (e) {
    return {} as GetPageSizesReturnType
  }
}

