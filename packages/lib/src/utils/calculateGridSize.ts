import { computeSize } from '@utils/computeSize'

export type CalculateGridSizeProps = {
  horizontal: boolean
  height: number
  width: number
  itemsPerRow: number
  itemsPerColumn: number
  itemHeight: number
  itemWidth: number
  total: number
  padding: number[]
  gap: number
}

export type CalculateGridSizeReturnType = {
  width: number
  height: number
}

export function calculateGridSize({
  horizontal,
  height,
  width,
  itemsPerRow,
  itemsPerColumn,
  itemHeight,
  itemWidth,
  total,
  padding,
  gap,
}: CalculateGridSizeProps): CalculateGridSizeReturnType {
  if (horizontal) {
    const adjustedWidth = computeSize({
      total,
      itemsPerPage: itemsPerColumn,
      itemSize: itemWidth,
      gap,
      padding: padding[1] + padding[3],
    })

    const finalWidth = Math.max(adjustedWidth, width)

    return {
      height,
      width: finalWidth
    }
  }

  const adjustedHeight = computeSize({
    total,
    itemsPerPage: itemsPerRow,
    itemSize: itemHeight,
    gap,
    padding: padding[0] + padding[2],
  })

  const finalHeight = Math.max(adjustedHeight, height)

  return {
    width,
    height: finalHeight
  }
}
