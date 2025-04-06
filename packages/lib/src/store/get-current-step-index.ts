import { InnerStoreApi } from '../types'

export const getCurrentStepIndex = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const { currentStepName, getStepIndexByName } = innerStoreApi.getStoreState()

  return getStepIndexByName(currentStepName)
}
