import { CSSProperties, ReactElement } from 'react'

export type VirtualGridProps<T> = {
  data: T[],
  itemElement: ReactElement
  gridElement: HTMLElement | null
  scrollElement: HTMLElement | null
  offScreenPages?: number
  padding?: number[]
  gap?: number,
  horizontal?: boolean
}

export type VirtualGrid<T> = Layout & {
  childrens: T[]
  styles: CSSProperties
  page: number
  pageRange: number[]
  onScrollTo: (page: number) => void
  scrolling: boolean
  resizing: boolean
  mounting: boolean
}

export type Layout = {
  scrollWidth: number
  scrollHeight: number
  rows: number
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
