import { InnerStoreApi } from '../types'

export const getIsValidatingFields = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const { fields } = innerStoreApi.getStoreState()

  return Object.values(fields).some((field) => field.state.isValidating)
}
