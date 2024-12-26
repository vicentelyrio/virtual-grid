import { useMemo, useState } from 'react'
import { useVirtualGrid } from '@virtual-grid/lib'

import classes from './Demo.module.css'

interface Controls {
  itemCount: number
  gap: number
  padding: number
  offScreenPages: number
  horizontal: boolean
  virtualize: boolean
  images: boolean
}

export function Demo() {
  const [controls, setControls] = useState<Controls>({
    itemCount: 1000,
    gap: 20,
    padding: 20,
    offScreenPages: 1,
    horizontal: false,
    virtualize: true,
    images: true
  })

  const {
    itemCount,
    gap,
    padding,
    offScreenPages,
    horizontal,
    virtualize,
    images
  } = controls

  const data = useMemo(() => (
    Array(itemCount).fill(true).map((_, index) => index)
  ), [itemCount])

  const {
    items = [],
    styles,
    gridRef,
    scrollRef,
  } = useVirtualGrid<number>({
    data,
    gap,
    padding: [padding, padding, padding, padding],
    horizontal,
    offScreenPages,
  })

  return (
    <div className={classes.scroll} ref={scrollRef}>
      <div
        style={virtualize ? styles : {}}
        className={horizontal ? classes.gridHorizontal : classes.grid}
        ref={gridRef}>
        {(virtualize ? items : data).map((index: number) => (
          <Card
            index={index}
            key={index}
            src={images ? `https://robohash.org/${index}` : undefined}
          />
        ))}
      </div>
    </div>
  )
}

function Card({ index = 0, src }: { index?: number, src?: string }) {
  return (
    <div className={classes.card}>
      {src ? <img src={src} alt={`${index + 1}`} /> : index + 1}
    </div>
  )
}

