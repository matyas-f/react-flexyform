// { a: 'foo', b: [{ b1: 'bar1', b2: 'baz1' }, { b2: 'bar2', b2: 'baz2' }] } => { 'a': 'foo', 'b[0].b1': 'bar'1, 'b[0].b2': 'baz1', 'b[1].b2': 'bar2', 'b[1].b2': 'baz2' }
export const deepFlattenObject = (obj: Record<string, any>) => {
  const toReturn: Record<string, any> = {}

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue
    }

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const flatObject = deepFlattenObject(obj[key])
      for (const nestedKey in flatObject) {
        if (!flatObject.hasOwnProperty(nestedKey)) {
          continue
        }

        if (Number.isNaN(Number(key))) {
          toReturn[
            key +
              `${nestedKey.split('.')?.[0]?.[0] === '[' ? '' : '.'}` +
              nestedKey
          ] = flatObject[nestedKey]
        } else {
          toReturn['[' + key + '].' + nestedKey] = flatObject[nestedKey]
        }
      }
    } else {
      toReturn[key] = obj[key]
    }
  }

  return toReturn
}
