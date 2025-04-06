import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'

export const setStepInitialValues = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[stepName]: Parameters<FormStore<TFormFields>['setStepInitialValues']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'setStepInitialValues'],
  }

  const getFieldNamesforStep = innerStoreApi
    .getStoreState()
    .getFieldNamesByStepName(stepName)

  innerStoreApi.setStoreState(
    (formStore) => {
      getFieldNamesforStep.forEach((fieldName) => {
        formStore.fields[fieldName].stepInitialValue =
          formStore.fields[fieldName].value
      })
    },
    false,
    getReduxDevtoolsDebugLabel(innerStoreApi.calledBy, { stepName })
  )
}
