import { useLayout } from './useLayout'
import { usePage } from './usePage'
import { useContent } from './useContent'

import { ReactElement } from 'react'

export type UseVirtualGridProps<T> = {
  data: T[],
  itemElement: ReactElement
  gridElement: HTMLElement | null
  scrollElement: HTMLElement | null
  diff?: number
  padding?: number[]
  gap?: number,
  horizontal?: boolean
}

export function useVirtualGrid<T>({
  data,
  itemElement,
  gridElement,
  scrollElement,
  diff = 1,
  padding = [0, 0, 0, 0],
  gap = 20,
  horizontal = false,
}: UseVirtualGridProps<T>) {
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

