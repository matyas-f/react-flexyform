import { FormStore, InnerStoreApi, StringKeyOf } from '../types'
import { getFieldValue } from './get-field-value'
import { setFieldValue } from './set-field-value'
import { triggerFieldValidation } from './trigger-field-validation'

export const removeItemFromNestedArrayField = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldName, indexToRemove]: Parameters<
    FormStore<TFormFields>['removeItemFromNestedArrayField']
  >
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [
      ...(_innerStoreApi.calledBy || []),
      `removeItemFromNestedArrayField(${fieldName})`,
    ],
  }

  const { didTriggerRevalidationModeForStep } = innerStoreApi.getStoreState()

  const fieldValue = (getFieldValue(innerStoreApi, fieldName) ||
    []) as unknown as any[]

  const newFieldValue = fieldValue.filter(
    (_, i) => i !== indexToRemove
  ) as TFormFields[StringKeyOf<TFormFields>]

  setFieldValue(innerStoreApi, fieldName, newFieldValue)

  if (didTriggerRevalidationModeForStep) {
    triggerFieldValidation(innerStoreApi, fieldName, {
      shouldFocusInvalidField: false,
    })
  }
}
