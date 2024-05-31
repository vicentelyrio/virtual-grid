import { type ReactNode, useMemo } from 'react'
import { useVirtualGrid } from '@virtual-grid/lib'

import './style.css'

export type DemoProps = {
  items: number
  virtualize: boolean
  horizontal: boolean
}

export function Demo({ items, virtualize, horizontal }: DemoProps) {
  const data = useMemo(() => (
    Array(items).fill(true).map((_, index) => index)
  ), [items])

  const { childrens } = useVirtualGrid({
    gap: 20,
    padding: [20, 20, 20, 20],
    data,
    horizontal,
    itemElement: <Card />,
    gridElement: <Grid horizontal={horizontal} />
  })

  if (virtualize) return childrens

  return (
    <Grid horizontal={horizontal}>
      {data.map((index) => (
        <Card index={index} key={index} />
      ))}
    </Grid>
  )
}

function Card({ index }: { index: number }) {
  return (
    <div className="card">
      {index + 1}
    </div>
  )
}

function Grid({ horizontal, children }: { horizontal: boolean, children: ReactNode }) {
  return (
    <div className={horizontal ? 'grid horizontal' : 'grid'}>
      {children}
    </div>
  )
}
