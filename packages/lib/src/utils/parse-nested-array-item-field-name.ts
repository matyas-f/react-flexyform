export const isNestedArrayItemFieldName = (
  nestedArrayItemFieldName: string
): boolean => new RegExp(/\[\d+\]\./).test(nestedArrayItemFieldName)

export type NestedArrayItemInfo =
  | {
      isNestedArrayItem: false
      parentFieldName: null
      nestedItemIndex: null
      nestedItemComponentName: null
    }
  | {
      isNestedArrayItem: true
      parentFieldName: string
      nestedItemIndex: number
      nestedItemComponentName: string
    }

export const parseNestedArrayItemFieldName = (
  // Expecting the format to be `parentFieldName[nestedItemIndex].nestedItemComponentName`
  nestedArrayItemFieldName: string
): NestedArrayItemInfo => {
  const isNestedArrayItem = isNestedArrayItemFieldName(nestedArrayItemFieldName)

  if (!isNestedArrayItem) {
    return {
      isNestedArrayItem,
      parentFieldName: null,
      nestedItemIndex: null,
      nestedItemComponentName: null,
    }
  }

  const parentFieldName = nestedArrayItemFieldName.split('[')[0] || ''
  const nestedItemIndex = parseInt(
    nestedArrayItemFieldName.split('[')[1]?.split(']')[0] || '0'
  )
  const nestedItemComponentName = nestedArrayItemFieldName.split('].')[1] || ''

  return {
    isNestedArrayItem,
    parentFieldName,
    nestedItemIndex,
    nestedItemComponentName,
  }
}
