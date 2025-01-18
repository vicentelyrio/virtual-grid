import { useCallback, useEffect, useRef, useState } from 'react'
import { computeScroll } from '@utils/computeScroll'
import { GetPageReturnType, getPage } from '@utils/getPage'
import { Layout } from '@types'

export type UsePageProps = {
  scrollElement: HTMLElement | null
  layout: Layout
  gap: number
  padding: number[]
  horizontal: boolean
}

export function usePage({
  scrollElement,
  layout,
  gap,
  padding,
  horizontal,
}: UsePageProps) {
  const [page, setPage] = useState<GetPageReturnType>({
    index: 1,
    page: 1,
    pageRange: [0, 0]
  })
  const [scrolling, setScrolling] = useState(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastScrollPosition = useRef<number>(0)

  const {
    itemHeight = 0,
    itemWidth = 0,
    itemsPerPage = 0
  } = layout || {}

  const computeScrollPosition = useCallback(
    (index: number) => {
      const size = horizontal ? itemWidth : itemHeight
      const paddingStart = horizontal ? padding[2] : padding[0]

      return computeScroll({
        index,
        gap,
        itemsPerPage,
        itemSize: size,
        padding: paddingStart,
      })
    },
    [horizontal, itemHeight, itemWidth, gap, itemsPerPage, padding]
  )

  const onScrollTo = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      if (!scrollElement) return

      const scrollPosition = computeScrollPosition(index)
      const scrollOptions: ScrollToOptions = {
        behavior,
        [horizontal ? 'left' : 'top']: scrollPosition,
        [horizontal ? 'top' : 'left']: 0
      }

      scrollElement.scroll(scrollOptions)
    },
    [scrollElement, horizontal, computeScrollPosition]
  )

  const updatePage = useCallback(() => {
    if (!scrollElement || !layout) return
    setPage(getPage({ scrollElement, layout, gap }))
  }, [scrollElement, layout, gap])

  const handleScroll = useCallback(() => {
    if (!scrollElement || !layout) return

    // Clear existing timeouts
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    // Get current scroll position
    const currentPosition = horizontal
      ? scrollElement.scrollLeft
      : scrollElement.scrollTop

    // Check if scroll position changed significantly
    const scrollDelta = Math.abs(currentPosition - lastScrollPosition.current)
    if (scrollDelta < 1) return

    lastScrollPosition.current = currentPosition

    // Set scrolling state
    setScrolling(true)

    // Update page calculation in next frame
    rafRef.current = requestAnimationFrame(() => {
      updatePage()
      rafRef.current = null

      // Reset scrolling state after scroll ends
      scrollTimeoutRef.current = setTimeout(() => {
        setScrolling(false)
        scrollTimeoutRef.current = null
      }, 150)
    })
  }, [scrollElement, layout, horizontal, updatePage])

  // Initialize page on mount and layout change
  useEffect(() => {
    if (scrollElement && layout) {
      updatePage()
    }
  }, [scrollElement, layout, updatePage])

  // Setup scroll listener
  useEffect(() => {
    if (!scrollElement) return

    scrollElement.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll, scrollElement])

  return {
    ...page,
    scrolling,
    onScrollTo,
  }
}