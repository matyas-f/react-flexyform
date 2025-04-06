import { FormStore, InnerStoreApi, StringKeyOf } from '../types'
import { getFieldFocusableElement } from './get-field-focusable-element'

export const triggerFieldFocus = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldName]: Parameters<FormStore['triggerFieldFocus']>
) => {
  const { fields } = innerStoreApi.getStoreState()

  if (!fields[fieldName]) {
    return false
  }

  const { focusableElement, isAlreadyFocused } = getFieldFocusableElement(
    innerStoreApi,
    fieldName as StringKeyOf<TFormFields>
  )

  if (focusableElement && !isAlreadyFocused) {
    setTimeout(() => {
      focusableElement.focus()
    }, 0)

    return true
  }

  return false
}
