import { useFixtureInput } from 'react-cosmos/client'

import { Demo } from './Demo'

export default () => {
  const [count] = useFixtureInput('count', 200)
  const [virtualize] = useFixtureInput('virtualize', false)
  const [horizontal] = useFixtureInput('horizontal', false)
  const [offScreenPages] = useFixtureInput('offScreenPages', 1)
  const [images] = useFixtureInput('images', true)

  return (
    <Demo
      offScreenPages={offScreenPages}
      count={count}
      virtualize={virtualize}
      horizontal={horizontal}
      images={images}
    />
  )
}
