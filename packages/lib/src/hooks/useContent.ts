import { CSSProperties, ReactNode, useMemo } from 'react'
import { computeGrid } from '../utils/computeGridProps'
import { GetLayoutReturnType } from '../utils/getLayout'

export type UseContentProps<T> = {
  data: T[]
  itemElement: ReactNode
  gap: number
  layout: GetLayoutReturnType
  page: number
  padding: number[]
  offScreenPages: number
}

export type UseContentReturnType<T> = {
  childrens: T[]
  styles: CSSProperties
}

export function useContent<T>({
  data,
  itemElement,
  gap,
  layout,
  page,
  padding,
  offScreenPages,
}: UseContentProps<T>): UseContentReturnType<T> {
  const { childrens, styles } = useMemo(() => {
    const {
      width,
      paddingTop,
      paddingLeft,
      paddingRight,
      paddingBottom,
      start,
      end
    } = computeGrid({ layout, page, padding, offScreenPages, gap })

    const styles = {
      width,
      paddingTop: `${paddingTop}px`,
      paddingRight: `${paddingRight}px`,
      paddingBottom: `${paddingBottom}px`,
      paddingLeft: `${paddingLeft}px`,
    }

    return {
      childrens: data.slice(start, end),
      styles,
    }
  }, [data, itemElement, offScreenPages, layout, padding, page, gap])

  return {
    childrens,
    styles,
  }
}
