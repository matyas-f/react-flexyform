import { nanoid } from 'nanoid'
import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { getCurrentStep } from './get-current-step'
import { debounce } from 'lodash'

const _triggerAutoSave = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  params: Parameters<FormStore['triggerAutoSave']>[0]
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'triggerAutoSave'],
  }
  const { configuration, fields } = innerStoreApi.getStoreState()
  const { formId } = configuration
  const { autoSaveOptions } = getCurrentStep(innerStoreApi)

  if (
    params?.fieldName &&
    !autoSaveOptions?.ignoreValidation &&
    (fields[params.fieldName]?.validationError ||
      fields[params.fieldName]?.isValidating)
  ) {
    return
  }

  const triggerId = nanoid()

  const onAutoSave = configuration?.events?.onAutoSave || params?.onAutoSave
  const onAutoSaveSuccess =
    configuration?.events?.onAutoSaveSuccess || params?.onAutoSaveSuccess
  const onAutoSaveError =
    configuration?.events?.onAutoSaveError || params?.onAutoSaveError

  try {
    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.isAutoSaving = true

        innerStoreApi.cache.autoSave.setLastTriggerId(formId, triggerId)
        innerStoreApi.cache.autoSave
          .getLastTriggerAbortController(formId)
          ?.abort('There was a new auto save triggered')
        innerStoreApi.cache.autoSave.setLastTriggerAbortController(
          formId,
          new AbortController()
        )
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'initiating'])
    )

    if (onAutoSave) {
      await onAutoSave(
        innerStoreApi.cache.autoSave.getLastTriggerAbortController(
          formId
        ) as AbortController
      )
    }

    innerStoreApi.setStoreState(
      (formStore) => {
        if (
          innerStoreApi.cache.autoSave.getLastTriggerId(formId) === triggerId
        ) {
          formStore.isAutoSaving = false
          formStore.autoSaveError = null

          innerStoreApi.cache.autoSave.clearLastTriggerAbortController(formId)
        }
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'success'])
    )

    if (onAutoSaveSuccess) {
      onAutoSaveSuccess()
    }
  } catch (error) {
    innerStoreApi.setStoreState(
      (formStore) => {
        if (
          innerStoreApi.cache.autoSave.getLastTriggerId(formId) === triggerId
        ) {
          formStore.isAutoSaving = false
          formStore.autoSaveError = error as Error

          innerStoreApi.cache.autoSave.clearLastTriggerAbortController(formId)
        }
      },
      false,
      getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'error'])
    )

    if (onAutoSaveError) {
      onAutoSaveError()
    }
  }
}

export const triggerAutoSave = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[options]: Parameters<FormStore<TFormFields>['triggerAutoSave']>
) => {
  const {
    configuration: { formId },
  } = innerStoreApi.getStoreState()
  const currentStep = getCurrentStep(innerStoreApi)
  const {
    autoSaveOptions: { autoSaveDebounceDurationInMs },
  } = currentStep

  if (options?.useDebounce && autoSaveDebounceDurationInMs) {
    innerStoreApi.cache.autoSave.setAndReturnDebouncedFunction(
      formId,
      currentStep.name,
      debounce(
        (params: Parameters<FormStore<TFormFields>['triggerAutoSave']>[0]) =>
          _triggerAutoSave(innerStoreApi, params),
        autoSaveDebounceDurationInMs
      )
    )(options)
  } else {
    await _triggerAutoSave(innerStoreApi, options)
  }
}
