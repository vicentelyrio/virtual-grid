import { useVirtualGrid } from '@virtual-grid/lib'

import classes from './basic-grid.module.css'

const data = Array(1000).fill(0).map((_, i) => i + 1)

export function BasicGrid() {
  const { items, styles, gridRef, scrollRef } = useVirtualGrid({
    data,
    gap: 16,
    padding: [16, 16, 16, 16],
  })

  return (
    <div ref={scrollRef} className={classes.container}>
      <div
        ref={gridRef}
        style={styles}
        className={classes.grid}>
        {items?.map((item) => (
          <div key={item} className={classes.card}>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
