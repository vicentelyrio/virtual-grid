import { Layout } from '../types'
import { calculateGridSize } from './calculateGridSize'
import { getRect } from './getRect'

export type Bounds = {
  width: number
  height: number
}

export type GetLayoutProps = {
  gridElement: HTMLElement | null
  total: number
  bounds: Bounds
  gap: number
  padding: number[]
  horizontal: boolean
}

export function getLayout({
  gridElement,
  total,
  bounds,
  gap,
  padding,
  horizontal,
}: GetLayoutProps): Layout {
  try {
    const { width, height } = getRect(gridElement)

    const firstItem = gridElement?.children?.item(0)

    if (!firstItem) return {} as Layout

    const item = getRect(firstItem as HTMLElement)
    const itemHeight = item.height ?? 0
    const itemWidth = item.width ?? 0

    const rowsOnViewport = Math.max(Math.floor(bounds?.height / itemHeight) || 1, 1)
    const columnsOnViewport = Math.max(Math.floor(bounds?.width / itemWidth) || 1, 1)

    const itemsPerRow = Math.max(Math.round(width / itemWidth) || 1, 1)
    const itemsPerColumn = Math.max(Math.round(height / itemHeight) || 1, 1)

    const itemsPerPage = horizontal
      ? columnsOnViewport * itemsPerColumn
      : rowsOnViewport * itemsPerRow

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

    const pages = horizontal
      ? Math.ceil(columns / columnsOnViewport)
      : Math.ceil(rows / rowsOnViewport)

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
  } catch (e) {
    return {} as Layout
  }
}

