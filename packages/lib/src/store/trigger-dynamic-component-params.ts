import { nanoid } from 'nanoid'
import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { getComponentParamsName } from '../utils/name-generators'
import { getComponentConfiguration } from './get-component-configuration'
import { getComponentStep } from './get-component-step'
import { setComponentParams } from './set-component-params'
import { parseNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'

export const triggerDynamicComponentParams = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[componentName]: Parameters<FormStore['triggerDynamicComponentParams']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [
      ...(_innerStoreApi.calledBy || []),
      'triggerDynamicComponentParams',
    ],
  }

  const {
    configuration: { formId },
  } = innerStoreApi.getStoreState()

  const componentConfiguration = getComponentConfiguration(
    innerStoreApi,
    componentName
  )

  if (typeof componentConfiguration?.componentParams?.value !== 'function') {
    return
  }

  const stepNameOfComponent = getComponentStep(
    innerStoreApi,
    componentName
  ).name
  const componentParamsName = getComponentParamsName({
    stepName: stepNameOfComponent,
    componentName,
  })
  const { nestedItemIndex } = parseNestedArrayItemFieldName(componentName)

  const triggerId = nanoid()

  try {
    innerStoreApi.setStoreState(
      (formStore) => {
        if (formStore.componentParams[componentParamsName]) {
          formStore.componentParams[componentParamsName].isLoading = true

          innerStoreApi.cache.dynamicComponentParams.setLastTriggerId(
            formId,
            componentName,
            triggerId
          )
          innerStoreApi.cache.dynamicComponentParams
            .getLastTriggerAbortController(formId, componentName)
            ?.abort('There was a new dynamic component params trigger')
          innerStoreApi.cache.dynamicComponentParams.setLastTriggerAbortController(
            formId,
            componentName,
            new AbortController()
          )

          if (
            formStore.componentParams[componentParamsName].value &&
            componentConfiguration.componentParams?.staticPart
          ) {
            formStore.componentParams[componentParamsName].value = {
              ...componentConfiguration.componentParams.staticPart,
              ...formStore.componentParams[componentParamsName].value,
            }
          }
        } else {
          formStore.componentParams[componentParamsName] = {
            isLoading: true,
            loadingError: null,
            value: componentConfiguration.componentParams?.staticPart
              ? componentConfiguration.componentParams.staticPart
              : {},
          }
        }
      },
      false,
      getReduxDevtoolsDebugLabel([
        `tiggerDynamicComponentParams(${componentName}):initializing`,
      ])
    )

    const newComponentParams =
      await componentConfiguration.componentParams.value(
        nestedItemIndex,
        innerStoreApi.cache.dynamicComponentParams.getLastTriggerAbortController(
          formId,
          componentName
        ) as AbortController
      )

    if (
      innerStoreApi.cache.dynamicComponentParams.getLastTriggerId(
        formId,
        componentName
      ) === triggerId
    ) {
      setComponentParams(innerStoreApi, componentName, newComponentParams)
    }

    innerStoreApi.setStoreState(
      (formStore) => {
        if (
          formStore.componentParams[componentParamsName] &&
          innerStoreApi.cache.dynamicComponentParams.getLastTriggerId(
            formId,
            componentName
          ) === triggerId
        ) {
          formStore.componentParams[componentParamsName].isLoading = false
          formStore.componentParams[componentParamsName].loadingError = null

          innerStoreApi.cache.dynamicComponentParams.clearLastTriggerAbortController(
            formId,
            componentName
          )
        }
      },
      false,
      getReduxDevtoolsDebugLabel([
        `tiggerDynamicComponentParams(${componentName}):success`,
      ])
    )
  } catch (error) {
    innerStoreApi.setStoreState(
      (formStore) => {
        if (
          formStore.componentParams[componentParamsName] &&
          innerStoreApi.cache.dynamicComponentParams.getLastTriggerId(
            formId,
            componentName
          ) === triggerId
        ) {
          formStore.componentParams[componentParamsName].isLoading = false
          formStore.componentParams[componentParamsName].loadingError =
            error as Error

          innerStoreApi.cache.dynamicComponentParams.clearLastTriggerAbortController(
            formId,
            componentName
          )
        }
      },
      false,
      getReduxDevtoolsDebugLabel([
        `tiggerDynamicComponentParams(${componentName}):error`,
      ])
    )
  }
}
