import { InnerStoreApi } from '../types'
import { getFieldValue } from './get-field-value'
import { getIsFormComponentShowing } from './get-is-form-component-showing'
import { getStepRequiredFields } from './get-step-required-fields'

export const getFirstStepNameWithRequiredFieldsNotCompleted = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const {
    configuration: { steps },
  } = innerStoreApi.getStoreState()

  const firstIncompleteStepIndex = steps.findIndex((step) => {
    const allRequiredFieldNames = getStepRequiredFields(
      innerStoreApi,
      step.name
    ).map((field) => field.name)

    return allRequiredFieldNames
      .filter((fieldName) =>
        getIsFormComponentShowing(innerStoreApi, fieldName)
      )
      .some((fieldName) => {
        const fieldValue = getFieldValue(innerStoreApi, fieldName)

        return (
          fieldValue === undefined ||
          fieldValue === null ||
          fieldValue === '' ||
          (Array.isArray(fieldValue) ? fieldValue.length === 0 : false)
        )
      })
  })

  return steps[firstIncompleteStepIndex]?.name || undefined
}
