import { useFixtureInput } from 'react-cosmos/client'

import { Demo } from './Demo'

export default () => {
  const [count] = useFixtureInput('count', 200)
  const [virtualize] = useFixtureInput('virtualize', true)
  const [horizontal] = useFixtureInput('horizontal', false)
  const [offScreenPages] = useFixtureInput('offScreenPages', 1)

  return (
    <Demo
      offScreenPages={offScreenPages}
      count={count}
      virtualize={virtualize}
      horizontal={horizontal}
    />
  )
}
