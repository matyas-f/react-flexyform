import { debounce } from 'lodash'
import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { getCurrentStep } from './get-current-step'

export const triggerStepSyncValidation = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || [])],
  }
  const {
    configuration: { formId },
  } = innerStoreApi.getStoreState()
  const currentStep = getCurrentStep(innerStoreApi)

  if (!currentStep.validate) {
    return true
  }

  innerStoreApi.cache.stepValidation
    .getAsyncDebouncedFunction(formId, currentStep.name)
    ?.cancel()

  const stepValidationError = currentStep.validate()

  if (stepValidationError) {
    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.isValidatingStep = false
        formStore.stepValidationError = stepValidationError
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy])
    )

    return false
  }

  if (!stepValidationError && !currentStep.validateAsync) {
    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.isValidatingStep = false
        formStore.stepValidationError = ''
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy])
    )
  }

  return true
}

export const triggerStepAsyncValidation = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'asyncValidation'],
  }
  const {
    configuration: { formId },
  } = innerStoreApi.getStoreState()
  const currentStep = getCurrentStep(innerStoreApi)

  if (!currentStep.validateAsync) {
    return true
  }

  const triggerId =
    innerStoreApi.cache.stepValidation.getLastTriggerId(
      formId,
      currentStep.name
    ) + 1

  try {
    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.isValidatingStep = true

        innerStoreApi.cache.stepValidation.setLastTriggerId(
          formId,
          currentStep.name,
          triggerId
        )
        innerStoreApi.cache.stepValidation
          .getLastTriggerAbortController(formId, currentStep.name)
          ?.abort('There was a new step validation triggered')
        innerStoreApi.cache.stepValidation.setLastTriggerAbortController(
          formId,
          currentStep.name,
          new AbortController()
        )
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'initiating'])
    )

    const stepValidationError = await currentStep.validateAsync(
      innerStoreApi.cache.stepValidation.getLastTriggerAbortController(
        formId,
        currentStep.name
      ) as AbortController
    )

    if (stepValidationError) {
      innerStoreApi.setStoreState(
        (formStore) => {
          if (
            innerStoreApi.cache.stepValidation.getLastTriggerId(
              formId,
              currentStep.name
            ) === triggerId
          ) {
            formStore.isValidatingStep = false
            formStore.stepValidationError = stepValidationError
          }
        },
        false,
        getReduxDevtoolsDebugLabel([
          ...innerStoreApi.calledBy,
          'stepValidationError',
        ])
      )

      return false
    }

    innerStoreApi.setStoreState(
      (formStore) => {
        if (
          innerStoreApi.cache.stepValidation.getLastTriggerId(
            formId,
            currentStep.name
          ) === triggerId
        ) {
          formStore.isValidatingStep = false
          formStore.stepValidationError = ''

          innerStoreApi.cache.stepValidation.clearLastTriggerAbortController(
            formId,
            currentStep.name
          )
        }
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'success'])
    )

    return true
  } catch (error) {
    innerStoreApi.setStoreState(
      (formStore) => {
        if (
          innerStoreApi.cache.stepValidation.getLastTriggerId(
            formId,
            currentStep.name
          ) === triggerId
        ) {
          formStore.isValidatingStep = false
          formStore.stepValidationError = (error as Error).message

          innerStoreApi.cache.stepValidation.clearLastTriggerAbortController(
            formId,
            currentStep.name
          )
        }
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'error'])
    )

    return false
  }
}

export const triggerStepValidation = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[options]: Parameters<FormStore['triggerStepValidation']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'triggerStepValidation'],
  }
  const {
    configuration: { formId },
  } = innerStoreApi.getStoreState()
  const currentStep = getCurrentStep(innerStoreApi)
  const {
    validationOptions: {
      stepAsyncValidationDebounceDurationInMs,
      stepValidationDebounceDurationInMs,
    },
  } = currentStep
  const { useDebounce } = options || {}

  let syncValidationPredicate = true
  let asyncValidationPredicate = true

  if (
    useDebounce &&
    stepValidationDebounceDurationInMs &&
    currentStep.validate
  ) {
    const debouncedTriggerSyncStepValidation =
      innerStoreApi.cache.stepValidation.setAndReturnSyncDebouncedFunction(
        formId,
        currentStep.name,
        debounce(
          () => triggerStepSyncValidation(innerStoreApi),
          stepValidationDebounceDurationInMs
        )
      )

    syncValidationPredicate = debouncedTriggerSyncStepValidation() || false
  } else {
    syncValidationPredicate = triggerStepSyncValidation(innerStoreApi)
  }

  if (syncValidationPredicate === false) {
    innerStoreApi.cache.stepValidation
      .getAsyncDebouncedFunction(formId, currentStep.name)
      ?.cancel()
    return false
  }

  if (
    useDebounce &&
    stepAsyncValidationDebounceDurationInMs &&
    currentStep.validateAsync
  ) {
    const debouncedTriggerAsyncStepValidation =
      innerStoreApi.cache.stepValidation.setAndReturnAsyncDebouncedFunction(
        formId,
        currentStep.name,
        debounce(
          async () => triggerStepAsyncValidation(innerStoreApi),
          stepAsyncValidationDebounceDurationInMs
        )
      )

    asyncValidationPredicate =
      (await debouncedTriggerAsyncStepValidation()) || false
  } else {
    asyncValidationPredicate = await triggerStepAsyncValidation(innerStoreApi)
  }

  if (asyncValidationPredicate === false) {
    return false
  }

  return true
}
