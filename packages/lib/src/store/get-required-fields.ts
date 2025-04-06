import { FormFieldComponent, InnerStoreApi } from '../types'
import { getAllFields } from './get-all-fields'
import { getComponentConfiguration } from './get-component-configuration'

export const getRequiredFields = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const relevantFields = Object.values(getAllFields(innerStoreApi))
    .map((field) => {
      const fieldConfiguration = getComponentConfiguration(
        innerStoreApi,
        field.name
      ) as FormFieldComponent | undefined

      if (
        !fieldConfiguration ||
        !fieldConfiguration.validationRules?.required
      ) {
        return null
      }

      return fieldConfiguration
    })
    .filter(Boolean)

  return relevantFields as FormFieldComponent<TFormFields>[]
}
