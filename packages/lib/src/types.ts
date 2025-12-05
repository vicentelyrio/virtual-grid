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

export type Styles = {
  width?: string | number
  paddingTop?: string
  paddingRight?: string
  paddingBottom?: string
  paddingLeft?: string
  gap?: string
}

export type VirtualGridProps<T> = {
  data: T[]
  offScreenPages?: number
  padding?: number[]
  gap?: number
  horizontal?: boolean
}

export type VirtualGrid<T> = {
  gridRef: RefObject<HTMLDivElement | null>
  scrollRef: RefObject<HTMLDivElement | null>
  scrolling: boolean
  resizing: boolean
  mounting: boolean
  horizontal: boolean
  onScrollTo: (page: number) => void
  items?: T[]
  scrollWidth?: number
  scrollHeight?: number
  columns?: number
  columnsOnViewport?: number
  gridHeight?: number
  gridWidth?: number
  itemsPerColumn?: number
  itemsPerPage?: number
  itemsPerRow?: number
  itemHeight?: number
  itemWidth?: number
  page: number
  pages: number
  pageRange: number[]
  rows?: number
  rowsOnViewport?: number
  styles?: CSSProperties
  total?: number
}
