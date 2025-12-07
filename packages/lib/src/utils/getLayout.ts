import { Layout } from '@/types'
import { calculateGridSize } from '@utils/calculateGridSize'
import { getRect } from '@utils/getRect'
import { isWindow } from '@utils/isBrowser'

export type Bounds = {
  width: number
  height: number
}

export type GetLayoutProps = {
  gridElement: HTMLElement | null
  scrollElement: HTMLElement | Window | null
  total: number
  bounds: Bounds
  gap: number
  padding: number[]
  horizontal: boolean
}

function getDocumentOffset(element: HTMLElement | null): { top: number; left: number } {
  if (!element) return { top: 0, left: 0 }

  const rect = element.getBoundingClientRect()
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft

  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
  }
}

export function getLayout({
  gridElement,
  scrollElement,
  total,
  bounds,
  gap,
  padding,
  horizontal,
}: GetLayoutProps): Layout {
  try {
    const { width, height } = getRect(scrollElement)
    const isWindowScroll = isWindow(scrollElement)

    const firstItem = gridElement?.children?.item(0)

    if (!firstItem) return {} as Layout

    const item = getRect(firstItem as HTMLElement)
    const itemHeight = item.height ?? 0
    const itemWidth = item.width ?? 0

    const gridOffset = isWindowScroll ? getDocumentOffset(gridElement) : { top: 0, left: 0 }

    const effectiveBoundsHeight = Math.max(1, bounds?.height ?? 0)
    const effectiveBoundsWidth = Math.max(1, bounds?.width ?? 0)

    const rowsOnViewport = Math.max(Math.round(effectiveBoundsHeight / itemHeight) || 1, 1)
    const columnsOnViewport = Math.max(Math.round(effectiveBoundsWidth / itemWidth) || 1, 1)

    const itemsPerRow = Math.max(Math.floor((width + gap) / (itemWidth + gap)), 1)
    const itemsPerColumn = Math.max(Math.floor((height + gap) / (itemHeight + gap)), 1)

    const effectiveRowsPerColumn = horizontal ? itemsPerColumn : rowsOnViewport
    const itemsPerPage = effectiveRowsPerColumn * columnsOnViewport

    const safeItemsPerPage = Math.max(1, itemsPerPage)
    const pages = Math.max(1, Math.ceil(total / safeItemsPerPage))

    const { height: gridHeight, width: gridWidth } = calculateGridSize({
      horizontal,
      height,
      width,
      itemsPerRow,
      itemsPerColumn,
      itemHeight,
      itemWidth,
      total,
      padding,
      gap,
    })

    const contentHeight = gridHeight - padding[0] - padding[2]
    const rows = Math.ceil(contentHeight / (itemHeight + gap)) || 0
    const columns = horizontal
      ? Math.ceil(total / Math.max(1, itemsPerColumn))
      : Math.floor(gridWidth / (itemWidth + gap)) || 0

    return {
      scrollWidth: bounds?.width ?? 0,
      scrollHeight: bounds?.height ?? 0,
      rowsOnViewport,
      rows,
      columnsOnViewport,
      columns,
      total,
      pages,
      itemsPerRow,
      itemsPerColumn,
      itemsPerPage,
      itemHeight,
      itemWidth,
      gridHeight,
      gridWidth,
      horizontal,
      gridOffsetTop: gridOffset.top,
      gridOffsetLeft: gridOffset.left,
    }
  } catch {
    return {} as Layout
  }
}
