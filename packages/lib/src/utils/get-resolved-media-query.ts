import { ScreenSize } from '../types'

export const getResolvedMediaQuery = (query: string | ScreenSize | null) => {
  if (typeof query === 'string') {
    return query
  }

  if (typeof query !== 'object' || query === null) {
    return ''
  }

  let result = ``

  if (query.min) {
    result += `(min-width: ${query.min}px)`
  }

  if (query.min && query.max) {
    result += ` and `
  }

  if (query.max) {
    result += `(max-width: ${query.min}px)`
  }

  return result
}
