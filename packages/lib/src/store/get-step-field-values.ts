import { mapValues, pickBy } from 'lodash'
import { FormFieldComponent, FormStore, InnerStoreApi } from '../types'
import { isNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'
import { getComponentConfiguration } from './get-component-configuration'

export const getStepFieldValues = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[stepName]: Parameters<FormStore['getStepFieldValues']>
) => {
  const {
    currentStepName,
    getFieldValue,
    getIsFormComponentShowing,
    fields,
    getFieldNamesByStepName,
  } = innerStoreApi.getStoreState()

  const stepFieldNames = getFieldNamesByStepName(stepName || currentStepName)

  const relevantFields = pickBy(
    fields,
    (field) =>
      stepFieldNames.includes(field.name) &&
      (getIsFormComponentShowing(field.name as string) ||
        (!isNestedArrayItemFieldName(field.name) &&
          (
            getComponentConfiguration(innerStoreApi, field.name) as
              | FormFieldComponent
              | undefined
          )?.shouldIncludeInValuesEvenIfNotShowing))
  )

  return mapValues(relevantFields, (_field) =>
    getFieldValue(_field.name)
  ) as TFormFields
}
