import { useEffect, useState } from 'react'

export function useLayout({
  scrollElement,
  gridElement,
}: any) {
  const [scroll, setScroll] = useState<IntersectionObserverEntry>()
  const [grid, setGrid] = useState<IntersectionObserverEntry>()
  const [card, setCard] = useState<IntersectionObserverEntry>()


  useEffect(() => {
    let resizeObserverEntries: IntersectionObserverEntry[] = []

    const observer = new IntersectionObserver((entries) => {
      resizeObserverEntries = entries

      setScroll(entries[0])
      setGrid(entries[1])
      setCard(entries[2])
    })

    if(scrollElement) observer.observe(scrollElement)

    if(gridElement) observer.observe(gridElement)

    if(gridElement?.firstChild) observer.observe(gridElement.firstChild as HTMLElement)

    return () => {
      resizeObserverEntries.forEach((entry) => entry.target.remove())
      observer.disconnect()
    }
  },[])

  console.log(scroll)
  console.log(grid)
  console.log(card)
}
