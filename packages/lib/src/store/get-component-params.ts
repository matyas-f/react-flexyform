import { FormStore, InnerStoreApi } from '../types'
import { getComponentParamsName } from '../utils/name-generators'
import { getComponentStep } from './get-component-step'

export const getComponentParams = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[componentName]: Parameters<FormStore['getComponentParams']>
) => {
  const { componentParams } = innerStoreApi.getStoreState()

  const componentStepName = getComponentStep(innerStoreApi, componentName).name

  const componentParamsName = getComponentParamsName({
    stepName: componentStepName,
    componentName,
  })

  return componentParams[componentParamsName]?.value || {}
}
