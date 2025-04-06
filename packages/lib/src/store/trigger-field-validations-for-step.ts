import { FormStore, InnerStoreApi } from '../types'
import { triggerFieldFocus } from './trigger-field-focus'
import { triggerFieldValidation } from './trigger-field-validation'

export const triggerFieldValidationsForStep = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[options]: Parameters<FormStore['triggerFieldValidationsForStep']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [
      ...(_innerStoreApi.calledBy || []),
      'triggerFieldValidationsForStep',
    ],
  }

  const { fields, getFieldNamesByStepName } = innerStoreApi.getStoreState()
  const { shouldFocusInvalidField = false } = options || {}

  const fieldValidationResults = await Promise.all(
    getFieldNamesByStepName().map(async (fieldName) => {
      if (!fields[fieldName]) {
        return {
          fieldName,
          predicate: true,
        }
      }

      const predicate = await triggerFieldValidation(
        innerStoreApi,
        fieldName,
        options
      )

      return {
        fieldName,
        predicate,
      }
    })
  )

  for (let i = 0; i < fieldValidationResults.length - 1; i += 1) {
    const fieldValidationResult = fieldValidationResults[i]

    if (
      fieldValidationResult &&
      fieldValidationResult.predicate === false &&
      shouldFocusInvalidField
    ) {
      triggerFieldFocus(innerStoreApi, fieldValidationResult.fieldName)
      break
    }
  }

  return fieldValidationResults.every(
    (fieldValidationResult) => fieldValidationResult.predicate === true
  )
}
