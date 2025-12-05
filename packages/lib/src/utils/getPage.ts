import { Layout } from '@types'
import { GetPageSizesReturnType, getPageSizes } from '@utils/getPageSizes'
import { getScrollProps } from '@utils/getScrollProps'

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

    if (!layout) return { index: 0, page: 1, pageRange: [0, 0] } as GetPageSizesReturnType

    const {
      itemHeight,
      itemWidth,
      rowsOnViewport,
      columnsOnViewport,
      horizontal,
      scrollWidth,
      scrollHeight,
    } = layout

    const missingRequired =
      !Number.isFinite(itemHeight) ||
      !Number.isFinite(itemWidth) ||
      !Number.isFinite(rowsOnViewport) ||
      !Number.isFinite(columnsOnViewport) ||
      !Number.isFinite(scrollWidth) ||
      !Number.isFinite(scrollHeight)

    if (missingRequired) return { index: 0, page: 1, pageRange: [0, 0] }

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

