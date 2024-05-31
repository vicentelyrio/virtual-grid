import { GetLayoutReturnType } from "./getLayout"
import { GetPageSizesReturnType, getPageSizes } from "./getPageSizes"
import { getScrollProps } from "./getScrollProps"

export type GetPageProps = {
  scrollElement: HTMLElement
  layout: GetLayoutReturnType
  gap: number
}

export type GetPageReturnType = GetPageSizesReturnType

export function getPage({
  scrollElement,
  layout,
  gap
}: GetPageProps): GetPageReturnType {
  try {
    const { scrollTop, scrollLeft } = getScrollProps({ scrollElement })

    if (!layout) return {} as GetPageReturnType

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
    return {} as GetPageReturnType
  }
}

