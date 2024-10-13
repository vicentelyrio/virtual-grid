import { CSSProperties, useMemo } from 'react'
import { computeGrid } from '../utils/computeGridProps'
import { Layout } from '../types'

export type UseContentProps<T> = {
  data: T[]
  gap: number
  layout: Layout
  page: number
  padding: number[]
  offScreenPages: number
}

export type UseContentReturnType<T> = {
  items: T[]
  styles: CSSProperties
}

export function useContent<T>({
  data,
  gap,
  layout,
  page,
  padding,
  offScreenPages,
}: UseContentProps<T>): UseContentReturnType<T> {
  const { items, styles } = useMemo(() => {
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
      paddingTop: `${paddingTop ?? 0}px`,
      paddingRight: `${paddingRight ?? 0}px`,
      paddingBottom: `${paddingBottom ?? 0}px`,
      paddingLeft: `${paddingLeft ?? 0}px`,
    }

    return {
      items: data.slice(start, end),
      styles,
    }
  }, [data, offScreenPages, layout, padding, page, gap])

  return {
    items,
    styles,
  }
}
