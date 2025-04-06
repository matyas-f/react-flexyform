import { pickBy } from 'lodash'
import { Field, FormFieldComponent, InnerStoreApi, StringKeyOf } from '../types'
import { isNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'
import { getComponentConfiguration } from './get-component-configuration'
import { getIsFormComponentShowing } from './get-is-form-component-showing'

export const getAllFields = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const { fields } = innerStoreApi.getStoreState()

  const relevantFields = pickBy(
    fields,
    (field) =>
      getIsFormComponentShowing(innerStoreApi, field.name) ||
      (!isNestedArrayItemFieldName(field.name) &&
        (
          getComponentConfiguration(innerStoreApi, field.name) as
            | FormFieldComponent
            | undefined
        )?.shouldIncludeInValuesEvenIfNotShowing)
  )

  return relevantFields as Record<StringKeyOf<TFormFields>, Field>
}
