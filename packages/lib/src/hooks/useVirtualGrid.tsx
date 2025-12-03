import { useRef } from 'react'
import { useLayout } from '@hooks/useLayout'
import { usePage } from '@hooks/usePage'
import { useContent } from '@hooks/useContent'

import { VirtualGrid, VirtualGridProps } from '@types'

export function useVirtualGrid<T>({
  data,
  offScreenPages = 1,
  padding = [0, 0, 0, 0],
  gap = 20,
  horizontal = false,
}: VirtualGridProps<T>): VirtualGrid<T> {
  const scrollRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const gridElement = gridRef.current
  const scrollElement = scrollRef.current

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
    gridRef,
    scrollRef,
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
