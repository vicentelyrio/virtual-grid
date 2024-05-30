type ComputeSizeProps = {
  total: number
  itemsPerPage: number
  itemSize: number
  padding: number
  gap: number
}

export function computeSize({
  total,
  itemsPerPage,
  itemSize,
  padding,
  gap
}: ComputeSizeProps): number {
  const itemsCount = Math.max(total, itemsPerPage) / itemsPerPage
  const itemsSum = itemSize * itemsCount
  const gapSum = (itemsCount - 1) * gap

  return gapSum + padding + itemsSum
}
