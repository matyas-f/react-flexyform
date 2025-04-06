import { InnerStoreApi, StringKeyOf } from '../types'
import { parseNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'

export const getLastIndexOfNestedArrayField = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  parentFieldName: StringKeyOf<TFormFields>
) => {
  const { fields } = innerStoreApi.getStoreState()

  let lastIndex = 0

  Object.keys(fields).forEach((fieldName) => {
    if (fieldName.startsWith(parentFieldName)) {
      const { isNestedArrayItem, nestedItemIndex } =
        parseNestedArrayItemFieldName(parentFieldName)

      if (isNestedArrayItem && nestedItemIndex > lastIndex) {
        lastIndex = nestedItemIndex
      }
    }
  })

  return lastIndex
}
