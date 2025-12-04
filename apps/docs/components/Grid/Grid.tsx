import clsx from 'clsx'
import type { CSSProperties, RefObject } from 'react'

import { Card } from '@components/Card/Card'

import classes from './Grid.module.css'

export type GridProps = {
  animation: number
  horizontal?: boolean
  scrollRef?: RefObject<HTMLDivElement | null>
  gridRef?: RefObject<HTMLDivElement | null>
  styles?: CSSProperties
  data: number[]
}

export function Grid({
  horizontal,
  animation,
  scrollRef,
  gridRef,
  styles,
  data,
}: GridProps) {
  return (
    <div
      className={clsx([classes.scroll, horizontal && classes.scrollHorizontal])}
      ref={scrollRef}>
      <div
        style={styles}
        className={clsx([classes.grid, horizontal && classes.gridHorizontal])}
        ref={gridRef}>
        {data.map((index: number) => (
          <Card
            index={index}
            key={index}
            styles={{ animationDuration: `${animation/10}s` }}
          />
        ))}
      </div>
    </div>
  )
}
