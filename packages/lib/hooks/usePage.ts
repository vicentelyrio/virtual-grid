import { useCallback, useEffect, useState, useMemo } from 'react'
import nanobounce from 'nanobounce'

export const usePage = ({ scroll, layout, gap, padding }) => {
  const debounce = useMemo(() => nanobounce(20), [])
  const [page, setPage] = useState({ page: 1, pageRange: [0, 0] })
  const [scrolling, setScrolling] = useState(false)
  const { itemHeight = 0, itemWidth = 0, horizontal, itemsPerPage } = layout || {}

  // Scroll To Card
  const onScrollTo = useCallback(
    (index) => {
      const props = { left: 0, top: 0 }

      if (horizontal) {
        Object.assign(props, {
          left: computeScroll({
            index,
            gap,
            itemsPerPage,
            itemSize: itemWidth,
            pad: padding[2],
          }),
        })
      } else {
        Object.assign(props, {
          top: computeScroll({
            index,
            gap,
            itemsPerPage,
            itemSize: itemHeight,
            pad: padding[0],
          }),
        })
      }

      scroll.scroll({ ...props, behavior: 'smooth' })
    },
    [horizontal, itemHeight, itemWidth, scroll, gap, padding, itemsPerPage]
  )

  // Scroll handler
  const handleScroll = useCallback(() => {
    setScrolling(true)
    debounce(() => {
      setPage(detectPage({ scroll, layout, gap }))
      setScrolling(false)
    })
  }, [scroll, debounce, layout, gap])

  useEffect(() => {
    if (!scroll) return

    scroll.addEventListener('scroll', handleScroll)

    return () => scroll.removeEventListener('scroll', handleScroll)
  }, [handleScroll, scroll])

  // Initial Setup
  useEffect(() => {
    if (!page && !!layout) {
      setPage(detectPage({ scroll, layout, gap }))
    }
  }, [layout, scroll, page, gap])

  return {
    ...page,
    scrolling,
    onScrollTo,
  }
}

const computeScroll = ({ index, itemSize, pad, gap, itemsPerPage }) => {
  const itemsSum = itemSize * itemsPerPage * (index - 1)
  const gapSum = itemsPerPage * gap * (index - 1)
  return gapSum + pad + itemsSum
}

const detectPage = ({ scroll, layout, gap }) => {
  try {
    const { scrollTop, scrollLeft } = getScrollProps({ scroll })

    const {
      itemHeight,
      itemWidth,
      rowsOnViewport,
      columnsOnViewport,
      horizontal,
      scrollWidth,
      scrollHeight,
    } = layout || {}

    const verticalProps = {
      screenStart: scrollTop,
      itemSize: itemHeight,
      scrollSize: scrollHeight,
      itemsOnPage: rowsOnViewport,
      gap,
    }

    const horizontalProps = {
      screenStart: scrollLeft,
      itemSize: itemWidth,
      scrollSize: scrollWidth,
      itemsOnPage: columnsOnViewport,
      gap,
    }

    return detectPageSizes(horizontal ? horizontalProps : verticalProps)
  } catch (e) {
    console.error(e)
  }
}

const detectPageSizes = ({ screenStart, scrollSize, itemSize, itemsOnPage, gap }) => {
  const screenCenter = screenStart + scrollSize / 2
  const screenEnd = screenStart + scrollSize

  const start = roundTo(screenStart / (itemSize + gap), 1)
  const end = roundTo(screenEnd / (itemSize + gap), 1)
  const index = roundTo(screenCenter / (itemSize + gap), 1)
  const page = roundTo(end / itemsOnPage, 0)

  return {
    index,
    page,
    pageRange: [start, end],
  }
}

const getScrollProps = ({ scroll }) => {
  if (scroll === window) {
    return {
      scrollTop: scroll?.scrollY,
      scrollLeft: scroll?.scrollX,
    }
  }

  const { scrollTop, scrollLeft } = scroll

  return {
    scrollTop,
    scrollLeft,
  }
}

function roundTo(input, digits) {
  const rounder = Math.pow(10, digits)
  return Math.round(input * rounder) / rounder
}

