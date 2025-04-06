import { FormStore, InnerStoreApi } from '../types'

export const getFieldNamesByStepIndex = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[stepIndex]: Parameters<FormStore['getFieldNamesByStepIndex']>
) => {
  const { getStepByIndex } = innerStoreApi.getStoreState()

  const step = getStepByIndex(stepIndex)

  if (!step) {
    return []
  }

  return step.components
    .filter((component) => component.type === 'field')
    .map((field) => field.name)
}
