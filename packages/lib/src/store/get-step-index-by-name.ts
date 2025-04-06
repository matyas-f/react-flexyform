import { FormStore, InnerStoreApi } from '../types'

export const getStepIndexByName = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[stepName]: Parameters<FormStore['getStepIndexByName']>
) => {
  const {
    configuration: { steps },
  } = innerStoreApi.getStoreState()

  return steps.findIndex((step) => step.name === stepName)
}
