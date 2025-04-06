import { InnerStoreApi, Step } from '../types'

export const getLastStep = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const {
    configuration: { steps },
  } = innerStoreApi.getStoreState()

  return steps[steps.length - 1] as Step<TFormFields>
}
