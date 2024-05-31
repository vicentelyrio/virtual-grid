import { cloneElement } from 'react'

export function mapDataList(itemElement: any, indexKey: string) {
  return function(props: any) {
    return cloneElement(itemElement, {
      key: `index-${props[indexKey] ?? props?.index}`,
      ...props,
    })
  }
}
