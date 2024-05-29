import { useCallback, useEffect, useState, useMemo } from 'react'
import nanobounce from 'nanobounce'
import isEqual from 'react-fast-compare'

export const useLayout = ({ grid, scroll, gap, padding, total, horizontal }) => {
  const debounce = useMemo(() => nanobounce(500), [])
  const [layout, setLayout] = useState()
  const [resizing, setResizing] = useState(false)

  // Recalculate screen
  const calculateLayout = useCallback(() => {
    const newBounds = detectBounds({ scroll, grid })

    const newLayout = detectLayout({
      horizontal,
      grid,
      gap,
      padding,
      bounds: newBounds,
      total,
    })

    if (!isEqual(newLayout, layout)) setLayout(newLayout)
  }, [gap, grid, horizontal, padding, scroll, total, layout])

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
    if (!grid || !scroll) return

    window?.addEventListener('resize', handleResize)

    return () => window?.removeEventListener('resize', handleResize)
  }, [handleResize, grid, scroll])

  // Initial Layout setup
  useEffect(() => {
    if (!grid || !scroll) return

    debounce(calculateLayout)
  }, [debounce, grid, scroll, layout, calculateLayout])

  return {
    resizing,
    layout,
  }
}

/*
 * Detects the boundaries of the visible area
 * */
const detectBounds = ({ grid, scroll }) => {
  const scrollBounds = getRect(scroll)
  const containerBounds = getRect(grid?.parentNode)

  if (!scrollBounds.isWindow) {
    return scrollBounds
  }

  const { innerHeight, innerWidth } = window ?? {}
  const { width, height } = containerBounds

  return {
    ...scrollBounds,
    width: innerWidth < width ? innerWidth : width,
    height: innerHeight < height ? innerHeight : height,
  }
}

/*
 * Detects the layout of the Grid and Items
 * */
const detectLayout = ({ grid, total, bounds, gap, padding, horizontal }) => {
  try {
    const { width, height } = getRect(grid)

    const firstItem = grid?.children?.item(0)

    if (!firstItem) return null

    const item = getRect(firstItem)
    const itemHeight = item.height ?? 0
    const itemWidth = item.width ?? 0

    const rowsOnViewport = Math.max(Math.floor(bounds?.height / itemHeight) || 1, 1)
    const columnsOnViewport = Math.max(Math.floor(bounds?.width / itemWidth) || 1, 1)

    const itemsPerRow = Math.max(Math.round(width / itemWidth) || 1, 1)
    const itemsPerColumn = Math.max(Math.round(height / itemHeight) || 1, 1)

    const itemsPerPage = horizontal
      ? columnsOnViewport * itemsPerColumn
      : rowsOnViewport * itemsPerRow

    const { height: gridHeight, width: gridWidth } = calculateGridSize({
      horizontal,
      height,
      width,
      itemsPerRow,
      itemsPerColumn,
      itemHeight,
      itemWidth,
      total,
      padding,
      gap,
    })

    const rows = Math.ceil(gridHeight / (itemHeight + gap)) || 0
    const columns = Math.floor(gridWidth / (itemWidth + gap)) || 0

    const pages = horizontal
      ? Math.ceil(columns / columnsOnViewport)
      : Math.ceil(rows / rowsOnViewport)

    return {
      scrollWidth: bounds?.width,
      scrollHeight: bounds?.height,
      rowsOnViewport,
      rows,
      columnsOnViewport,
      columns,
      total,
      pages,
      itemsPerRow,
      itemsPerColumn,
      itemsPerPage,
      itemHeight,
      itemWidth,
      gridHeight,
      gridWidth,
      horizontal,
    }
  } catch (e) {
    console.error('Layout creation error: ', e)
    return null
  }
}

/*
 * Calculate the Grid Size
 * */
const calculateGridSize = ({
  horizontal,
  height,
  width,
  itemsPerRow,
  itemsPerColumn,
  itemHeight,
  itemWidth,
  total,
  padding,
  gap,
}) => {
  if (horizontal) {
    return {
      height,
      width: computeSize({
        total,
        itemsPerPage: itemsPerColumn,
        itemSize: itemWidth,
        gap,
        pad: padding[1] + padding[3],
      }),
    }
  }

  return {
    width,
    height: computeSize({
      total,
      itemsPerPage: itemsPerRow,
      itemSize: itemHeight,
      gap,
      pad: padding[0] + padding[2],
    }),
  }
}

const computeSize = ({ total, itemsPerPage, itemSize, pad, gap }) => {
  const itemsCount = Math.max(total, itemsPerPage) / itemsPerPage
  const itemsSum = itemSize * itemsCount
  const gapSum = (itemsCount - 1) * gap

  return gapSum + pad + itemsSum
}

/*
 * Get rect from element or window
 * */
const getRect = (el) => {
  if (el === window) {
    return {
      height: el.innerHeight,
      width: el.innerWidth,
      isWindow: true,
    }
  }

  return el?.getBoundingClientRect() ?? {}
}

