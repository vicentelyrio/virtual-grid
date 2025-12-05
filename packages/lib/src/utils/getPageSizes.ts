import { roundTo } from '@utils/roundTo'

export type GetPageSizesProps = {
  screenStart: number
  scrollSize: number
  itemSize: number
  itemsOnPage: number
  gap: number
}

export type GetPageSizesReturnType = {
  index: number
  page: number
  pageRange: number[]
}

export function getPageSizes({
  screenStart,
  scrollSize,
  itemSize,
  itemsOnPage,
  gap
}: GetPageSizesProps): GetPageSizesReturnType {
  const safeItemSize = Number.isFinite(itemSize) && itemSize > 0 ? itemSize : 1
  const safeGap = Number.isFinite(gap) && gap >= 0 ? gap : 0
  const safeScrollSize = Number.isFinite(scrollSize) && scrollSize >= 0 ? scrollSize : 0
  const safeScreenStart = Number.isFinite(screenStart) ? screenStart : 0
  const safeItemsOnPage = Number.isFinite(itemsOnPage) && itemsOnPage > 0 ? itemsOnPage : 1
  const itemWithGap = safeItemSize + safeGap

  if (itemWithGap === 0 || !Number.isFinite(itemWithGap)) {
    return { index: 0, page: 1, pageRange: [0, 0] }
  }

  const screenCenter = safeScreenStart + safeScrollSize / 2
  const screenEnd = safeScreenStart + safeScrollSize

  const start = roundTo(safeScreenStart / itemWithGap, 1)
  const end = roundTo(screenEnd / itemWithGap, 1)
  const index = roundTo(screenCenter / itemWithGap, 1)
  // Use Math.round(end) to handle edge case where scroll doesn't quite reach max
  // (e.g., end = 999.9 should give page 334, not 333)
  const page = Math.floor(Math.max(0, Math.round(end) - 1) / safeItemsOnPage) + 1

  return {
    index,
    page,
    pageRange: [start, end],
  }
}
