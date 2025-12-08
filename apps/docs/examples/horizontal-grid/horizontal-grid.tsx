import { useVirtualGrid } from '@virtualgrid/lib'

import classes from './horizontal-grid.module.css'

const data = Array.from({ length: 1000 }, (_, i) => i + 1)

export function HorizontalGrid() {
  const { items, styles, gridRef, scrollRef } = useVirtualGrid({
    data,
    gap: 16,
    padding: [16, 16, 16, 16],
    horizontal: true,
  })

  return (
    <div ref={scrollRef} className={classes.container}>
      <div ref={gridRef} className={classes.grid} style={styles}>
        {items?.map((item) => (
          <div key={item} className={classes.card}>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
