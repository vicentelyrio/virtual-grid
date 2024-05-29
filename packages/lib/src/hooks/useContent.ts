// import { cloneElement, useMemo } from 'react'
//
// export const MAX_SIZE = 8047500
//
// export const useContent = ({
//   data,
//   itemElement,
//   indexKey,
//   gap,
//   layout,
//   page,
//   padding,
//   diff,
// }) => {
//   const { childrens, styles } = useMemo(() => {
//     const { width, paddingTop, paddingLeft, paddingRight, paddingBottom, start, end } =
//       computeGridProps({ layout, page, padding, diff, gap })
//
//     const styles = {
//       width,
//       paddingTop: `${paddingTop}px`,
//       paddingRight: `${paddingRight}px`,
//       paddingBottom: `${paddingBottom}px`,
//       paddingLeft: `${paddingLeft}px`,
//     }
//
//     return {
//       childrens: data.slice(start, end).map(mapDataList(itemElement, indexKey)),
//       styles,
//     }
//   }, [data, itemElement, indexKey, diff, layout, padding, page, gap])
//
//   return {
//     childrens,
//     styles,
//   }
// }
//
// const computeGridProps = ({ layout, page, padding, diff, gap }) => {
//   if (!layout || !page) {
//     return {}
//   }
//
//   const {
//     itemHeight,
//     itemWidth,
//     itemsPerPage,
//     pages,
//     rows,
//     rowsOnViewport,
//     columns,
//     columnsOnViewport,
//     horizontal,
//     gridWidth,
//   } = layout
//
//   const minBoundary = Math.max(0, page - diff)
//   const maxBoundary = Math.min(pages, page + 1 + diff)
//
//   const itemW = itemWidth + gap
//   const itemH = itemHeight + gap
//
//   const padT = padding[0]
//   const padR = padding[1]
//   const padB = padding[2]
//   const padL = padding[3]
//
//   const start = itemsPerPage * minBoundary
//   const end = itemsPerPage * maxBoundary
//
//   const visibleHeight = (maxBoundary - minBoundary) * itemH
//   const visibleWidth = (maxBoundary - minBoundary + 1) * itemW
//
//   // padding top
//   const ptTotal = minBoundary * rowsOnViewport * itemH
//   const ptLimit = Math.max(0, ptTotal)
//   const pt = horizontal ? padT : ptLimit + padT
//
//   // padding bottom
//   const pbTotal = (rows - maxBoundary * rowsOnViewport) * itemH
//   const pbLimit = Math.max(0, pbTotal)
//   const pbMax = Math.min(pbLimit, MAX_SIZE - pt - visibleHeight)
//   const pb = horizontal ? padB : pbMax + padB
//
//   // padding left
//   const plTotal = minBoundary * columnsOnViewport * itemW
//   const plLimit = Math.max(0, plTotal)
//   const pl = horizontal ? plLimit + padL : padL
//
//   // padding right
//   const prTotal = (columns - maxBoundary * columnsOnViewport) * itemW
//   const prLimit = Math.max(0, prTotal)
//   const prMax = Math.min(prLimit, MAX_SIZE - pl - visibleWidth)
//   const pr = horizontal ? prMax + padR : padR
//
//   return {
//     start,
//     end,
//     width: horizontal ? gridWidth : 'auto',
//     paddingTop: pt ?? padT,
//     paddingRight: pr ?? padR,
//     paddingBottom: pb ?? padB,
//     paddingLeft: pl ?? padL,
//   }
// }
//
// const mapDataList = (itemElement, indexKey) => (props) =>
//   cloneElement(itemElement, {
//     key: `index-${props[indexKey] ?? props?.index}`,
//     ...props,
//   })
//
