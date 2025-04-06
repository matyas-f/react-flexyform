export const getReduxDevtoolsDebugLabel = (
  calledBy: string[],
  params?: Record<string, any>
) => {
  let paramsString = params ? ':' : ''

  if (params) {
    Object.entries(params).forEach(([key, value], index, thisArr) => {
      let formattedValue = ''
      try {
        formattedValue =
          typeof value === 'object' ? JSON.stringify(value) : value
      } catch {
        formattedValue = 'Error: JSON.stringify failed'
      }

      paramsString += `${key}=${formattedValue}${index === thisArr.length - 1 ? '' : ', '}`
    })
  }

  return `${calledBy.join('>')}${paramsString}`
}
