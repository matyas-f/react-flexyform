import { InnerStoreApi, TriggerValidationOptions } from '../types'
import { getFieldNamesByStepName } from './get-field-names-by-step-name'
import { triggerStepValidation } from './trigger-step-validation'
import { triggerMultipleFieldsValidations } from './trigger-multiple-fields-validations'

export const triggerFieldsAndStepValidation = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  options?: TriggerValidationOptions & {
    skipFieldsValidation?: boolean
    skipStepValidation?: boolean
  }
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [
      ...(_innerStoreApi.calledBy || []),
      'triggerFieldsAndStepValidation',
    ],
  }

  if (!options?.skipFieldsValidation) {
    const areFieldsValid = await triggerMultipleFieldsValidations(
      innerStoreApi,
      getFieldNamesByStepName(innerStoreApi),
      options
    )

    if (!areFieldsValid) {
      return false
    }
  }

  if (!options?.skipStepValidation) {
    const isStepValid = await triggerStepValidation(innerStoreApi)

    if (!isStepValid) {
      return false
    }
  }

  return true
}
