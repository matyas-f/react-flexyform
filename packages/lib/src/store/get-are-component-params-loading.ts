import { FormStore, InnerStoreApi } from '../types'
import { getComponentParamsName } from '../utils/name-generators'

export const getAreComponentParamsLoading = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[componentName]: Parameters<FormStore['getAreComponentParamsLoading']>
) => {
  const { componentParams, getCurrentStep } = innerStoreApi.getStoreState()

  const currentStep = getCurrentStep()

  const componentParamsName = getComponentParamsName({
    stepName: currentStep.name,
    componentName,
  })

  return componentParams[componentParamsName]?.isLoading || false
}
