import { Layout } from '@types'

export type ComputeGridProps = {
  layout: Layout
  page: number
  padding: number[]
  offScreenPages: number
  gap: number
}

export type ComputeGridReturnType = {
  start: number
  end: number
  width: string | number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  paddingLeft: number
}

export const MAX_SIZE = 8047500

export function computeGrid({
  layout,
  page,
  padding,
  offScreenPages,
  gap
}: ComputeGridProps): ComputeGridReturnType {
  if (!layout || !page) {
    return {} as ComputeGridReturnType
  }

  const {
    itemHeight,
    itemWidth,
    itemsPerPage,
    pages,
    rows,
    rowsOnViewport,
    columns,
    columnsOnViewport,
    horizontal,
    gridWidth,
  } = layout

  const minBoundary = Math.max(0, page - offScreenPages - 1)
  const maxBoundary = Math.min(pages, page + offScreenPages)

  const itemW = itemWidth + gap
  const itemH = itemHeight + gap

  const padT = padding[0]
  const padR = padding[1]
  const padB = padding[2]
  const padL = padding[3]

  const start = itemsPerPage * minBoundary
  const end = itemsPerPage * maxBoundary

  if (horizontal) {
    const columnsBefore = minBoundary * columnsOnViewport
    const columnsAfter = Math.max(0, columns - maxBoundary * columnsOnViewport)

    const pl = columnsBefore * itemW + padL
    const pr = columnsAfter * itemW + padR

    return {
      start,
      end,
      width: gridWidth,
      paddingTop: padT,
      paddingRight: Math.max(padR, Math.min(pr, MAX_SIZE - pl)),
      paddingBottom: padB,
      paddingLeft: Math.min(pl, MAX_SIZE),
    }
  }

  const rowsBefore = minBoundary * rowsOnViewport
  const rowsAfter = Math.max(0, rows - maxBoundary * rowsOnViewport)

  const pt = rowsBefore * itemH + padT
  const pb = rowsAfter * itemH + padB

  return {
    start,
    end,
    width: 'auto',
    paddingTop: Math.min(pt, MAX_SIZE),
    paddingRight: padR,
    paddingBottom: Math.max(padB, Math.min(pb, MAX_SIZE - pt)),
    paddingLeft: padL,
  }
}

