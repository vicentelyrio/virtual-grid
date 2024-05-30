import { useFixtureInput } from 'react-cosmos/client'

import { Demo } from './Demo'

export default () => {
  const [items] = useFixtureInput('items', 200)
  const [virtualize] = useFixtureInput('virtualize', false)
  const [horizontal] = useFixtureInput('horizontal', false)

  return (
    <Demo
      items={items}
      virtualize={virtualize}
      horizontal={horizontal}
    />
  )
}
