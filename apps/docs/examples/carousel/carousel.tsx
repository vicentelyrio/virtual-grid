import clsx from 'clsx'
import { useVirtualGrid } from '@virtual-grid/lib'

import classes from './carousel.module.css'

const data = Array(1000).fill(0).map((_, i) => i + 1)

export function Carousel() {
  const {
    items,
    styles,
    gridRef,
    scrollRef,
    page = 1,
    pages = 1,
    onScrollTo
  } = useVirtualGrid({
    data,
    horizontal: true,
    gap: 16,
    padding: [0, 0, 0, 0],
  })

  return (
    <div className={classes.container}>
      <div className={classes.carousel}>
        <div ref={scrollRef} className={classes.scroll}>
          <div ref={gridRef} className={classes.grid} style={{}}>
            {items?.map((item) => (
              <div key={item} className={classes.card}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className={classes.controls}>
          <div className={classes.navigation}>
            {getPaginationArray(page, pages, 2).map((item) => (
              <div
                key={item}
                className={clsx([classes.dot, item + 1 === page && classes.active])}
                onClick={() => onScrollTo(item + 1)}
              />
            ))}
          </div>
          <h6>{page} of {pages}</h6>
        </div>
      </div>
    </div>
  )
}

function getPaginationArray(currentPage: number, totalPages: number, pad: number) {
  const amount = pad * 2 + 1
  const start = Math.max(0, currentPage - pad)
  const end = Math.min(totalPages - 1, currentPage + pad)

  return Array(amount).fill(0).map((_, i) => i)
}
