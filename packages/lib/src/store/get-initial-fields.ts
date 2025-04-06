import {
  Field,
  Fields,
  FormFieldComponent,
  FormStoreConfiguration,
  StringKeyOf,
} from '../types'
import { getInitialField } from './get-initial-field'

export const getInitialFields = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  configuration: FormStoreConfiguration<TFormFields>,
  formId: string,
  initialDataOverrides?: TFormFields
) => {
  const initialDataFromConfiguration =
    typeof configuration.initialData === 'object'
      ? (configuration.initialData as TFormFields)
      : ({} as TFormFields)

  const fieldInternals = configuration.steps.reduce<{
    [FieldName in StringKeyOf<TFormFields>]: Field<
      TFormFields[FieldName],
      TFormFields
    >
  }>((result, step) => {
    const stepFields = step.components
      .filter((component) => component.type === 'field')
      .reduce((stepFieldsObj, field) => {
        return {
          ...stepFieldsObj,
          [field.name]: getInitialField(
            field as FormFieldComponent<TFormFields>,
            step,
            formId,
            initialDataOverrides && field.name in initialDataOverrides
              ? initialDataOverrides[field.name]
              : initialDataFromConfiguration[field.name]
          ),
        }
      }, {})

    return {
      ...result,
      ...stepFields,
    }
  }, initialDataFromConfiguration) as Field<any, TFormFields>[]

  return fieldInternals as Fields<TFormFields>
}
