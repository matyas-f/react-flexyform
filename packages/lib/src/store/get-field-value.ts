import { FormStore, InnerStoreApi } from '../types'

export const getFieldValue = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldName]: Parameters<FormStore['getFieldValue']>
) => {
  const { fields } = innerStoreApi.getStoreState()

  if (!fields[fieldName]) {
    return undefined
  }

  return fields[fieldName].value
}
