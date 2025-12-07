import { useVirtualGrid } from '@virtual-grid/lib'
import { Card } from '@components/Card/Card'
import classes from './HomeDemo.module.css'

const data = Array(1000).fill(true).map((_, index) => index)

export function HomeDemo() {
  const {
    items = [],
    styles,
    gridRef,
  } = useVirtualGrid<number>({
    data,
    gap: 20,
    padding: [20, 20, 20, 20],
    offScreenPages: 1,
  })

  return (
    <div
      style={styles}
      className={classes.grid}
      ref={gridRef}>
      {items.map((index: number) => (
        <Card
          index={index}
          key={index}
          styles={{ animationDuration: '1s' }}
        />
      ))}
    </div>
  )
}
