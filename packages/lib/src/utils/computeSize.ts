export type ComputeSizeProps = {
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
  if (!itemsPerPage || itemsPerPage <= 0) {
    return padding
  }

  const itemsCount = Math.max(1, Math.ceil(total / itemsPerPage))
  const itemsSum = itemSize * itemsCount
  const gapSum = (itemsCount - 1) * gap

  return gapSum + padding + itemsSum
}
