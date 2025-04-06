import { FormFieldComponent, FormStore, InnerStoreApi } from '../types'
import { getComponentConfiguration } from './get-component-configuration'
import { getStepFields } from './get-step-fields'

export const getStepRequiredFields = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[stepName]: Parameters<FormStore['getStepRequiredFields']>
) => {
  const relevantFields = Object.values(getStepFields(innerStoreApi, stepName))
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
