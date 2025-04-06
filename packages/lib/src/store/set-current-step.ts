import { Direction, FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { getStepIndexByName } from './get-step-index-by-name'
import { resetFieldsForStep } from './reset-fields-for-step'

export const setCurrentStep = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[newStepName]: Parameters<FormStore['setCurrentStep']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'setCurrentStep'],
  }

  const { lastDirection, stepHistory, currentStepName } =
    innerStoreApi.getStoreState()

  const isSameStep = currentStepName === newStepName
  let newLastDirection: Direction = lastDirection
  const newStepHistory = [...stepHistory]

  if (!isSameStep) {
    if (
      getStepIndexByName(innerStoreApi, newStepName) >
      getStepIndexByName(
        innerStoreApi,
        stepHistory[stepHistory.length - 1] || 'default-step'
      )
    ) {
      newLastDirection = 'next'
    }

    if (
      getStepIndexByName(innerStoreApi, newStepName) <
      getStepIndexByName(
        innerStoreApi,
        stepHistory[stepHistory.length - 1] || 'default-step'
      )
    ) {
      newLastDirection = 'previous'
    }

    newStepHistory.push(newStepName)

    resetFieldsForStep(innerStoreApi, newStepName, {
      shouldKeepValue: true,
    })

    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.currentStepName = newStepName
        formStore.stepHistory = newStepHistory
        formStore.lastDirection = newLastDirection
        formStore.didTriggerRevalidationModeForStep = false
        formStore.stepValidationError = ''
        formStore.isValidatingStep = false
      },
      false,
      getReduxDevtoolsDebugLabel(innerStoreApi.calledBy, { newStepName })
    )
  }

  return {
    currentStepName: newStepName,
    lastDirection: newLastDirection,
    stepHistory: newStepHistory,
  }
}
