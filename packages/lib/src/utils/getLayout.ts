import { Layout } from '@/types'
import { calculateGridSize } from '@utils/calculateGridSize'
import { getRect } from '@utils/getRect'

export type Bounds = {
  width: number
  height: number
}

export type GetLayoutProps = {
  gridElement: HTMLElement | null
  scrollElement: HTMLElement | null
  total: number
  bounds: Bounds
  gap: number
  padding: number[]
  horizontal: boolean
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

    const firstItem = gridElement?.children?.item(0)

    if (!firstItem) return {} as Layout

    const item = getRect(firstItem as HTMLElement)
    const itemHeight = item.height ?? 0
    const itemWidth = item.width ?? 0

    const itemsPerRow = Math.max(Math.floor(width / (itemWidth + gap)), 1)
    const itemsPerColumn = Math.max(Math.floor(height / (itemHeight + gap)), 1)

    const rowsOnViewport = Math.max(Math.round(bounds?.height / itemHeight) || 1, 1)
    const columnsOnViewport = Math.max(Math.round(bounds?.width / itemWidth) || 1, 1)

    const itemsPerPage = horizontal
      ? columnsOnViewport * itemsPerColumn
      : rowsOnViewport * itemsPerRow

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

    const rows = Math.ceil(gridHeight / (itemHeight + gap)) || 0
    const columns = Math.floor(gridWidth / (itemWidth + gap)) || 0

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
      horizontal
    }
  } catch {
    return {} as Layout
  }
}
