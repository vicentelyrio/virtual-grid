// import { useContent } from './useContent'
// import { useLayout } from './useLayout'
// import { usePage } from './usePage'

import { ReactNode } from 'react'

export type UseVirtualGridProps = {
  diff: number
  padding: number[]
  gap: number,
  data: unknown[],
  scroll: boolean
  indexKey: number
  horizontal: boolean
  itemElement: ReactNode
  gridElement: ReactNode
}

export const useVirtualGrid = ({
  // data,
  // itemElement,
  // gridElement,
  // diff = 1,
  // padding = [0, 0, 0, 0],
  // gap,
  // scroll,
  // indexKey,
  // horizontal = false,
}: UseVirtualGridProps) => {
//   const total = data?.length ?? 0
//
//   const { resizing, layout } = useLayout({
//     grid,
//     scroll,
//     gap,
//     padding,
//     total,
//     horizontal,
//   })
//
//   const { page, pageRange, scrolling, onScrollTo } = usePage({
//     gap,
//     scroll,
//     layout,
//     padding,
//   })
//
//   const { childrens, styles } = useContent({
//     data,
//     itemElement,
//     indexKey,
//     layout,
//     page,
//     padding,
//     diff,
//     gap,
//   })
//
//   return {
//     ...layout,
//     childrens,
//     styles,
//     grid,
//     scroll,
//     page,
//     pageRange,
//     resizing,
//     scrolling,
//     onScrollTo,
//     mounting: !childrens || !layout || !page,
//   }
  return { content: <h1>virtual</h1> }
}

