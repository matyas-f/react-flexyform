import { InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'

export const resetFieldValidationErrorsForStep = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [
      ...(_innerStoreApi.calledBy || []),
      'resetFieldValidationErrorsForStep',
    ],
  }

  const { getFieldNamesByStepName } = innerStoreApi.getStoreState()

  innerStoreApi.setStoreState(
    (formStore) => {
      getFieldNamesByStepName().forEach((fieldName) => {
        if (!formStore.fields[fieldName]) {
          return
        }

        formStore.fields[fieldName].validationError = null
      })
    },
    false,
    getReduxDevtoolsDebugLabel(innerStoreApi.calledBy)
  )
}
