import { FormFieldComponent, InnerStoreApi } from '../types'
import { getComponentConfiguration } from './get-component-configuration'

export const getInvalidFields = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const { fields } = innerStoreApi.getStoreState()

  return Object.entries(fields).reduce(
    (result, [fieldName, fieldProperties]) => {
      if (fieldProperties.validationError) {
        return [
          ...result,
          getComponentConfiguration(
            innerStoreApi,
            fieldName
          ) as FormFieldComponent<TFormFields>,
        ]
      }

      return result
    },
    [] as FormFieldComponent<TFormFields>[]
  )
}
