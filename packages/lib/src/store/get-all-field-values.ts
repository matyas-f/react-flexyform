import { mapValues, pickBy } from 'lodash'
import { FormFieldComponent, InnerStoreApi } from '../types'
import { isNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'
import { getComponentConfiguration } from './get-component-configuration'

export const getAllFieldValues = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const { getFieldValue, getIsFormComponentShowing, fields } =
    innerStoreApi.getStoreState()

  const relevantFields = pickBy(
    fields,
    (field) =>
      getIsFormComponentShowing(field.name as string) ||
      (!isNestedArrayItemFieldName(field.name) &&
        (
          getComponentConfiguration(innerStoreApi, field.name) as
            | FormFieldComponent
            | undefined
        )?.shouldIncludeInValuesEvenIfNotShowing)
  )

  return mapValues(relevantFields, (_field) =>
    getFieldValue(_field.name)
  ) as TFormFields
}
