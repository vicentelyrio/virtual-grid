import { useCallback, useEffect, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'

import { getBounds } from '@utils/getBounds'
import { getLayout } from '@utils/getLayout'
import { Layout } from '@types'

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
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const rafRef = useRef<number | null>(null)

  const calculateLayout = useCallback(() => {
    const newBounds = getBounds({ scrollElement, gridElement })
    const newLayout = getLayout({
      gridElement,
      scrollElement,
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

  const handleResize = useCallback(() => {
    setResizing(true)

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      setResizing(false)
    }

    rafRef.current = requestAnimationFrame(() => {
      calculateLayout()
      rafRef.current = null
      setResizing(false)
    })
  }, [calculateLayout])

  useEffect(() => {
    if (!gridElement || !scrollElement) return

    resizeObserverRef.current = new ResizeObserver(handleResize)
    resizeObserverRef.current.observe(scrollElement)

    calculateLayout()

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        setResizing(false)
      }
    }
  }, [handleResize, gridElement, scrollElement, calculateLayout])

  return {
    resizing,
    layout,
  }
}
