import { CSSProperties, RefObject } from 'react'

export type PageResult = {
  page: number
  pageRange: number[]
}

export type ContentResult = {
  items: unknown[]
  styles: CSSProperties
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

export type VirtualGridProps<T> = {
  data: T[],
  offScreenPages?: number
  padding?: number[]
  gap?: number,
  horizontal?: boolean
}

export type VirtualGrid<T> = {
  gridRef: RefObject<HTMLDivElement | null>
  scrollRef: RefObject<HTMLDivElement | null>
  scrolling: boolean
  resizing: boolean
  mounting: boolean
  onScrollTo: (page: number) => void
  items?: T[]
  styles?: CSSProperties
  page?: number
  pageRange?: number[]
  scrollWidth?: number
  scrollHeight?: number
  rows?: number
  horizontal?: boolean
  rowsOnViewport?: number
  columns?: number
  columnsOnViewport?: number
  total?: number
  pages?: number
  itemsPerRow?: number
  itemsPerColumn?: number
  itemsPerPage?: number
  itemHeight?: number
  itemWidth?: number
  gridHeight?: number
  gridWidth?: number
}
