import { InnerStoreApi, StringKeyOf } from '../types'
import { getAllFields } from './get-all-fields'
import { getFieldFocusableElement } from './get-field-focusable-element'

export const getIsAnyFieldFocused = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  return Object.values(getAllFields(innerStoreApi)).some((field) => {
    const { isAlreadyFocused } = getFieldFocusableElement(
      innerStoreApi,
      field.name as StringKeyOf<TFormFields>
    )

    return isAlreadyFocused
  })
}
