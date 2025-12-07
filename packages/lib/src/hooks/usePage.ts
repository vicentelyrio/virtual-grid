import { useCallback, useEffect, useRef, useState } from 'react'
import { computeScroll } from '@utils/computeScroll'
import { GetPageReturnType, getPage } from '@utils/getPage'
import { isWindow } from '@utils/isBrowser'
import { Layout } from '@types'

export type UsePageProps = {
  scrollElement: HTMLElement | Window | null
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
    rowsOnViewport = 1,
    columnsOnViewport = 1,
    gridOffsetTop = 0,
    gridOffsetLeft = 0,
  } = layout || {}

  const isWindowScroll = isWindow(scrollElement)

  const computeScrollPosition = useCallback(
    (index: number) => {
      const size = horizontal ? itemWidth : itemHeight
      const paddingStart = horizontal ? padding[2] : padding[0]

      const baseScroll = computeScroll({
        index,
        gap,
        rowsOnViewport,
        columnsOnViewport,
        horizontal,
        itemSize: size,
        padding: paddingStart,
      })

      if (isWindowScroll) {
        const offset = horizontal ? gridOffsetLeft : gridOffsetTop
        return baseScroll + offset
      }

      return baseScroll
    },
    [
      horizontal,
      itemHeight,
      itemWidth,
      gap,
      rowsOnViewport,
      columnsOnViewport,
      padding,
      isWindowScroll,
      gridOffsetTop,
      gridOffsetLeft
    ]
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

      if (isWindowScroll) {
        window.scroll(scrollOptions)
      }
      else {
        (scrollElement as HTMLElement).scroll(scrollOptions)
      }
    },
    [scrollElement, horizontal, computeScrollPosition, isWindowScroll]
  )

  const updatePage = useCallback(() => {
    if (!scrollElement || !layout) return
    setPage(getPage({ scrollElement, layout, gap }))
  }, [scrollElement, layout, gap])

  const handleScroll = useCallback(() => {
    if (!scrollElement || !layout) return

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    let currentPosition: number

    if (isWindowScroll) {
      currentPosition = horizontal ? window.scrollX : window.scrollY
    }
    else {
      currentPosition = horizontal
        ? (scrollElement as HTMLElement).scrollLeft
        : (scrollElement as HTMLElement).scrollTop
    }

    const scrollDelta = Math.abs(currentPosition - lastScrollPosition.current)

    if (scrollDelta < 1) return

    lastScrollPosition.current = currentPosition

    setScrolling(true)

    rafRef.current = requestAnimationFrame(() => {
      updatePage()
      rafRef.current = null

      scrollTimeoutRef.current = setTimeout(() => {
        setScrolling(false)
        scrollTimeoutRef.current = null
      }, 150)
    })
  }, [scrollElement, layout, horizontal, updatePage, isWindowScroll])

  useEffect(() => {
    if (scrollElement && layout) {
      updatePage()
    }
  }, [scrollElement, layout, updatePage])

  useEffect(() => {
    if (!scrollElement) return

    const scrollTarget = isWindowScroll ? window : scrollElement
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll)

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll, scrollElement, isWindowScroll])

  return {
    ...page,
    scrolling,
    onScrollTo,
  }
}
