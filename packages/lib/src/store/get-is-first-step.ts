import { InnerStoreApi } from '../types'
import { getCurrentStepIndex } from './get-current-step-index'

export const getIsFirstStep = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const currentStepIndex = getCurrentStepIndex(innerStoreApi)

  return currentStepIndex === 0
}
