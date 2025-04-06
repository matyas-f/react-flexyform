import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'

export const setInitialDataLoadingError = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[initialDataLoadingError]: Parameters<
    FormStore['setInitialDataLoadingError']
  >
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [
      ...(_innerStoreApi.calledBy || []),
      'setInitialDataLoadingError',
    ],
  }

  innerStoreApi.setStoreState(
    (formStore) => {
      formStore.initialDataLoadingError = initialDataLoadingError
    },
    false,
    getReduxDevtoolsDebugLabel(innerStoreApi.calledBy)
  )
}
