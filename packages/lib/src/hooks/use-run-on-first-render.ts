import { useRef } from 'react'

export const useRunOnFirstRender = (functionToRun: () => any) => {
  const didRun = useRef(false)

  if (!didRun.current) {
    didRun.current = true
    functionToRun()
  }
}
