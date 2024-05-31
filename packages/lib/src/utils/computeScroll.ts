export type ComputeScrollProps = {
  index: number
  itemSize: number
  padding: number
  gap: number
  itemsPerPage: number
}

export function computeScroll({
  index,
  itemSize,
  padding,
  gap,
  itemsPerPage
}: ComputeScrollProps) {
  const itemsSum = itemSize * itemsPerPage * (index - 1)
  const gapSum = itemsPerPage * gap * (index - 1)
  return gapSum + padding + itemsSum
}

