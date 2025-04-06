import { FormStore, InnerStoreApi } from '../types'

export const getField = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldName]: Parameters<FormStore['getField']>
) => {
  const { fields } = innerStoreApi.getStoreState()

  if (!fields[fieldName]) {
    return undefined
  }

  return fields[fieldName]
}
