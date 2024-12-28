import { CSSProperties, RefObject } from 'react'

// PAGE
export type PageResult = {
  page: number
  pageRange: number[]
}

// CONTENT
export type ContentResult = {
  items: unknown[]
  styles: CSSProperties
}

// LAYOUT
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

// VIRTUAL GRID PROPS
export type VirtualGridProps<T> = {
  data: T[],
  offScreenPages?: number
  padding?: number[]
  gap?: number,
  horizontal?: boolean
}

// VIRTUAL GRID TYPE
export type VirtualGrid<T> = Layout & {
  items: T[]
  styles: CSSProperties
  page: number
  pageRange: number[]
  onScrollTo: (page: number) => void
  scrolling: boolean
  resizing: boolean
  mounting: boolean
  gridRef: RefObject<HTMLDivElement | null>
  scrollRef: RefObject<HTMLDivElement | null>
}
