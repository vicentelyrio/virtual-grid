import { useMemo } from 'react'
import { useVirtualGrid } from '@virtual-grid/lib'

import './style.css'

export type DemoProps = {
  count: number
  virtualize: boolean
  horizontal: boolean
  offScreenPages: number
}

export function Demo({ count, virtualize, horizontal, offScreenPages }: DemoProps) {
  const data = useMemo(() => (
    Array(count).fill(true).map((_, index) => index)
  ), [count])

  const {
    items = [],
    styles,
    gridRef,
    scrollRef,
  } = useVirtualGrid<number>({
    gap: 20,
    padding: [20, 20, 20, 20],
    data,
    horizontal,
    offScreenPages,
  })

  return (
    <div className="scroll" ref={scrollRef}>
      <div
        style={virtualize ? styles : {}}
        className={horizontal ? 'grid horizontal' : 'grid'}
        ref={gridRef}>
        {(virtualize ? items : data).map((index: number) => (
          <Card index={index} key={index} />
        ))}
      </div>
    </div>
  )
}

function Card({ index = 0 }: { index?: number }) {
  return (
    <div className="card">
      {index + 1}
    </div>
  )
}

