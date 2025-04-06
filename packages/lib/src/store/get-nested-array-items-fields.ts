import { set } from 'lodash'
import { Field, FormStore, InnerStoreApi, StringKeyOf } from '../types'
import { parseNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'

export const getNestedArrayItemsFields = <
  TFormFields extends Record<string, any> = Record<string, any>,
  TNestedValue extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[parentNestedFieldName]: Parameters<FormStore['getNestedArrayItemsFields']>
) => {
  const { fields } = innerStoreApi.getStoreState()

  const nestedArrayStates: {
    [K in keyof TNestedValue]: Field<TNestedValue[K], TFormFields>
  }[] = []

  Object.entries(fields).forEach(
    ([fieldName, field]: [
      string,
      Field<StringKeyOf<TFormFields>, TFormFields>,
    ]) => {
      const {
        parentFieldName,
        isNestedArrayItem,
        nestedItemComponentName,
        nestedItemIndex,
      } = parseNestedArrayItemFieldName(fieldName)

      if (!isNestedArrayItem || parentFieldName !== parentNestedFieldName) {
        return
      }

      set(
        nestedArrayStates,
        `[${nestedItemIndex}].${nestedItemComponentName}`,
        field
      )
    }
  )

  return nestedArrayStates
}
