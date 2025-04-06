import { FormStore, InnerStoreApi } from '../types'
import { getField } from './get-field'
import { getShouldTriggerValidation } from './get-should-trigger-validation'
import { setFieldIsTouched } from './set-field-is-touched'
import { triggerStepValidation } from './trigger-step-validation'
import { triggerFieldValidation } from './trigger-field-validation'
import { triggerAutoSave } from './trigger-auto-save'
import { getShouldTriggerAutoSave } from './get-should-trigger-auto-save'
import { getCurrentStep } from './get-current-step'

export const triggerFieldBlur = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldName]: Parameters<FormStore<TFormFields>['triggerFieldBlur']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'triggerFieldBlur'],
  }

  const { autoSaveOptions } = getCurrentStep(innerStoreApi)

  const field = getField(innerStoreApi, fieldName)

  const shouldSkipBlurValidation = field?.lastValidatedValue === field?.value

  const shouldTriggerFieldValidation = shouldSkipBlurValidation
    ? false
    : getShouldTriggerValidation(innerStoreApi, {
        validationTrigger: 'fieldBlur',
        fieldName,
        isStepValidation: false,
      })

  const shouldTriggerStepValidation = shouldSkipBlurValidation
    ? false
    : getShouldTriggerValidation(innerStoreApi, {
        validationTrigger: 'fieldBlur',
        fieldName,
        isStepValidation: true,
      })

  if (shouldSkipBlurValidation) {
    innerStoreApi.cache.lastChangedField = null
  }

  setFieldIsTouched(innerStoreApi, fieldName)

  const shouldTriggerAutoSave = getShouldTriggerAutoSave(innerStoreApi, {
    autoSaveTrigger: 'fieldBlur',
    fieldName,
  })

  if (shouldTriggerFieldValidation) {
    triggerFieldValidation(innerStoreApi, fieldName, {
      shouldFocusInvalidField: false,
      onSuccess:
        shouldTriggerAutoSave && !autoSaveOptions.ignoreValidation
          ? () =>
              triggerAutoSave(innerStoreApi, { useDebounce: true, fieldName })
          : undefined,
    })
  }

  if (shouldTriggerStepValidation) {
    triggerStepValidation(innerStoreApi)
  }

  if (shouldTriggerAutoSave && autoSaveOptions.ignoreValidation) {
    triggerAutoSave(innerStoreApi, { useDebounce: true, fieldName })
  }
}
