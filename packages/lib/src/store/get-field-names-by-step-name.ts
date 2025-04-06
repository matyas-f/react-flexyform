import { FormStore, InnerStoreApi } from '../types'

export const getFieldNamesByStepName = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[_stepName]: Parameters<FormStore['getFieldNamesByStepName']>
) => {
  const { getStepByName, getCurrentStep } = innerStoreApi.getStoreState()

  const stepName = _stepName || getCurrentStep().name

  const step = getStepByName(stepName)

  if (!step) {
    return []
  }

  return step.components
    .filter((component) => component.type === 'field')
    .map((field) => field.name)
}
