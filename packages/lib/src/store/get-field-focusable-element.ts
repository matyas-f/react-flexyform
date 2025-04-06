import { InnerStoreApi, StringKeyOf } from '../types'

export const getFieldFocusableElement = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  fieldName: StringKeyOf<TFormFields>
) => {
  const { fields } = innerStoreApi.getStoreState()

  if (!fields[fieldName]) {
    return {
      focusableElement: null,
      isAlreadyFocused: false,
    }
  }

  const idSelector = fields[fieldName].id

  const element =
    typeof window !== 'undefined' ? document.getElementById(idSelector) : null

  return {
    focusableElement: element,
    isAlreadyFocused: document.activeElement === element,
  }
}
