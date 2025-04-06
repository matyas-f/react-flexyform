import { FormStore, InnerStoreApi } from '../types'

export const getFieldValidationError = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldName]: Parameters<FormStore['getFieldValidationError']>
) => {
  const { fields } = innerStoreApi.getStoreState()

  if (!fields[fieldName]) {
    return null
  }

  return fields[fieldName].validationError
}
