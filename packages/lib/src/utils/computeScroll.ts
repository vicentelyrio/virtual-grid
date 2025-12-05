export type ComputeScrollProps = {
  index: number
  itemSize: number
  padding: number
  gap: number
  rowsOnViewport: number
  columnsOnViewport: number
  horizontal: boolean
}

export function computeScroll({
  index,
  itemSize,
  padding,
  gap,
  rowsOnViewport,
  columnsOnViewport,
  horizontal
}: ComputeScrollProps) {
  const unitsPerPage = horizontal ? columnsOnViewport : rowsOnViewport
  const itemsSum = itemSize * unitsPerPage * (index - 1)
  const gapSum = unitsPerPage * gap * (index - 1)
  return gapSum + padding + itemsSum
}

