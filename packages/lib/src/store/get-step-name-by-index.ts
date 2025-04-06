import { FormStore, InnerStoreApi } from '../types'

export const getStepNameByIndex = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[stepIndex]: Parameters<FormStore['getStepNameByIndex']>
) => {
  const {
    configuration: { steps },
  } = innerStoreApi.getStoreState()

  return steps[stepIndex]?.name || ''
}
