import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { getCurrentStep } from './get-current-step'
import { getShouldTriggerValidation } from './get-should-trigger-validation'
import { getStepIndexByName } from './get-step-index-by-name'
import { getStepNameByIndex } from './get-step-name-by-index'
import { resetFieldsForStep } from './reset-fields-for-step'
import { setStepInitialValues } from './set-step-initial-values'
import { triggerFieldsAndStepValidation } from './trigger-fields-and-step-validation'

export const triggerGoToNextStep = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[params]: Parameters<FormStore['triggerGoToNextStep']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'triggerGoToNextStep'],
  }

  const {
    didTriggerRevalidationModeForStep,
    getCurrentStepIndex,
    configuration,
    isChangingStep,
  } = innerStoreApi.getStoreState()
  const currentStep = getCurrentStep(innerStoreApi)

  if (
    getCurrentStepIndex() === configuration.steps.length - 1 ||
    isChangingStep
  ) {
    return
  }

  innerStoreApi.setStoreState(
    (formStore) => {
      formStore.isChangingStep = true
      formStore.isGoingToNextStep = true
    },
    false,
    getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'initiating'])
  )

  const shouldValidateFieldsBeforeGoingToNextStep = getShouldTriggerValidation(
    innerStoreApi,
    { validationTrigger: 'goToNextStep', isStepValidation: false }
  )

  const shouldValidateStepBeforeGoingToNextStep = getShouldTriggerValidation(
    innerStoreApi,
    { validationTrigger: 'goToNextStep', isStepValidation: true }
  )

  if (
    shouldValidateFieldsBeforeGoingToNextStep ||
    shouldValidateStepBeforeGoingToNextStep
  ) {
    const areFieldsAndStepValid = await triggerFieldsAndStepValidation(
      innerStoreApi,
      {
        shouldFocusInvalidField:
          currentStep.validationOptions.shouldFocusFirstInvalidField,
        skipFieldsValidation: !shouldValidateFieldsBeforeGoingToNextStep,
        skipStepValidation: !shouldValidateStepBeforeGoingToNextStep,
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
          formStore.isGoingToNextStep = false
          formStore.stepChangeError = null
        },
        false,
        getReduxDevtoolsDebugLabel([
          ...innerStoreApi.calledBy,
          'initiating:validationFailed',
        ])
      )
      return
    }
  }

  const onGoToNextStep =
    configuration.events?.onGoToNextStep || params?.onGoToNextStep
  const onGoToNextStepError =
    configuration.events?.onGoToNextStepError || params?.onGoToNextStepError
  const onGoToNextStepSuccess =
    configuration.events?.onGoToNextStepSuccess || params?.onGoToNextStepSuccess

  try {
    if (onGoToNextStep) {
      await onGoToNextStep()
    }

    let newStepIndex = currentStep.nextStepDestination
      ? getStepIndexByName(innerStoreApi, currentStep.nextStepDestination())
      : getCurrentStepIndex() + 1
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
        formStore.isGoingToNextStep = false
        formStore.stepChangeError = null
        formStore.didTriggerRevalidationModeForStep = false
        formStore.currentStepName = destinationStepName
        formStore.eventHistory.push({
          type: 'goToNextStep',
          stepName: currentStep.name,
        })
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'success'])
    )

    resetFieldsForStep(innerStoreApi, currentStep.name, {
      shouldKeepValue: true,
    })

    resetFieldsForStep(innerStoreApi, destinationStepName, {
      shouldKeepValue: true,
    })

    setStepInitialValues(innerStoreApi, destinationStepName)

    if (onGoToNextStepSuccess) {
      onGoToNextStepSuccess()
    }
  } catch (error) {
    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.isChangingStep = false
        formStore.isGoingToNextStep = false
        formStore.stepChangeError = error as Error
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'error'])
    )

    if (onGoToNextStepError) {
      onGoToNextStepError()
    }
  }
}
