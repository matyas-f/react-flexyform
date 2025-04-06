import { FormStore, InnerStoreApi } from '../types'
import { getNestedArrayItemFieldName } from '../utils/name-generators'

export const getNestedArrayItemField = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[{ fieldName, nestedItemIndex, parentFieldName }]: Parameters<
    FormStore['getNestedArrayItemField']
  >
) => {
  const { fields } = innerStoreApi.getStoreState()

  const nestedArrayItemFieldName = getNestedArrayItemFieldName({
    parentFieldName,
    index: nestedItemIndex,
    nestedArrayItemProperty: fieldName,
  })

  if (!fields[nestedArrayItemFieldName]) {
    return undefined
  }

  return fields[nestedArrayItemFieldName]
}
