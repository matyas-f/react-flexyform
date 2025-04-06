import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { getCurrentStep } from './get-current-step'
import { triggerFieldsAndStepValidation } from './trigger-fields-and-step-validation'

export const triggerSubmit = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[params]: Parameters<FormStore['triggerSubmit']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'triggerSubmit'],
  }
  const { shouldSkipValidation = false } = params || {}

  const { didTriggerRevalidationModeForStep, isSubmitting, configuration } =
    innerStoreApi.getStoreState()
  const currentStep = getCurrentStep(innerStoreApi)

  if (isSubmitting) {
    return
  }

  innerStoreApi.setStoreState(
    (formStore) => {
      formStore.isSubmitting = true
    },
    false,
    getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'initiating'])
  )

  if (!shouldSkipValidation) {
    const areFieldsAndStepValid = await triggerFieldsAndStepValidation(
      innerStoreApi,
      {
        shouldFocusInvalidField:
          currentStep.validationOptions.shouldFocusFirstInvalidField,
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
          formStore.isSubmitting = false
          formStore.submitError = null
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

  const onSubmit = configuration.events?.onSubmit || params?.onSubmit
  const onSubmitSuccess =
    configuration.events?.onSubmitSuccess || params?.onSubmitSuccess
  const onSubmitError =
    configuration.events?.onSubmitError || params?.onSubmitError

  try {
    if (onSubmit) {
      await onSubmit()
    }

    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.isSubmitting = false
        formStore.submitError = null
        formStore.didSubmitSuccessfully = true
        formStore.eventHistory.push({
          type: 'submit',
          stepName: currentStep.name,
        })
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'success'])
    )

    if (onSubmitSuccess) {
      onSubmitSuccess()
    }
  } catch (error) {
    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.isSubmitting = false
        formStore.submitError = error as Error
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'error'])
    )

    if (onSubmitError) {
      onSubmitError()
    }
  }
}
