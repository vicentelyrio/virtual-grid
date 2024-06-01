import { useLayout } from './useLayout'
// import { usePage } from './usePage'
// import { useContent } from './useContent'

import { VirtualGrid, VirtualGridProps } from '../types'
import { useCallback, useState } from 'react'

export function useVirtualGrid<T>({
  data,
  // itemElement,
  gridElement,
  scrollElement,
  // offScreenPages = 1,
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

  // const { page, pageRange, scrolling, onScrollTo } = usePage({
  //   gap,
  //   scrollElement,
  //   layout,
  //   padding,
  // })
  //
  // const { childrens, styles } = useContent({
  //   data,
  //   itemElement,
  //   layout,
  //   page,
  //   padding,
  //   offScreenPages,
  //   gap,
  // })
  //
  return {
    ...layout,
    childrens: data,
    styles: {},
    // page,
    // pageRange,
    // onScrollTo,
    // scrolling,
    resizing,
    // mounting: !childrens || !layout || !page,
  }
}

export function useNode() {
  const [node, setNode] = useState<HTMLElement | null>(null)
  const ref = useCallback((node: HTMLElement) => {
    if (node !== null) {
      setNode(node)
    }
  }, [])
  return [node, ref]
}
