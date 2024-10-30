import { useFixtureInput } from 'react-cosmos/client'

import { Demo } from './Demo'

export default () => {
  const [count] = useFixtureInput('count', 200)
  const [virtualize] = useFixtureInput('virtualize', false)
  const [horizontal] = useFixtureInput('horizontal', false)

  return (
    <Demo
      count={count}
      virtualize={virtualize}
      horizontal={horizontal}
    />
  )
}
