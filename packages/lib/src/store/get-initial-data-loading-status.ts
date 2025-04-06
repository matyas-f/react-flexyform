import { InnerStoreApi } from '../types'

export const getInititialDataLoadingStatus = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const { isLoadingInitialData, initialDataLoadingError, initialData } =
    innerStoreApi.getStoreState()

  if (isLoadingInitialData) {
    return 'loading'
  }

  if (initialDataLoadingError) {
    return 'error'
  }

  if (initialData) {
    return 'success'
  }

  return 'loading'
}
