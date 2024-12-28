import clsx from 'clsx'
import type { CSSProperties, RefObject } from 'react'

import classes from './Grid.module.css'

export type GridProps = {
  animation: number
  horizontal: boolean
  scrollRef?: RefObject<HTMLDivElement | null>
  gridRef?: RefObject<HTMLDivElement | null>
  styles?: CSSProperties
  data: number[]
}

export function Grid({
  horizontal,
  animation,
  scrollRef,
  gridRef,
  styles,
  data,
}: GridProps) {
  return (
    <div
      className={clsx([classes.scroll, horizontal && classes.scrollHorizontal])}
      ref={scrollRef}>
      <div
        style={styles}
        className={clsx([classes.grid, horizontal && classes.gridHorizontal])}
        ref={gridRef}>
        {data.map((index: number) => (
          <Card
            index={index}
            key={index}
            styles={{ animationDuration: `${animation/10}s` }}
          />
        ))}
      </div>
    </div>
  )
}

type CardProps = {
  index?: number
  styles?: CSSProperties
}

function Card({ index = 0, styles }: CardProps) {
  const pos = index + 1
  const name = getRobotName(pos)
  return (
    <div className={classes.card} style={styles}>
      <img
        src={getRobotImageUrl(pos)}
        alt={name}
        loading="lazy"
      />
      <p className={classes.cardLabel}>{pos}</p>
      <p className={classes.cardName}>{name}</p>
    </div>
  )
}

const adjectives = [
  'Lunar', 'Cosmic', 'Atomic', 'Static', 'Dynamic', 'Electric', 'Magnetic',
  'Cyber', 'Data', 'Logic', 'Neural', 'Pixel', 'Vector'
]

const nouns = [
  'Chip', 'Circuit', 'Servo', 'Matrix', 'Node', 'Link', 'Port',
  'Grid', 'Pulse', 'Wave', 'Beam', 'Hub', 'Mesh'
]

export const getRobotName = (index: number): string => {
  const adjIndex = index % adjectives.length
  const nounIndex = Math.floor(index / adjectives.length) % nouns.length
  return `${adjectives[adjIndex]} ${nouns[nounIndex]}`
}

export const getRobotImageUrl = (index: number): string => {
  const name = getRobotName(index)
  return `https://robohash.org/${encodeURIComponent(name)}`
}

const PICSUM_SEED_WORDS = [
  'alpha', 'beta', 'gamma', 'delta', 'epsilon',
  'zeta', 'eta', 'theta', 'iota', 'kappa'
]

export const getPicsumImageUrl = (index: number, width = 400, height = 300): string => {
  const seed = PICSUM_SEED_WORDS[index % PICSUM_SEED_WORDS.length]
  return `https://picsum.photos/seed/${seed}-${index}/${width}/${height}`
}

