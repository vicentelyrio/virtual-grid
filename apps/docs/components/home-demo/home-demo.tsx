import { useVirtualGrid } from '@virtualgrid/lib'
import { Card } from '@components'
import classes from './home-demo.module.css'

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
