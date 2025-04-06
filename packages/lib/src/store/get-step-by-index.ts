import { FormStore, InnerStoreApi } from '../types'

export const getStepByIndex = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[stepIndex]: Parameters<FormStore['getStepByIndex']>
) => {
  const {
    configuration: { steps },
  } = innerStoreApi.getStoreState()

  return steps[stepIndex]
}
