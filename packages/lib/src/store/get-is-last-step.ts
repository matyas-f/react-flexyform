import { InnerStoreApi } from '../types'
import { getCurrentStepIndex } from './get-current-step-index'

export const getIsLastStep = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const {
    configuration: { steps },
  } = innerStoreApi.getStoreState()

  const currentStepIndex = getCurrentStepIndex(innerStoreApi)

  return currentStepIndex === steps.length - 1
}
