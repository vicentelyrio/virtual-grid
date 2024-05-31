import { useCallback, useEffect, useState } from 'react'
import { debounce } from 'ts-debounce'
import { GetLayoutReturnType } from '../utils/getLayout'
import { computeScroll } from '../utils/computeScroll'
import { GetPageReturnType, getPage } from '../utils/getPage'

export type UsePageProps = {
  scrollElement: HTMLElement | null
  layout: GetLayoutReturnType
  gap: number
  padding: number[]
}

export function usePage({
  scrollElement,
  layout,
  gap,
  padding
}: UsePageProps) {
  const [page, setPage] = useState<GetPageReturnType>({ index: 1, page: 1, pageRange: [0, 0] })
  const [scrolling, setScrolling] = useState(false)
  const {
    itemHeight = 0,
    itemWidth = 0,
    horizontal,
    itemsPerPage = 0
  } = layout || {}

  // Scroll To Card
  const onScrollTo = useCallback((index: number) => {
    const props = { left: 0, top: 0 }

    if (horizontal) {
      Object.assign(props, {
        left: computeScroll({
          index,
          gap,
          itemsPerPage,
          itemSize: itemWidth,
          padding: padding[2],
        }),
      })
    } else {
      Object.assign(props, {
        top: computeScroll({
          index,
          gap,
          itemsPerPage,
          itemSize: itemHeight,
          padding: padding[0],
        }),
      })
    }

    scrollElement?.scroll({ ...props, behavior: 'smooth' })
  }, [
    horizontal,
    itemHeight,
    itemWidth,
    scrollElement,
    gap,
    padding,
    itemsPerPage
  ])

  // Scroll handler
  const handleScroll = useCallback(() => {
    setScrolling(true)
    debounce(() => {
      setPage(getPage({ scrollElement, layout, gap }))
      setScrolling(false)
    })
  }, [scrollElement, debounce, layout, gap])

  useEffect(() => {
    if (!scrollElement) return

    scrollElement.addEventListener('scroll', handleScroll)

    return () => scrollElement.removeEventListener('scroll', handleScroll)
  }, [handleScroll, scrollElement])

  // Initial Setup
  useEffect(() => {
    if (!page && !!layout) {
      setPage(getPage({ scrollElement, layout, gap }))
    }
  }, [layout, scrollElement, page, gap])

  return {
    ...page,
    scrolling,
    onScrollTo,
  }
}

