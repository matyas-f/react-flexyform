import { InnerStoreApi } from '../types'
import { parseNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'
import { getCurrentStep } from './get-current-step'
import { triggerDynamicComponentParams } from './trigger-dynamic-component-params'

export const triggerAllDynamicComponentParamsForStep = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [
      ...(_innerStoreApi.calledBy || []),
      'triggerAllDynamicComponentParamsForStep',
    ],
  }

  const { fields } = innerStoreApi.getStoreState()
  const currentStep = getCurrentStep(innerStoreApi)

  const triggerDynamicComponentParamsPromises: Promise<any>[] = []

  currentStep.components.forEach((component) => {
    if (typeof component.componentParams?.value === 'function') {
      triggerDynamicComponentParamsPromises.push(
        triggerDynamicComponentParams(innerStoreApi, component.name)
      )
    }
  })

  Object.keys(fields).forEach((fieldName) => {
    const { isNestedArrayItem } = parseNestedArrayItemFieldName(fieldName)

    if (isNestedArrayItem) {
      triggerDynamicComponentParamsPromises.push(
        triggerDynamicComponentParams(innerStoreApi, fieldName)
      )
    }
  })

  if (triggerDynamicComponentParamsPromises.length) {
    await Promise.all(triggerDynamicComponentParamsPromises)
  }
}
