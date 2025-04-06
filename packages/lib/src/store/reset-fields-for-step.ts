import { FormStore, InnerStoreApi } from '../types'
import { resetField } from './reset-field'

export const resetFieldsForStep = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[stepName, options]: Parameters<FormStore['resetFieldsForStep']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'resetFieldsForStep'],
  }

  const { currentStepName, getFieldNamesByStepName } =
    innerStoreApi.getStoreState()

  const fieldNames = getFieldNamesByStepName(stepName || currentStepName)

  fieldNames.forEach((fieldName) => {
    resetField(innerStoreApi, fieldName, options)
  })
}
