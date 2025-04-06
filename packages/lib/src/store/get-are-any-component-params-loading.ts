import { InnerStoreApi } from '../types'

export const getAreAnyComponentParamsLoading = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const { componentParams } = innerStoreApi.getStoreState()

  return Object.values(componentParams).some(
    (componentParams) => componentParams.isLoading
  )
}
