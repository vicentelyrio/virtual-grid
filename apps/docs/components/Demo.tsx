import { useMemo, useState } from 'react'
import { useVirtualGrid } from '@virtual-grid/lib'

import classes from './Demo.module.css'

interface Controls {
  itemCount: number
  gap: number
  padding: number
  offScreenPages: number
  horizontal: boolean
  virtualize: boolean
  images: boolean
}

export function Demo() {
  const [controls, setControls] = useState<Controls>({
    itemCount: 1000,
    gap: 20,
    padding: 20,
    offScreenPages: 1,
    horizontal: false,
    virtualize: true,
    images: true
  })

  const {
    itemCount,
    gap,
    padding,
    offScreenPages,
    horizontal,
    virtualize,
    images
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
      <div className={classes.controls}>
        <div className={classes.sticky}>
          <fieldset className={classes.fieldset}>
            <label className={classes.label}>
              <span className={classes.labelText}>
                Item Count: {controls.itemCount}
              </span>
              <input
                className={classes.range}
                type="range"
                min="100"
                max="10000"
                step="100"
                list="markers"
                value={controls.itemCount}
                onChange={(e) => setControls(prev => ({
                  ...prev,
                  itemCount: parseInt(e.target.value)
                }))}
              />
              <datalist id="markers">
                <option value="1000"></option>
                <option value="2000"></option>
                <option value="3000"></option>
                <option value="4000"></option>
                <option value="5000"></option>
                <option value="6000"></option>
                <option value="7000"></option>
                <option value="8000"></option>
                <option value="9000"></option>
              </datalist>
            </label>
          </fieldset>

          <fieldset className={classes.fieldset}>
            <label className={classes.label}>
              <span className={classes.labelText}>
                Gap: {controls.gap}px
              </span>
              <input
                className={classes.range}
                type="range"
                min="0"
                max="40"
                value={controls.gap}
                onChange={(e) => setControls(prev => ({
                  ...prev,
                  gap: parseInt(e.target.value)
                }))}
              />
            </label>
          </fieldset>

          <fieldset className={classes.fieldset}>
            <label className={classes.label}>
              <span className={classes.labelText}>
                Padding: {controls.padding}px
              </span>
              <input
                type="range"
                min="0"
                max="40"
                value={controls.padding}
                onChange={(e) => setControls(prev => ({
                  ...prev,
                  padding: parseInt(e.target.value)
                }))}
                className="w-full"
              />
            </label>
          </fieldset>

          <fieldset className={classes.fieldset}>
            <label className={classes.label}>
              <span className={classes.labelText}>
                Off-screen Pages: {controls.offScreenPages}
              </span>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={controls.offScreenPages}
                onChange={(e) => setControls(prev => ({
                  ...prev,
                  offScreenPages: parseFloat(e.target.value)
                }))}
                className="w-full"
              />
            </label>
          </fieldset>

          <fieldset className={classes.fieldset}>
            <label className={classes.label}>
              <span className={classes.labelText}>
                Virtualize
              </span>
              <input
                type="checkbox"
                checked={controls.virtualize}
                onChange={(e) => setControls(prev => ({
                  ...prev,
                  virtualize: e.target.checked
                }))}
              />
            </label>
          </fieldset>

          <fieldset className={classes.fieldset}>
            <input
              type="checkbox"
              id="horizontal"
              checked={controls.horizontal}
              onChange={(e) => setControls(prev => ({
                ...prev,
                horizontal: e.target.checked
              }))}
            />
            <label htmlFor="horizontal" className={classes.label}>
              Horizontal Scroll
            </label>
          </fieldset>
        </div>
      </div>

      <div className={classes.scroll} ref={scrollRef}>
        <div
          style={virtualize ? styles : {}}
          className={horizontal ? classes.gridHorizontal : classes.grid}
          ref={gridRef}>
          {(virtualize ? items : data).map((index: number) => (
            <Card
              index={index}
              key={index}
              src={images ? `https://robohash.org/${index}` : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Card({ index = 0, src }: { index?: number, src?: string }) {
  return (
    <div className={classes.card}>
      {src ? <img src={src} alt={`${index + 1}`} /> : index + 1}
    </div>
  )
}

