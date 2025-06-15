import { useMemo, useState } from 'react'
import { useVirtualGrid } from '@virtual-grid/lib'

import { Grid } from '@components/Grid/Grid'
import { Controls } from '@components/Controls/Controls'

import classes from './Demo.module.css'

export function Demo() {
  const [controls, setControls] = useState<Controls>({
    itemCount: 1000,
    gap: 20,
    padding: 20,
    offScreenPages: 1,
    horizontal: false,
    virtualize: true,
    animation: 0,
  })

  const {
    itemCount,
    gap,
    padding,
    offScreenPages,
    horizontal,
    virtualize,
    animation,
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
    <div className={classes.container}>
      <Controls
        controls={controls}
        setControls={setControls}
      />

      <Grid
        data={virtualize ? items : data}
        styles={virtualize ? styles : {}}
        gridRef={gridRef}
        scrollRef={scrollRef}
        horizontal={horizontal}
        animation={animation}
      />

      <p className={classes.footer}>
        images from <a href="https://robohash.org/">robohash.org</a>
      </p>
    </div>
  )
}
