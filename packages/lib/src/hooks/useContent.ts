import { CSSProperties, useMemo } from 'react'
import { computeGrid } from '@utils/computeGrid'
import type { Layout, Styles } from '@types'

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

    const styles: Styles = {
      width: typeof width === 'string' ? width : numWithFallback(width),
      paddingTop: numWithFallback(paddingTop),
      paddingRight: numWithFallback(paddingRight),
      paddingBottom: numWithFallback(paddingBottom),
      paddingLeft: numWithFallback(paddingLeft),
      gap: numWithFallback(gap),
    }

    return {
      items: (isNaN(start) || isNaN(end)) ? data : data?.slice(start, end),
      styles,
    }
  }, [data, offScreenPages, layout, padding, page, gap])

  return {
    items,
    styles: removeUndefined(styles),
  }
}

function numWithFallback(num: number) {
  return isNaN(num) ? undefined : `${num}px`
}

function removeUndefined(obj: Styles): Styles {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))
}
