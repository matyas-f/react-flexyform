import { InnerStoreApi } from '../types'

export const getIsValidatingAnything = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const { fields, isValidatingStep } = innerStoreApi.getStoreState()

  return (
    isValidatingStep ||
    Object.values(fields).some((field) => field.isValidating)
  )
}
