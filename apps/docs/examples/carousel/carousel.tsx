import clsx from 'clsx'
import { useVirtualGrid } from '@virtual-grid/lib'

import classes from './carousel.module.css'
import { useMemo } from 'react'

const data = Array(1000).fill(0).map((_, i) => i + 1)

export function Carousel() {
  const {
    items,
    styles,
    gridRef,
    scrollRef,
    page,
    pages,
    onScrollTo
  } = useVirtualGrid({
    data,
    horizontal: true,
    gap: 16,
    padding: [0, 0, 0, 0],
  })

  const navigation = useMemo(() => {
    if (!page || !pages) return []
    return getPaginationArray(page, pages, 2)
  }, [page, pages])

  return (
    <div className={classes.container}>
      <div className={classes.carousel}>
        <div className={classes.scroll} ref={scrollRef}>
          <div className={classes.grid} ref={gridRef} style={styles}>
            {items?.map((item) => (
              <div key={item} className={classes.card}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className={classes.controls}>
          <div className={classes.navigation}>
            <div className={classes.fixed}>
              <button
                className={clsx([classes.nav, 1 === page && classes.disabled])}
                onClick={() => onScrollTo(1)}>
                first
              </button>
              <div
                className={clsx([classes.nav, 1 === page && classes.disabled])}
                onClick={() => onScrollTo(page - 1)}>
                prev
              </div>
            </div>
            {navigation.map((item) => (
              <button
                key={item}
                className={clsx([classes.nav, item === page && classes.active])}
                onClick={() => onScrollTo(item)}>
                {item}
              </button>
            ))}
            <div className={classes.fixed}>
              <button
                className={clsx([classes.nav, pages === page && classes.disabled])}
                onClick={() => onScrollTo(page + 1)}>
                next
              </button>
              <button
                className={clsx([classes.nav, pages === page && classes.disabled])}
                onClick={() => onScrollTo(pages)}>
                last
              </button>
            </div>
          </div>
          <h6>{page} of {pages}</h6>
        </div>
      </div>
    </div>
  )
}

function getPaginationArray(currentPage: number, totalPages: number, pad: number) {
  const amount = pad * 2 + 1

  // left pad
  if (currentPage <= pad) {
    return Array.from({ length: amount }, (_, i) => i + 1)
  }

  // right pad
  if (currentPage >= totalPages - pad) {
    const start = totalPages - (amount - 1)
    return Array.from({ length: amount }, (_, i) => start + i)
  }

  const start = currentPage - pad
  return Array.from({ length: amount }, (_, i) => start + i)
}
