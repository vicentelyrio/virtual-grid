# Virtual Grid
A React virtualization library for rendering large datasets using CSS Grid. Virtual Grid only renders visible items on screen and automatically adapts to CSS Grid layout changes through ResizeObserver, making it suitable for responsive grids, image galleries, and carousels.

[Documentation](https://vicentelyrio.github.io/virtual-grid/)

## Why Virtual Grid?

Unlike other virtualization libraries that use `position: absolute` for item positioning, Virtual Grid relies on **native CSS Grid** with **dynamic padding** to maintain scroll position. This fundamental difference provides several key advantages:

### Native CSS Grid Support
- **Fully responsive**: Works seamlessly with `auto-fit`, `auto-fill`, `minmax()`, and media queries
- **No positioning conflicts**: Items remain in normal document flow, avoiding z-index and stacking context issues
- **True grid behavior**: Maintains all CSS Grid features like `gap`, `align-items`, `justify-items`, etc.

### Padding-based Positioning
Instead of absolutely positioning items, Virtual Grid adjusts the container's padding to maintain scroll position:

```tsx
// Virtual Grid (padding-based)
<div style={{
  ...virtualGridStyles,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
}}>
  {visibleItems.map(item => (
    <div>{item.content}</div>
  ))}
</div>
```

### Benefits
- **Automatic responsiveness**: Grid automatically reflows when viewport changes
- **Simpler CSS**: Use standard CSS Grid without positioning workarounds
- **Better scrollbar accuracy**: Native scroll behavior without height calculations
- **Easier debugging**: Items appear in normal document flow in DevTools

### Limitations
- **Not suitable for masonry layouts** - Requires predictable item heights for accurate calculations
- **Uniform item sizes** - Works best when items have consistent dimensions
- **Gap and padding sync** - CSS gap and padding values must match hook parameters

## Installation
```bash
npm install @virtualgrid/lib
# or
yarn add @virtualgrid/lib
```

## Quick Start
```tsx
import { useVirtualGrid } from '@virtualgrid/lib'

function Grid() {
  const data = Array(10000).fill(0).map((_, i) => ({ id: i, name: `Item ${i}` }))

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
      <div
        ref={gridRef}
        style={styles}
        className="grid"
      >
        {items.map((item) => (
          <ItemCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  )
}

function ItemCard({ data }) {
  return (
    <div className="card">
      {data.name}
    </div>
  )
}
```

## API Reference

### useVirtualGrid Hook
The main hook that provides virtualization functionality.

```tsx
const virtualGrid = useVirtualGrid<T>({
  data,
  offScreenPages?: number,
  padding?: number[],
  gap?: number,
  horizontal?: boolean,
})
```

### Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | `T[]` | required | Array of data items to virtualize |
| `offScreenPages` | `number` | `1` | Number of pages to render outside viewport |
| `padding` | `number[]` | `[0, 0, 0, 0]` | Padding [top, right, bottom, left] |
| `gap` | `number` | `20` | Gap between grid items |
| `horizontal` | `boolean` | `false` | Enable horizontal scrolling |

**Why `gap` and `padding` parameters are required:**
To calculate accurate padding offsets, Virtual Grid needs to know the exact `gap` between items and container `padding`. These values must match your CSS to ensure proper scroll positioning and layout calculations.

### Returns
The hook returns a `VirtualGrid<T>` object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `items` | `T[]` | Currently visible items to render |
| `styles` | `CSSProperties` | Styles to apply to grid container |
| `gridRef` | `RefObject<HTMLDivElement \| null>` | Ref for the grid container |
| `scrollRef` | `RefObject<HTMLDivElement \| null>` | Ref for the scroll container |
| `page` | `number` | Current page number |
| `pageRange` | `number[]` | Array of visible page numbers |
| `onScrollTo` | `(page: number) => void` | Function to scroll to specific page |
| `scrolling` | `boolean` | Whether user is currently scrolling |
| `resizing` | `boolean` | Whether window is being resized |
| `mounting` | `boolean` | Whether component is still mounting |

Additional layout properties are also included (rows, columns, dimensions, etc.).

## Examples

### Basic Grid
```tsx
const { items, styles, gridRef, scrollRef } = useVirtualGrid({
  data: myData,
  gap: 16,
  padding: [16, 16, 16, 16],
})
```

### Horizontal Scrolling
```tsx
const { items, styles, gridRef, scrollRef } = useVirtualGrid({
  data: myData,
  horizontal: true,
  gap: 12,
})
```

### Carousel
```tsx
function Carousel() {
  const data = Array(100).fill(0).map((_, i) => ({
    id: i,
    src: `https://picsum.photos/400/300?random=${i}`,
    title: `Slide ${i + 1}`
  }))

  const { items, styles, gridRef, scrollRef, page, onScrollTo } = useVirtualGrid({
    data,
    horizontal: true,
    gap: 16,
    padding: [0, 16, 0, 16],
  })

  return (
    <div className="carousel-container">
      <div
        ref={scrollRef}
        className="carousel-scroll"
        style={{ overflowX: 'auto', overflowY: 'hidden' }}
      >
        <div
          ref={gridRef}
          style={{
            ...styles,
            display: 'grid',
            gridAutoFlow: 'column',
            gridTemplateColumns: 'repeat(auto-fit, 400px)',
            gap: 16,
          }}
        >
          {items.map((item) => (
            <div key={item.id} className="carousel-slide">
              <img src={item.src} alt={item.title} />
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-controls">
        <button onClick={() => onScrollTo(page - 1)}>
          Previous
        </button>
        <span>{page} of {pages}</span>
        <button onClick={() => onScrollTo(page + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}
```

The ResizeObserver automatically detects when your CSS Grid layout changes (due to viewport resize, media queries, etc.) and recalculates the virtualization accordingly.

## Error Handling
Virtual Grid follows a hooks-first approach and doesn't include built-in error boundaries. Implement error handling at the component level:

```tsx
function SafeGrid({ data }: SafeGridProps) {
  try {
    const virtualGrid = useVirtualGrid({ data })
    return <GridComponent {...virtualGrid} />
  }
  catch {
    return <GridComponent {...data} />
  }
}
```

## Development
This is a monorepo using Turborepo and Yarn workspaces.

### Project Structure
```
virtual-grid/
├── apps/
│   ├── docs/               # Next.js documentation site
│   └── playground/         # React Cosmos development environment
├── packages/
│   ├── lib/                # Main virtualgrid library
│   ├── eslint-config/      # Shared ESLint configuration
│   └── typescript-config/  # Shared TypeScript configuration
```

### Getting Started
```bash
# Install dependencies
yarn install

# Start development environment
yarn dev

# Start just the playground
yarn dev:playground

# Start just the library in watch mode
yarn dev:lib

# Build all packages
yarn build

# Run tests
yarn test

# Run linting
yarn lint
```

### Available Scripts
| Command | Description |
|---------|-------------|
| `yarn dev` | Start all apps in development mode |
| `yarn dev:playground` | Start playground with React Cosmos |
| `yarn dev:lib` | Build library in watch mode |
| `yarn build` | Build all packages and apps |
| `yarn test` | Run all tests |
| `yarn test:watch` | Run tests in watch mode |
| `yarn lint` | Run ESLint on all packages |
| `yarn typecheck` | Run TypeScript type checking |

### Testing

The library includes comprehensive tests using Jest and React Testing Library:
```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### Playground
The playground app uses React Cosmos for component development and testing:

```bash
yarn dev:playground
```

This starts a development server where you can interact with the virtual grid components and test different configurations.

### Documentation
The documentation site is built with Next.js and Nextra:

```bash
cd apps/docs
yarn dev
```

## Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run the test suite: `yarn test`
5. Run linting: `yarn lint`
6. Commit your changes: `git commit -am 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

## Requirements
- Node.js ≥ 18
- React ≥ 19.0.0
- React DOM ≥ 19.0.0

## License
MIT License - see [LICENSE](LICENSE) file for details.

## Alternatives
- [react-table](https://github.com/TanStack/table)
- [react-virtualized](https://github.com/bvaughn/react-virtualized)
- [react-window](https://github.com/bvaughn/react-window)
