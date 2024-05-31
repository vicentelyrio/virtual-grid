import { roundTo } from './roundTo'

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
  const screenCenter = screenStart + scrollSize / 2
  const screenEnd = screenStart + scrollSize

  const start = roundTo(screenStart / (itemSize + gap), 1)
  const end = roundTo(screenEnd / (itemSize + gap), 1)
  const index = roundTo(screenCenter / (itemSize + gap), 1)
  const page = roundTo(end / itemsOnPage, 0)

  return {
    index,
    page,
    pageRange: [start, end],
  }
}

