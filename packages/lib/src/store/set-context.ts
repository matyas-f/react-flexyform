import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'

export const setContext = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[newContext]: Parameters<FormStore['setContext']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'setContext'],
  }

  innerStoreApi.setStoreState(
    (formStore) => {
      formStore.context = {
        ...formStore.context,
        ...newContext,
      }
    },
    false,
    getReduxDevtoolsDebugLabel(innerStoreApi.calledBy, { newContext })
  )
}
