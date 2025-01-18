import { calculateGridSize, type CalculateGridSizeProps } from '@utils/calculateGridSize'
import { computeSize } from '@utils/computeSize'

// Mock the computeSize function
jest.mock('@utils/computeSize')
const mockedComputeSize = jest.mocked(computeSize)

describe('calculateGridSize', () => {
  // Reset mock before each test
  beforeEach(() => {
    jest.resetAllMocks()
  })

  // Common test props to reduce repetition
  const baseProps: CalculateGridSizeProps = {
    horizontal: false,
    height: 500,
    width: 800,
    itemsPerRow: 4,
    itemsPerColumn: 3,
    itemHeight: 100,
    itemWidth: 150,
    total: 12,
    padding: [10, 10, 10, 10], // top, right, bottom, left
    gap: 8,
  }

  describe('vertical layout', () => {
    it('should calculate height correctly when computed height is larger than provided height', () => {
      // Setup
      const props = { ...baseProps, horizontal: false }
      mockedComputeSize.mockReturnValue(600) // Mock a larger height

      // Execute
      const result = calculateGridSize(props)

      // Verify
      expect(mockedComputeSize).toHaveBeenCalledWith({
        total: props.total,
        itemsPerPage: props.itemsPerRow,
        itemSize: props.itemHeight,
        gap: props.gap,
        padding: props.padding[0] + props.padding[2], // top + bottom padding
      })
      expect(result).toEqual({
        width: props.width,
        height: 600, // Should use computed height
      })
    })

    it('should maintain original height when computed height is smaller', () => {
      // Setup
      const props = { ...baseProps, horizontal: false }
      mockedComputeSize.mockReturnValue(400) // Mock a smaller height

      // Execute
      const result = calculateGridSize(props)

      // Verify
      expect(result).toEqual({
        width: props.width,
        height: props.height, // Should keep original height
      })
    })

    it('should handle zero padding correctly', () => {
      // Setup
      const props = {
        ...baseProps,
        horizontal: false,
        padding: [0, 0, 0, 0],
      }
      mockedComputeSize.mockReturnValue(550)

      // Execute
      const result = calculateGridSize(props)

      // Verify
      expect(mockedComputeSize).toHaveBeenCalledWith({
        total: props.total,
        itemsPerPage: props.itemsPerRow,
        itemSize: props.itemHeight,
        gap: props.gap,
        padding: 0, // No padding
      })
      expect(result).toEqual({
        width: props.width,
        height: 550,
      })
    })
  })

  describe('horizontal layout', () => {
    it('should calculate width correctly when computed width is larger than provided width', () => {
      // Setup
      const props = { ...baseProps, horizontal: true }
      mockedComputeSize.mockReturnValue(1000) // Mock a larger width

      // Execute
      const result = calculateGridSize(props)

      // Verify
      expect(mockedComputeSize).toHaveBeenCalledWith({
        total: props.total,
        itemsPerPage: props.itemsPerColumn,
        itemSize: props.itemWidth,
        gap: props.gap,
        padding: props.padding[1] + props.padding[3], // right + left padding
      })
      expect(result).toEqual({
        width: 1000, // Should use computed width
        height: props.height,
      })
    })

    it('should maintain original width when computed width is smaller', () => {
      // Setup
      const props = { ...baseProps, horizontal: true }
      mockedComputeSize.mockReturnValue(700) // Mock a smaller width

      // Execute
      const result = calculateGridSize(props)

      // Verify
      expect(result).toEqual({
        width: props.width, // Should keep original width
        height: props.height,
      })
    })

    it('should handle asymmetric padding correctly', () => {
      // Setup
      const props = {
        ...baseProps,
        horizontal: true,
        padding: [5, 15, 5, 25], // Different padding for each side
      }
      mockedComputeSize.mockReturnValue(850)

      // Execute
      const result = calculateGridSize(props)

      // Verify
      expect(mockedComputeSize).toHaveBeenCalledWith({
        total: props.total,
        itemsPerPage: props.itemsPerColumn,
        itemSize: props.itemWidth,
        gap: props.gap,
        padding: 40, // right (15) + left (25) padding
      })
      expect(result).toEqual({
        width: 850,
        height: props.height,
      })
    })
  })

  describe('edge cases', () => {
    it('should handle minimum values correctly', () => {
      // Setup
      const props = {
        ...baseProps,
        horizontal: false,
        height: 0,
        width: 0,
        itemsPerRow: 1,
        itemsPerColumn: 1,
        total: 1,
        padding: [0, 0, 0, 0],
        gap: 0,
      }
      mockedComputeSize.mockReturnValue(100)

      // Execute
      const result = calculateGridSize(props)

      // Verify
      expect(result).toEqual({
        width: 0,
        height: 100,
      })
    })

    it('should handle large numbers correctly', () => {
      // Setup
      const props = {
        ...baseProps,
        horizontal: true,
        total: 1000000,
        width: 10000,
      }
      mockedComputeSize.mockReturnValue(15000)

      // Execute
      const result = calculateGridSize(props)

      // Verify
      expect(result).toEqual({
        width: 15000,
        height: props.height,
      })
    })
  })
})
