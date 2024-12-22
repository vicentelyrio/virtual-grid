import { Layout } from '../types'

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
  const maxBoundary = Math.min(pages, page + 1 + offScreenPages)

  const itemW = itemWidth + gap
  const itemH = itemHeight + gap

  const padT = padding[0]
  const padR = padding[1]
  const padB = padding[2]
  const padL = padding[3]

  const start = itemsPerPage * minBoundary
  const end = itemsPerPage * maxBoundary

  const visibleHeight = (maxBoundary - minBoundary) * itemH
  const visibleWidth = (maxBoundary - minBoundary + 1) * itemW

  // padding top
  const ptTotal = minBoundary * rowsOnViewport * itemH
  const ptLimit = Math.max(0, ptTotal)
  const pt = horizontal ? padT : ptLimit + padT

  // padding bottom
  const pbTotal = (rows - maxBoundary * rowsOnViewport) * itemH
  const pbLimit = Math.max(0, pbTotal)
  const pbMax = Math.min(pbLimit, MAX_SIZE - pt - visibleHeight)
  const pb = horizontal ? padB : pbMax + padB

  // padding left
  const plTotal = minBoundary * columnsOnViewport * itemW
  const plLimit = Math.max(0, plTotal)
  const pl = horizontal ? plLimit + padL : padL

  // padding right
  const prTotal = (columns - maxBoundary * columnsOnViewport) * itemW
  const prLimit = Math.max(0, prTotal)
  const prMax = Math.min(prLimit, MAX_SIZE - pl - visibleWidth)
  const pr = horizontal ? prMax + padR : padR

  return {
    start,
    end,
    width: horizontal ? gridWidth : 'auto',
    paddingTop: pt ?? padT,
    paddingRight: pr ?? padR,
    paddingBottom: pb ?? padB,
    paddingLeft: pl ?? padL,
  }
}

