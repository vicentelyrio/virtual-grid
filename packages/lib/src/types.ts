import { CSSProperties, RefObject } from 'react'

export type VirtualGridProps<T> = {
  data: T[],
  offScreenPages?: number
  padding?: number[]
  gap?: number,
  horizontal?: boolean
}

export type VirtualGrid<T> = Layout & {
  items: T[]
  styles: CSSProperties
  page: number
  pageRange: number[]
  onScrollTo: (page: number) => void
  scrolling: boolean
  resizing: boolean
  mounting: boolean
  gridRef: RefObject<HTMLDivElement>
  scrollRef: RefObject<HTMLDivElement>
}

export type Layout = {
  scrollWidth: number
  scrollHeight: number
  rows: number
  horizontal: boolean
  rowsOnViewport: number
  columns: number
  columnsOnViewport: number
  total: number
  pages: number
  itemsPerRow: number
  itemsPerColumn: number
  itemsPerPage: number
  itemHeight: number
  itemWidth: number
  gridHeight: number
  gridWidth: number
}
