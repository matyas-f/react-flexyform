import { InnerStoreApi } from '../types'

export const getNextStepName = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  _stepName?: string
) => {
  const {
    configuration: { steps },
    getCurrentStep,
  } = innerStoreApi.getStoreState()

  const stepName = _stepName || getCurrentStep().name

  const stepIndex = steps.findIndex((step) => step.name === stepName)

  if (stepIndex === -1) {
    return ''
  }

  return steps[stepIndex + 1]?.name || ''
}
