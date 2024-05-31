import { useMemo, useRef } from 'react'
import { useVirtualGrid } from '@virtual-grid/lib'

import './style.css'

export type DemoProps = {
  items: number
  virtualize: boolean
  horizontal: boolean
}

export function Demo({ items, virtualize, horizontal }: DemoProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const data = useMemo(() => (
    Array(items).fill(true).map((_, index) => index)
  ), [items])

  const { childrens, ...rest } = useVirtualGrid<number>({
    gap: 20,
    padding: [20, 20, 20, 20],
    data,
    horizontal,
    itemElement: <Card />,
    gridElement: gridRef.current,
    scrollElement: scrollRef.current,
  })

  console.log(rest)

  return (
    <div className="scroll" ref={scrollRef}>
      <div className={horizontal ? 'grid horizontal' : 'grid'} ref={gridRef}>
        {(virtualize ? childrens : data).map((index) => (
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

