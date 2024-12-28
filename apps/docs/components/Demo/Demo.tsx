import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { useVirtualGrid } from '@virtual-grid/lib'

import { Grid } from '../Grid/Grid'
import { Controls } from '../Controls/Controls'

import classes from './Demo.module.css'

export function Demo() {
  const [controls, setControls] = useState<Controls>({
    itemCount: 1000,
    gap: 20,
    padding: 20,
    offScreenPages: 1,
    horizontal: false,
    virtualize: true,
  })

  const {
    itemCount,
    gap,
    padding,
    offScreenPages,
    horizontal,
    virtualize,
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

      <div
        className={clsx([classes.scroll, horizontal && classes.scrollHorizontal])}
        ref={scrollRef}>
        <Grid
          data={virtualize ? items : data}
          styles={virtualize ? styles : {}}
          gridRef={gridRef}
          scrollRef={scrollRef}
          horizontal={horizontal}
        />
      </div>

      <p className={classes.footer} style={{ padding: styles?.paddingLeft }}>
        images from <a href="https://robohash.org/">robohash.org</a>
      </p>
    </div>
  )
}
