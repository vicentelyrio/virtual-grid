import { useLayout } from './useLayout'
import { usePage } from './usePage'
import { useContent } from './useContent'

import { VirtualGrid, VirtualGridProps } from '../types'

export function useVirtualGrid<T>({
  data,
  gridElement,
  scrollElement,
  offScreenPages = 1,
  padding = [0, 0, 0, 0],
  gap = 20,
  horizontal = false,
}: VirtualGridProps<T>): Partial<VirtualGrid<T>> {
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
    horizontal,
    padding,
  })

  const { items, styles } = useContent({
    data,
    layout,
    page,
    padding,
    offScreenPages,
    gap,
  })

  return {
    ...layout,
    items,
    styles,
    page,
    pageRange,
    onScrollTo,
    scrolling,
    resizing,
    mounting: !items || !layout || !page,
  }
}
