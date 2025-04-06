import {
  FormFieldComponent,
  FormStore,
  InnerStoreApi,
  StringKeyOf,
} from '../types'
import { getComponentConfiguration } from './get-component-configuration'
import { triggerFieldFocus } from './trigger-field-focus'
import { triggerFieldValidation } from './trigger-field-validation'

export const triggerMultipleFieldsValidations = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldNames, options]: Parameters<
    FormStore['triggerMultipleFieldsValidations']
  >
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'triggerSubmit'],
  }

  const { fields } = innerStoreApi.getStoreState()
  const { shouldFocusInvalidField = true } = options || {}

  const fieldNamesToValidate = fieldNames.reduce<string[]>(
    (result, fieldName) => {
      const fieldConfiguration = getComponentConfiguration(
        innerStoreApi,
        fieldName
      ) as FormFieldComponent | undefined

      const isParentField = Boolean(fieldConfiguration?.nestedArrayComponents)

      if (!isParentField) {
        return [...result, fieldName]
      }

      const nestedArrayItemFieldNames = Object.keys(fields).filter(
        (_fieldName) => {
          if (_fieldName.startsWith(`${fieldName}[`)) {
            return true
          }

          return false
        }
      )

      return [...result, fieldName, ...nestedArrayItemFieldNames]
    },
    []
  )

  const fieldValidationResults = await Promise.all(
    fieldNamesToValidate.map(async (fieldName) => {
      if (!fields[fieldName]) {
        return {
          fieldName,
          predicate: true,
        }
      }

      const predicate = await triggerFieldValidation(innerStoreApi, fieldName, {
        shouldFocusInvalidField: false,
      })

      return {
        fieldName,
        predicate,
      }
    })
  )

  for (let i = 0; i < fieldValidationResults.length; i += 1) {
    const fieldValidationResult = fieldValidationResults[i]

    if (
      fieldValidationResult &&
      fieldValidationResult.predicate === false &&
      shouldFocusInvalidField
    ) {
      triggerFieldFocus(
        innerStoreApi,
        fieldValidationResult.fieldName as StringKeyOf<TFormFields>
      )
      break
    }
  }

  return fieldValidationResults.every(
    (fieldValidationResult) => fieldValidationResult.predicate === true
  )
}
