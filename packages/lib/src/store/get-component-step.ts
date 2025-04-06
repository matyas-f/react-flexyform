import { InnerStoreApi } from '../types'
import { parseNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'

export const getComponentStep = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  componentName: string
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'setComponentParams'],
  }

  const {
    getCurrentStep,
    configuration: { steps },
  } = innerStoreApi.getStoreState()

  const { isNestedArrayItem, parentFieldName } =
    parseNestedArrayItemFieldName(componentName)

  const stepOfComponent =
    steps.find((step) =>
      step.components.some(
        (c) => c.name === (isNestedArrayItem ? parentFieldName : componentName)
      )
    ) || getCurrentStep()

  return stepOfComponent
}
