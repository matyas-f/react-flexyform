import { FormStore, InnerStoreApi } from '../types'

export const getStepByName = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[stepName]: Parameters<FormStore['getStepByName']>
) => {
  const {
    configuration: { steps },
  } = innerStoreApi.getStoreState()

  return steps.find((step) => step.name === stepName)
}
