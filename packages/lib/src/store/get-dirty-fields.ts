import { FormFieldComponent, InnerStoreApi } from '../types'
import { getComponentConfiguration } from './get-component-configuration'

export const getDirtyFields = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const { fields } = innerStoreApi.getStoreState()

  return Object.entries(fields).reduce(
    (result, [fieldName, fieldProperties]) => {
      if (fieldProperties.isDirty) {
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
