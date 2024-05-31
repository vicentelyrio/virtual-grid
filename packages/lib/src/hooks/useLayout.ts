import { useCallback, useEffect, useState } from 'react'
import { debounce } from 'ts-debounce'
import isEqual from 'react-fast-compare'

import { getBounds } from '../utils/getBounds'
import { GetLayoutReturnType, getLayout } from '../utils/getLayout'

export type UseLayoutProps = {
  gridElement: HTMLElement | null
  scrollElement: HTMLElement | null
  gap: number
  padding: number[]
  total: number
  horizontal: boolean
}

export type UseLayoutReturnType = {
  layout: GetLayoutReturnType
  resizing: boolean
}

export function useLayout({
  gridElement,
  scrollElement,
  gap,
  padding,
  total,
  horizontal
}: UseLayoutProps): UseLayoutReturnType {
  const [layout, setLayout] = useState<GetLayoutReturnType | null>(null)
  const [resizing, setResizing] = useState(false)

  // Recalculate screen
  const calculateLayout = useCallback(() => {
    const newBounds = getBounds({ scrollElement, gridElement })

    const newLayout = getLayout({
      gridElement,
      horizontal,
      gap,
      padding,
      bounds: newBounds,
      total,
    })

    if (!isEqual(newLayout, layout)) setLayout(newLayout)
  }, [gap, gridElement, horizontal, padding, scroll, total, layout])

  // Resize event control
  const handleResize = useCallback(() => {
    setResizing(true)

    debounce(() => {
      calculateLayout()
      setResizing(false)
    })
  }, [debounce, calculateLayout])

  // Resize event handler
  useEffect(() => {
    if (!gridElement || !scrollElement) return

    window?.addEventListener('resize', handleResize)

    return () => window?.removeEventListener('resize', handleResize)
  }, [handleResize, gridElement, scrollElement])

  // Initial Layout setup
  useEffect(() => {
    if (!gridElement || !scrollElement) return

    debounce(calculateLayout)
  }, [debounce, gridElement, scrollElement, layout, calculateLayout])

  return {
    resizing,
    layout,
  }
}
