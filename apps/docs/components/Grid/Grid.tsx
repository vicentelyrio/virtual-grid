import clsx from 'clsx'
import type { CSSProperties, RefObject } from 'react'

import classes from './Grid.module.css'

export type GridProps = {
  horizontal: boolean
  scrollRef?: RefObject<HTMLDivElement | null>
  gridRef?: RefObject<HTMLDivElement | null>
  styles?: CSSProperties
  data: number[]
}

export function Grid({
  horizontal,
  scrollRef,
  gridRef,
  styles,
  data,
}: GridProps) {
  return (
    <div className={classes.container}>
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
              src={`https://robohash.org/${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Card({ index = 0, src }: { index?: number, src?: string }) {
  return (
    <div className={classes.card}>
      <img src={src} alt={`${index + 1}`} />
      <p className={classes.cardLabel}>{index + 1}</p>
    </div>
  )
}
