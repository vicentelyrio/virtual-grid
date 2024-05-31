import { useMemo } from 'react'
import { mapDataList } from '../utils/mapDataList'
import { computeGrid } from '../utils/computeGridProps'
import { GetLayoutReturnType } from '../utils/getLayout'

export type UseContentProps = {
  data: unknown[]
  itemElement: HTMLElement
  indexKey: string
  gap: number
  layout: GetLayoutReturnType
  page: number
  padding: number[]
  diff: number
}

export type UseContentReturnType = {
  childrens: unknown[]
  styles: unknown
}

export function useContent({
  data,
  itemElement,
  indexKey,
  gap,
  layout,
  page,
  padding,
  diff,
}: UseContentProps): UseContentReturnType {
  const { childrens, styles } = useMemo(() => {
    const { width, paddingTop, paddingLeft, paddingRight, paddingBottom, start, end } =
      computeGrid({ layout, page, padding, diff, gap })

    const styles = {
      width,
      paddingTop: `${paddingTop}px`,
      paddingRight: `${paddingRight}px`,
      paddingBottom: `${paddingBottom}px`,
      paddingLeft: `${paddingLeft}px`,
    }

    return {
      childrens: data.slice(start, end).map(mapDataList(itemElement, indexKey)),
      styles,
    }
  }, [data, itemElement, indexKey, diff, layout, padding, page, gap])

  return {
    childrens,
    styles,
  }
}
