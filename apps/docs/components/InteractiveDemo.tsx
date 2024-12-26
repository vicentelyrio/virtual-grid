'use client'

import { useMemo, useState } from 'react'
import { useVirtualGrid } from '@virtual-grid/lib'

interface Controls {
  itemCount: number
  gap: number
  padding: number
  offScreenPages: number
  horizontal: boolean
  virtualize: boolean
}

export function InteractiveDemo() {
  const [controls, setControls] = useState<Controls>({
    itemCount: 1000,
    gap: 20,
    padding: 20,
    offScreenPages: 1,
    horizontal: false,
    virtualize: true
  })

  const data = useMemo(() => (
    Array(controls.itemCount).fill(true).map((_, index) => index)
  ), [controls.itemCount])

  const {
    items = [],
    styles,
    gridRef,
    scrollRef,
  } = useVirtualGrid<number>({
    data,
    gap: controls.gap,
    padding: [controls.padding, controls.padding, controls.padding, controls.padding],
    horizontal: controls.horizontal,
    offScreenPages: controls.offScreenPages,
  })

  return (
    <div className="flex gap-6">
      {/* Control Panel */}
      <div className="w-64 flex flex-col gap-4 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium">Controls</h3>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Item Count: {controls.itemCount}
            <input
              type="range"
              min="100"
              max="10000"
              value={controls.itemCount}
              onChange={(e) => setControls(prev => ({
                ...prev,
                itemCount: parseInt(e.target.value)
              }))}
              className="w-full"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Gap: {controls.gap}px
            <input
              type="range"
              min="0"
              max="40"
              value={controls.gap}
              onChange={(e) => setControls(prev => ({
                ...prev,
                gap: parseInt(e.target.value)
              }))}
              className="w-full"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Padding: {controls.padding}px
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
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Off-screen Pages: {controls.offScreenPages}
            <input
              type="range"
              min="0"
              max="3"
              step="0.5"
              value={controls.offScreenPages}
              onChange={(e) => setControls(prev => ({
                ...prev,
                offScreenPages: parseFloat(e.target.value)
              }))}
              className="w-full"
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="virtualize"
            checked={controls.virtualize}
            onChange={(e) => setControls(prev => ({
              ...prev,
              virtualize: e.target.checked
            }))}
          />
          <label htmlFor="virtualize" className="text-sm font-medium">
            Virtualize
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="horizontal"
            checked={controls.horizontal}
            onChange={(e) => setControls(prev => ({
              ...prev,
              horizontal: e.target.checked
            }))}
          />
          <label htmlFor="horizontal" className="text-sm font-medium">
            Horizontal Scroll
          </label>
        </div>
      </div>

      {/* Grid */}
      <div ref={scrollRef} className="flex-1 overflow-auto border border-gray-200 rounded-lg h-96">
        <div
          ref={gridRef}
          style={controls.virtualize ? styles : {}}
          className={controls.horizontal ? 'grid horizontal' : 'grid'}
        >
          {(controls.virtualize ? items : data)?.map((index: number) => (
            <div key={index} className="p-4 bg-white border rounded-md shadow-sm">
              <div className="text-lg font-semibold">Item {index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
