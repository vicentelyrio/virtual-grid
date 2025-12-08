## `virtual-grid`

React virtualization library for rendering large datasets using CSS Grid.

This package contains the core **Virtual Grid hook and utilities**. It only renders visible items on screen and automatically adapts to CSS Grid layout changes through `ResizeObserver`, making it suitable for responsive grids, image galleries, and carousels.

### Installation

```bash
npm install virtual-grid
# or
yarn add virtual-grid
```

### Quick Start

```tsx
import { useVirtualGrid } from 'virtual-grid'

function Grid() {
  const data = Array.from({ length: 10_000 }, (_, i) => ({ id: i, name: `Item ${i}` }))

  const {
    items,
    styles,
    gridRef,
    scrollRef,
  } = useVirtualGrid({
    data,
    gap: 20,
    padding: [20, 20, 20, 20],
    offScreenPages: 1,
  })

  return (
    <div ref={scrollRef} style={{ height: '100vh', overflow: 'auto' }}>
      <div ref={gridRef} style={styles} className="grid">
        {items.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </div>
  )
}
```

### API Overview

```ts
import type { VirtualGrid, VirtualGridProps } from 'virtual-grid'

function useVirtualGrid<T>(props: VirtualGridProps<T>): VirtualGrid<T>
```

**`VirtualGridProps<T>`**

- `data: T[]` – Items to virtualize (required)
- `offScreenPages?: number` – Number of pages to render outside the viewport
- `padding?: number[]` – `[top, right, bottom, left]` padding; must match your CSS padding
- `gap?: number` – Gap between grid items; must match your CSS `gap`
- `horizontal?: boolean` – Enable horizontal scrolling

**`VirtualGrid<T>`**

Core return shape (simplified):

- `items: T[]` – Visible items to render
- `styles: React.CSSProperties` – Styles to apply to the grid container
- `gridRef: React.RefObject<HTMLDivElement | null>`
- `scrollRef: React.RefObject<HTMLDivElement | null>`
- `page: number`
- `pageRange: number[]`
- `onScrollTo(page: number): void`
- Layout fields (scroll sizes, grid dimensions, etc.)

For full details, see the exported types:

```ts
import { VirtualGrid, VirtualGridProps, Layout } from 'virtual-grid'
```

### Key Concepts

- **Padding-based positioning** – Uses dynamic padding instead of absolute positioning to maintain scroll position while letting CSS Grid handle layout.
- **Resize-aware** – Uses `ResizeObserver` to react to container and layout changes.
- **Page-based virtualization** – Renders only the current and surrounding pages, controlled by `offScreenPages`.

### Limitations

- Not designed for masonry layouts (requires predictable item height).
- Works best when items have **uniform sizes**.
- CSS `gap` and `padding` must match the values passed to the hook.

### Development

From the repo root:

```bash
yarn install
yarn dev:lib
```

To run tests for this package:

```bash
cd packages/lib
yarn test
```

