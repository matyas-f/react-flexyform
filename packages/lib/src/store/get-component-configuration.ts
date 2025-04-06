import { FormComponent, FormStore, InnerStoreApi } from '../types'
import { parseNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'
import { getComponentStep } from './get-component-step'

export const getComponentConfiguration = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[componentName]: Parameters<FormStore['getComponentConfiguration']>
) => {
  const { isNestedArrayItem, parentFieldName, nestedItemComponentName } =
    parseNestedArrayItemFieldName(componentName)

  if (isNestedArrayItem) {
    const stepName = getComponentStep(innerStoreApi, parentFieldName).name

    return innerStoreApi.cache.componentConfiguration.get(
      `${stepName}-${parentFieldName}.${nestedItemComponentName}`
    ) as FormComponent<TFormFields> | undefined
  }

  const stepName = getComponentStep(innerStoreApi, componentName).name

  return innerStoreApi.cache.componentConfiguration.get(
    `${stepName}-${componentName}`
  ) as FormComponent<TFormFields> | undefined
}
