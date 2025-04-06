import { useState, useEffect, useRef, useMemo } from 'react'
import { ScreenSize } from '../types'
import { getResolvedMediaQuery } from '../utils/get-resolved-media-query'

/**
 * Older versions of Safari (shipped withCatalina and before) do not support addEventListener on matchMedia
 * https://stackoverflow.com/questions/56466261/matchmedia-addlistener-marked-as-deprecated-addeventlistener-equivalent
 * */
const attachMediaListener = (
  query: MediaQueryList,
  callback: (event: { matches: boolean; media: string }) => void
) => {
  try {
    query.addEventListener('change', callback)
    return () => query.removeEventListener('change', callback)
  } catch {
    query.addListener(callback)
    return () => query.removeListener(callback)
  }
}

const getInitialValue = (query: string, disabled?: boolean) => {
  if (disabled) {
    return true
  }

  if (typeof window !== 'undefined' && 'matchMedia' in window) {
    return window.matchMedia(query).matches
  }

  return false
}

export const useMediaQuery = (
  query: string | ScreenSize | null,
  options = {
    disabled: false,
  }
) => {
  const resolvedQuery = useMemo(() => getResolvedMediaQuery(query), [query])

  const disabled = !resolvedQuery || options.disabled

  const [matches, setMatches] = useState(
    getInitialValue(resolvedQuery, disabled)
  )
  const queryRef = useRef<MediaQueryList>()

  useEffect(() => {
    if (disabled) {
      return
    }

    if ('matchMedia' in window) {
      queryRef.current = window.matchMedia(resolvedQuery)
      setMatches(queryRef.current.matches)
      return attachMediaListener(queryRef.current, (event) =>
        setMatches(event.matches)
      )
    }

    return undefined
  }, [resolvedQuery, disabled])

  if (disabled) {
    return true
  }

  return matches
}
