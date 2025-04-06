import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'

export const resetValidationErrorForFields = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldNames]: Parameters<FormStore['resetValidationErrorForFields']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [
      ...(_innerStoreApi.calledBy || []),
      'resetValidationErrorForFields',
    ],
  }

  innerStoreApi.setStoreState(
    (formStore) => {
      fieldNames.forEach((fieldName) => {
        if (!formStore.fields[fieldName]) {
          return
        }

        formStore.fields[fieldName].validationError = null
      })
    },
    false,
    getReduxDevtoolsDebugLabel(innerStoreApi.calledBy, { fieldNames })
  )
}
