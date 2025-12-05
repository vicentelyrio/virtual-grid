import { useEffect, useRef, useState } from 'react'
import { useLayout } from '@hooks/useLayout'
import { usePage } from '@hooks/usePage'
import { useContent } from '@hooks/useContent'

import type { VirtualGrid, VirtualGridProps } from '@types'

export function useVirtualGrid<T>({
  data,
  offScreenPages = 1,
  padding = [0, 0, 0, 0],
  gap = 20,
  horizontal = false,
}: VirtualGridProps<T>): VirtualGrid<T> {
  const scrollRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [gridElement, setGridElement] = useState<HTMLElement | null>(null)
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null)

  const total = data?.length ?? 0

  useEffect(() => {
    if (gridRef.current) {
      setGridElement(gridRef.current)
    }
    if (scrollRef.current) {
      setScrollElement(scrollRef.current)
    }
  }, [])

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
    page,
    gridRef,
    scrollRef,
    items,
    styles,
    pageRange,
    onScrollTo,
    scrolling,
    resizing,
    mounting: !items || !layout?.pages || !page,
  }
}
