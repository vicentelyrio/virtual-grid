import { roundTo } from './roundTo'

export type GetPageSizesProps = {
  screenStart: number
  scrollSize: number
  itemSize: number
  itemsOnPage: number
  gap: number
  total: number
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
  total,
  gap
}: GetPageSizesProps): GetPageSizesReturnType {
  const screenCenter = screenStart + scrollSize / 2
  const screenEnd = screenStart + scrollSize

  const start = Math.floor(screenStart / (itemSize + gap))  // Use floor for start
  const end = Math.min(
    Math.ceil(screenEnd / (itemSize + gap)),
    Math.ceil(total / itemsOnPage)
  )
  const index = roundTo(screenCenter / (itemSize + gap), 1)
  const page = roundTo(end / itemsOnPage, 0)

  return {
    index,
    page,
    pageRange: [start, end],
  }
}

