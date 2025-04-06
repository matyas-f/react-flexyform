import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { getCurrentStep } from './get-current-step'
import { getShouldTriggerValidation } from './get-should-trigger-validation'
import { getStepIndexByName } from './get-step-index-by-name'
import { getStepNameByIndex } from './get-step-name-by-index'
import { resetFieldsForStep } from './reset-fields-for-step'
import { setStepInitialValues } from './set-step-initial-values'
import { triggerFieldsAndStepValidation } from './trigger-fields-and-step-validation'

export const triggerGoToPreviousStep = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[params]: Parameters<FormStore['triggerGoToPreviousStep']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'triggerGoToPreviousStep'],
  }
  const {
    didTriggerRevalidationModeForStep,
    getCurrentStepIndex,
    configuration,
    isChangingStep,
  } = innerStoreApi.getStoreState()
  const currentStep = getCurrentStep(innerStoreApi)

  if (getCurrentStepIndex() === 0 || isChangingStep) {
    return
  }

  innerStoreApi.setStoreState(
    (formStore) => {
      formStore.isChangingStep = true
      formStore.isGoingToPreviousStep = true
    },
    false,
    getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'initiating'])
  )

  const shouldValidateFieldsBeforeGoingToPreviousStep =
    getShouldTriggerValidation(innerStoreApi, {
      validationTrigger: 'goToPreviousStep',
      isStepValidation: false,
    })

  const shouldValidateStepBeforeGoingToPreviousStep =
    getShouldTriggerValidation(innerStoreApi, {
      validationTrigger: 'goToPreviousStep',
      isStepValidation: true,
    })

  if (
    shouldValidateFieldsBeforeGoingToPreviousStep ||
    shouldValidateStepBeforeGoingToPreviousStep
  ) {
    const areFieldsAndStepValid = await triggerFieldsAndStepValidation(
      innerStoreApi,
      {
        shouldFocusInvalidField:
          currentStep.validationOptions.shouldFocusFirstInvalidField,
        skipFieldsValidation: !shouldValidateFieldsBeforeGoingToPreviousStep,
        skipStepValidation: !shouldValidateStepBeforeGoingToPreviousStep,
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
          formStore.isGoingToPreviousStep = false
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

  const onGoToPreviousStep =
    configuration.events?.onGoToPreviousStep || params?.onGoToPreviousStep
  const onGoToPreviousStepSuccess =
    configuration.events?.onGoToPreviousStepSuccess ||
    params?.onGoToPreviousStepSuccess
  const onGoToPreviousStepError =
    configuration.events?.onGoToPreviousStepError ||
    params?.onGoToPreviousStepError

  try {
    if (onGoToPreviousStep) {
      await onGoToPreviousStep()
    }

    let newStepIndex = currentStep.previousStepDestination
      ? getStepIndexByName(innerStoreApi, currentStep.previousStepDestination())
      : getCurrentStepIndex() - 1
    let shouldContinueToCheck = true

    while (shouldContinueToCheck) {
      const shouldSkip =
        configuration.steps[newStepIndex]?.shouldSkipWhenGoingToPreviousStep ||
        configuration.steps[newStepIndex]?.shouldSkip

      if (shouldSkip?.() && newStepIndex > 0) {
        newStepIndex = newStepIndex - 1
      } else {
        shouldContinueToCheck = false
      }
    }

    const destinationStepName = getStepNameByIndex(innerStoreApi, newStepIndex)

    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.isChangingStep = false
        formStore.isGoingToPreviousStep = false
        formStore.stepChangeError = null
        formStore.didTriggerRevalidationModeForStep = false
        formStore.currentStepName = destinationStepName
        formStore.eventHistory.push({
          type: 'goToPreviousStep',
          stepName: currentStep.name,
        })
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'success'])
    )

    resetFieldsForStep(innerStoreApi, currentStep.name, {
      shouldKeepValue: params?.shouldKeepFieldValues,
    })

    resetFieldsForStep(innerStoreApi, destinationStepName, {
      shouldKeepValue: true,
    })

    setStepInitialValues(innerStoreApi, destinationStepName)

    if (onGoToPreviousStepSuccess) {
      onGoToPreviousStepSuccess()
    }
  } catch (error) {
    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.isChangingStep = false
        formStore.isGoingToPreviousStep = false
        formStore.stepChangeError = error as Error
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'error'])
    )

    if (onGoToPreviousStepError) {
      onGoToPreviousStepError()
    }
  }
}
