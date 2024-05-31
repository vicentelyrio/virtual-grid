export type GetRectReturnType = {
  height: number
  width: number
  isWindow: boolean
}

export function getRect(el: HTMLElement | Window): GetRectReturnType {
  if (el === window) {
    return {
      height: el.innerHeight,
      width: el.innerWidth,
      isWindow: true,
    }
  }
  else {
    const { width, height } = (el as HTMLElement).getBoundingClientRect()

    return {
      height,
      width,
      isWindow: false,
    }
  }
}

