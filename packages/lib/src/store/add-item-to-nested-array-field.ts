import { FormFieldComponent, FormStore, InnerStoreApi } from '../types'
import { getComponentConfiguration } from './get-component-configuration'
import { getFieldValue } from './get-field-value'
import { setFieldValue } from './set-field-value'
import { triggerFieldValidation } from './trigger-field-validation'

export const addItemToNestedArrayField = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldName, defaultValues]: Parameters<
    FormStore<TFormFields>['addItemToNestedArrayField']
  >
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [
      ...(_innerStoreApi.calledBy || []),
      `addItemToNestedArrayField(${fieldName})`,
    ],
  }

  const { didTriggerRevalidationModeForStep } = innerStoreApi.getStoreState()

  const fieldNestedComponentDefaults = (
    getComponentConfiguration(innerStoreApi, fieldName) as
      | FormFieldComponent
      | undefined
  )?.nestedArrayComponents?.reduce((result, nac) => {
    if (nac.type === 'field' && nac.defaultValue !== undefined) {
      return {
        ...result,
        [nac.name as string]: nac.defaultValue,
      }
    }

    return {
      ...result,
      [nac.name as string]: '',
    }
  }, {})

  const currentFieldValue = (getFieldValue(innerStoreApi, fieldName) ||
    []) as unknown as any[]

  const newFieldValue = [
    ...(currentFieldValue || []),
    defaultValues || fieldNestedComponentDefaults,
  ] as TFormFields[Extract<keyof TFormFields, string>]

  setFieldValue(innerStoreApi, fieldName, newFieldValue)

  if (didTriggerRevalidationModeForStep) {
    triggerFieldValidation(innerStoreApi, fieldName, {
      shouldFocusInvalidField: false,
    })
  }
}
