import { useCallback, useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'

import { getBounds } from '../utils/getBounds'
import { getLayout } from '../utils/getLayout'
import { Layout } from '../types'

export type UseLayoutProps = {
  gridElement: HTMLElement | null
  scrollElement: HTMLElement | null
  gap: number
  padding: number[]
  total: number
  horizontal: boolean
}

export type UseLayoutReturnType = {
  layout: Layout
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
  const [layout, setLayout] = useState<Layout>({} as Layout)
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

    if (!isEqual(newLayout, layout)) {
      setLayout(newLayout)
    }
  }, [gap, gridElement, horizontal, padding, scrollElement, total, layout])

  // Resize event control
  const handleResize = useCallback(() => {
    setResizing(true)
    calculateLayout()
    setResizing(false)
  }, [calculateLayout])

  // Resize event handler
  useEffect(() => {
    if (!gridElement || !scrollElement) return

    window?.addEventListener('resize', handleResize)

    calculateLayout()

    return () => window?.removeEventListener('resize', handleResize)
  }, [handleResize, gridElement, scrollElement])

  return {
    resizing,
    layout,
  }
}
