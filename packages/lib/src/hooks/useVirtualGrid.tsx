import { useLayout } from './useLayout'
import { usePage } from './usePage'
import { useContent } from './useContent'

import { ReactNode } from 'react'

export type UseVirtualGridProps = {
  diff: number
  padding: number[]
  gap: number,
  data: unknown[],
  indexKey: number
  horizontal: boolean
  itemElement: ReactNode
  gridElement: HTMLElement
  scrollElement: HTMLElement
}

export const useVirtualGrid = ({
  data,
  itemElement,
  gridElement,
  scrollElement,
  diff = 1,
  padding = [0, 0, 0, 0],
  gap,
  indexKey,
  horizontal = false,
}: UseVirtualGridProps) => {
  const total = data?.length ?? 0

  const { resizing, layout } = useLayout({
    gridElement,
    scrollElement,
    gap,
    padding,
    total,
    horizontal,
  })

  const { page, pageRange, scrolling, onScrollTo } = usePage({
    gap,
    scrollElement,
    layout,
    padding,
  })

  const { childrens, styles } = useContent({
    data,
    itemElement,
    indexKey,
    layout,
    page,
    padding,
    diff,
    gap,
  })

  return {
    ...layout,
    childrens,
    styles,
    gridElement,
    scrollElement,
    page,
    pageRange,
    resizing,
    scrolling,
    onScrollTo,
    mounting: !childrens || !layout || !page,
  }
}

