import { nanoid } from 'nanoid'
import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { getCurrentStep } from './get-current-step'
import { getShouldTriggerValidation } from './get-should-trigger-validation'
import { triggerFieldsAndStepValidation } from './trigger-fields-and-step-validation'
import { getFieldNamesByStepName } from './get-field-names-by-step-name'

export const triggerSave = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[params]: Parameters<FormStore['triggerSave']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'triggerSave'],
  }
  const { didTriggerRevalidationModeForStep, configuration } =
    innerStoreApi.getStoreState()
  const currentStep = getCurrentStep(innerStoreApi)
  const { formId } = configuration

  const shouldValidateFieldsBeforeSaving = getShouldTriggerValidation(
    innerStoreApi,
    { validationTrigger: 'save', isStepValidation: false }
  )

  const shouldValidateStepBeforeSaving = getShouldTriggerValidation(
    innerStoreApi,
    { validationTrigger: 'save', isStepValidation: true }
  )

  const triggerId = nanoid()

  innerStoreApi.setStoreState(
    (formStore) => {
      formStore.isSaving = true

      innerStoreApi.cache.save.setLastTriggerId(formId, triggerId)
      innerStoreApi.cache.save
        .getLastTriggerAbortController(formId)
        ?.abort('There was a new save triggered')
      innerStoreApi.cache.save.setLastTriggerAbortController(
        formId,
        new AbortController()
      )
    },
    false,
    getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'initiating'])
  )

  if (shouldValidateFieldsBeforeSaving || shouldValidateStepBeforeSaving) {
    const areFieldsAndStepValid = await triggerFieldsAndStepValidation(
      innerStoreApi,
      {
        shouldFocusInvalidField:
          currentStep.validationOptions.shouldFocusFirstInvalidField,
        skipFieldsValidation: !shouldValidateFieldsBeforeSaving,
        skipStepValidation: !shouldValidateStepBeforeSaving,
      }
    )

    if (!didTriggerRevalidationModeForStep) {
      innerStoreApi.setStoreState(
        (formStore) => {
          formStore.didTriggerRevalidationModeForStep = true
        },
        false,
        getReduxDevtoolsDebugLabel([
          ...innerStoreApi.calledBy,
          'setRevalidationMode',
        ])
      )
    }

    if (!areFieldsAndStepValid) {
      innerStoreApi.setStoreState(
        (formStore) => {
          if (innerStoreApi.cache.save.getLastTriggerId(formId) === triggerId) {
            formStore.isSaving = false
            formStore.saveError = null
          }
        },
        false,
        getReduxDevtoolsDebugLabel([
          ...innerStoreApi.calledBy,
          'validationError',
        ])
      )

      return
    }
  }

  const onSave = configuration.events?.onSave || params?.onSave
  const onSaveSuccess =
    configuration.events?.onSaveSuccess || params?.onSaveSuccess
  const onSaveError = configuration.events?.onSaveError || params?.onSaveError

  try {
    if (onSave) {
      await onSave(
        innerStoreApi.cache.save.getLastTriggerAbortController(
          formId
        ) as AbortController
      )
    }

    innerStoreApi.setStoreState(
      (formStore) => {
        if (innerStoreApi.cache.save.getLastTriggerId(formId) === triggerId) {
          const currentStepFieldNames = getFieldNamesByStepName(
            innerStoreApi,
            currentStep.name
          )

          formStore.isSaving = false
          currentStepFieldNames.forEach((fieldName) => {
            formStore.fields[fieldName].stepInitialValue =
              formStore.fields[fieldName].value
            formStore.fields[fieldName].isDirty = false
            formStore.fields[fieldName].isTouched = false
          })

          innerStoreApi.cache.save.clearLastTriggerAbortController(formId)
        }

        formStore.eventHistory.push({
          type: 'save',
          stepName: currentStep.name,
        })
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'success'])
    )

    if (onSaveSuccess) {
      onSaveSuccess()
    }
  } catch (error) {
    innerStoreApi.setStoreState(
      (formStore) => {
        if (innerStoreApi.cache.save.getLastTriggerId(formId) === triggerId) {
          formStore.isSaving = false
          formStore.saveError = error as Error

          innerStoreApi.cache.save.clearLastTriggerAbortController(formId)
        }
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'error'])
    )

    if (onSaveError) {
      onSaveError()
    }
  }
}
