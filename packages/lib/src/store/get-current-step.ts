import { InnerStoreApi } from '../types'

export const getCurrentStep = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const { currentStepName, getStepByName } = innerStoreApi.getStoreState()

  return getStepByName(currentStepName)!
}
