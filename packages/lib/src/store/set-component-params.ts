import { FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { getComponentParamsName } from '../utils/name-generators'
import { getComponentParams } from './get-component-params'
import { getComponentStep } from './get-component-step'

export const setComponentParams = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[componentName, newComponentParams]: Parameters<
    FormStore['setComponentParams']
  >
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'setComponentParams'],
  }

  const stepNameOfComponent = getComponentStep(
    innerStoreApi,
    componentName
  ).name

  const componentParamsName = getComponentParamsName({
    stepName: stepNameOfComponent,
    componentName,
  })

  const currentComponentParams = getComponentParams(
    innerStoreApi,
    componentName
  )

  innerStoreApi.setStoreState(
    (formStore) => {
      if (
        !newComponentParams &&
        formStore.componentParams[componentParamsName]
      ) {
        delete formStore.componentParams[componentParamsName]
        return
      }

      if (
        newComponentParams &&
        formStore.componentParams[componentParamsName]
      ) {
        formStore.componentParams[componentParamsName].value = {
          ...currentComponentParams,
          ...newComponentParams,
        }
        return
      }

      if (
        newComponentParams &&
        !formStore.componentParams[componentParamsName]
      ) {
        formStore.componentParams[componentParamsName] = {
          isLoading: false,
          loadingError: null,
          value: newComponentParams,
        }
      }
    },
    false,
    getReduxDevtoolsDebugLabel(innerStoreApi.calledBy, {
      componentName,
      newComponentParams,
    })
  )
}
