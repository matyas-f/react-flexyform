import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { getCurrentStep } from './get-current-step'
import { getShouldTriggerValidation } from './get-should-trigger-validation'
import { getStepNameByIndex } from './get-step-name-by-index'
import { resetFieldsForStep } from './reset-fields-for-step'
import { setStepInitialValues } from './set-step-initial-values'
import { triggerFieldsAndStepValidation } from './trigger-fields-and-step-validation'

export const triggerGoToStep = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[params]: Parameters<FormStore['triggerGoToStep']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'triggerGoToStep'],
  }
  const {
    didTriggerRevalidationModeForStep,
    getStepIndexByName,
    configuration,
    isChangingStep,
  } = innerStoreApi.getStoreState()
  const currentStep = getCurrentStep(innerStoreApi)

  const initialNewStepIndex = getStepIndexByName(params.stepName)

  if (!initialNewStepIndex || isChangingStep) {
    return
  }

  innerStoreApi.setStoreState(
    (formStore) => {
      formStore.isChangingStep = true
    },
    false,
    getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'initiating'])
  )

  const shouldValidateFieldsBeforeGoingToStep = getShouldTriggerValidation(
    innerStoreApi,
    { validationTrigger: 'goToStep', isStepValidation: false }
  )

  const shouldValidateStepBeforeGoingToStep = getShouldTriggerValidation(
    innerStoreApi,
    { validationTrigger: 'goToStep', isStepValidation: true }
  )

  if (
    shouldValidateFieldsBeforeGoingToStep ||
    shouldValidateStepBeforeGoingToStep
  ) {
    const areFieldsAndStepValid = await triggerFieldsAndStepValidation(
      innerStoreApi,
      {
        shouldFocusInvalidField:
          currentStep.validationOptions.shouldFocusFirstInvalidField,
        skipFieldsValidation: !shouldValidateFieldsBeforeGoingToStep,
        skipStepValidation: !shouldValidateStepBeforeGoingToStep,
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
          formStore.isChangingStep = false
          formStore.stepChangeError = null
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

  const onGoToStep = configuration?.events?.onGoToStep || params?.onGoToStep
  const onGoToStepSuccess =
    configuration?.events?.onGoToStepSuccess || params?.onGoToStepSuccess
  const onGoToStepError =
    configuration?.events?.onGoToStepError || params?.onGoToStepError

  try {
    if (onGoToStep) {
      await onGoToStep()
    }

    let newStepIndex = initialNewStepIndex
    let shouldContinueToCheck = true

    while (shouldContinueToCheck) {
      const shouldSkip =
        configuration.steps[newStepIndex]?.shouldSkipWhenGoingToNextStep ||
        configuration.steps[newStepIndex]?.shouldSkip

      if (shouldSkip?.() && newStepIndex !== configuration.steps.length - 1) {
        newStepIndex = newStepIndex + 1
      } else {
        shouldContinueToCheck = false
      }
    }

    const destinationStepName = getStepNameByIndex(innerStoreApi, newStepIndex)

    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.isChangingStep = false
        formStore.stepChangeError = null
        formStore.didTriggerRevalidationModeForStep = false
        formStore.currentStepName = destinationStepName
        formStore.eventHistory.push({
          type: 'goToStep',
          stepName: params.stepName,
        })
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'success'])
    )

    resetFieldsForStep(innerStoreApi, destinationStepName, {
      shouldKeepValue: true,
    })

    setStepInitialValues(innerStoreApi, destinationStepName)

    if (onGoToStepSuccess) {
      onGoToStepSuccess()
    }
  } catch (error) {
    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.isChangingStep = false
        formStore.stepChangeError = error as Error
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'error'])
    )

    if (onGoToStepError) {
      onGoToStepError()
    }
  }
}
