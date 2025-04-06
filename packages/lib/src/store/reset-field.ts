import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { setFieldValue } from './set-field-value'

export const resetField = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldName, options]: Parameters<FormStore['resetField']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'resetField'],
  }

  const { fields } = innerStoreApi.getStoreState()

  innerStoreApi.setStoreState(
    (formStore) => {
      if (!formStore.fields[fieldName]) {
        return
      }

      if (!options?.shouldKeepIsDirty) {
        formStore.fields[fieldName].isDirty = false
      }

      if (!options?.shouldKeepIsTouched) {
        formStore.fields[fieldName].isTouched = false
      }

      if (!options?.shouldKeepValidationError) {
        formStore.fields[fieldName].validationError = null
      }
    },
    false,
    getReduxDevtoolsDebugLabel(innerStoreApi.calledBy, { fieldName, options })
  )

  if (!options?.shouldKeepValue) {
    setFieldValue(innerStoreApi, fieldName, fields[fieldName]?.initialValue, {
      shouldTriggerValidation: false,
      shouldSetIsTouched: false,
      shouldSetIsDirty: false,
    })
  }
}
