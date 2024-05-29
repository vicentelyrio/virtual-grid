import { useContent } from './useContent'
import { useLayout } from './useLayout'
import { usePage } from './usePage'

export const useVirtualGrid = ({
  diff = 1,
  padding = [0, 0, 0, 0],
  gap,
  data,
  itemElement,
  grid,
  scroll,
  indexKey,
  horizontal = false,
}) => {
  const total = data?.length ?? 0

  const { resizing, layout } = useLayout({
    grid,
    scroll,
    gap,
    padding,
    total,
    horizontal,
  })

  const { page, pageRange, scrolling, onScrollTo } = usePage({
    gap,
    scroll,
    layout,
    padding,
  })

  const { childrens, styles } = useContent({
    data,
    itemElement,
    indexKey,
    layout,
    page,
    padding,
    diff,
    gap,
  })

  return {
    ...layout,
    childrens,
    styles,
    grid,
    scroll,
    page,
    pageRange,
    resizing,
    scrolling,
    onScrollTo,
    mounting: !childrens || !layout || !page,
  }
}

