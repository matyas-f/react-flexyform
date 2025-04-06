import { pickBy } from 'lodash'
import {
  Field,
  FormFieldComponent,
  FormStore,
  InnerStoreApi,
  StringKeyOf,
} from '../types'
import { isNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'
import { getFieldNamesByStepName } from './get-field-names-by-step-name'
import { getComponentConfiguration } from './get-component-configuration'
import { getIsFormComponentShowing } from './get-is-form-component-showing'

export const getStepFields = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[stepName]: Parameters<FormStore['getStepFields']>
) => {
  const { currentStepName, fields } = innerStoreApi.getStoreState()

  const stepFieldNames = getFieldNamesByStepName(
    innerStoreApi,
    stepName || currentStepName
  )

  const relevantFields = pickBy(
    fields,
    (field) =>
      stepFieldNames.includes(field.name) &&
      (getIsFormComponentShowing(innerStoreApi, field.name) ||
        (!isNestedArrayItemFieldName(field.name) &&
          (
            getComponentConfiguration(innerStoreApi, field.name) as
              | FormFieldComponent
              | undefined
          )?.shouldIncludeInValuesEvenIfNotShowing))
  )

  return relevantFields as Record<StringKeyOf<TFormFields>, Field>
}
