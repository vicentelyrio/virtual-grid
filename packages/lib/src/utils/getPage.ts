import { Layout } from '@types'
import { GetPageSizesReturnType, getPageSizes } from '@utils/getPageSizes'
import { getScrollProps } from '@utils/getScrollProps'
import { isWindow } from '@utils/isBrowser'

export type GetPageProps = {
  scrollElement: HTMLElement | Window | null
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

    if (!layout) return { index: 0, page: 1, pageRange: [0, 0] } as GetPageSizesReturnType

    const {
      itemHeight,
      itemWidth,
      rowsOnViewport,
      columnsOnViewport,
      horizontal,
      scrollWidth,
      scrollHeight,
      gridOffsetTop = 0,
      gridOffsetLeft = 0,
    } = layout

    const missingRequired =
      !Number.isFinite(itemHeight) ||
      !Number.isFinite(itemWidth) ||
      !Number.isFinite(rowsOnViewport) ||
      !Number.isFinite(columnsOnViewport) ||
      !Number.isFinite(scrollWidth) ||
      !Number.isFinite(scrollHeight)

    if (missingRequired) return { index: 0, page: 1, pageRange: [0, 0] }

    const isWindowScroll = isWindow(scrollElement)

    const effectiveScrollTop = isWindowScroll
      ? Math.max(0, scrollTop - gridOffsetTop)
      : scrollTop

    const effectiveScrollLeft = isWindowScroll
      ? Math.max(0, scrollLeft - gridOffsetLeft)
      : scrollLeft

    const verticalProps = {
      screenStart: effectiveScrollTop,
      itemSize: itemHeight,
      scrollSize: scrollHeight,
      itemsOnPage: rowsOnViewport,
      gap,
    }

    const horizontalProps = {
      screenStart: effectiveScrollLeft,
      itemSize: itemWidth,
      scrollSize: scrollWidth,
      itemsOnPage: columnsOnViewport,
      gap,
    }

    const pageSizes = getPageSizes(horizontal ? horizontalProps : verticalProps)
    const totalPages = Math.max(1, layout.pages ?? 1)
    const normalizedPage = Math.min(Math.max(1, pageSizes.page || 1), totalPages)

    return {
      ...pageSizes,
      page: normalizedPage,
    }
  } catch {
    return {
      index: 0,
      page: 1,
      pageRange: [0, 0]
    } as GetPageSizesReturnType
  }
}

