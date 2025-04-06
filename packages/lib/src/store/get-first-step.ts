import { InnerStoreApi, Step } from '../types'

export const getFirstStep = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const {
    configuration: { steps },
  } = innerStoreApi.getStoreState()

  return steps[0] as Step<TFormFields>
}
