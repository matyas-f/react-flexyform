import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'

export const setIsLoadingInitialData = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[isLoadingInitialData]: Parameters<FormStore['setIsLoadingInitialData']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'setIsLoadingInitialData'],
  }

  innerStoreApi.setStoreState(
    (formStore) => {
      formStore.isLoadingInitialData = isLoadingInitialData
    },
    false,
    getReduxDevtoolsDebugLabel(innerStoreApi.calledBy)
  )
}
