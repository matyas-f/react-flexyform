import { InnerStoreApi, ValidationOptions, ValidationTrigger } from '../types'
import { getCurrentStep } from './get-current-step'

const flattenTriggers = (triggers: ValidationTrigger[]) =>
  triggers.map((trigger) =>
    typeof trigger === 'string' ? trigger : trigger.trigger
  )

export const _getShouldTriggerValidations = ({
  validationTrigger,
  validationOptions,
  didTriggerRevalidationModeForStep,
  isStepValidation,
  fieldName,
  didTriggerRevalidationModeForField,
}: {
  validationTrigger:
    | 'fieldBlur'
    | 'fieldValueChange'
    | 'goToNextStep'
    | 'goToPreviousStep'
    | 'goToStep'
    | 'save'
  validationOptions: ValidationOptions<Record<string, any>>
  didTriggerRevalidationModeForStep: boolean
  isStepValidation?: boolean
  fieldName?: string
  didTriggerRevalidationModeForField?: boolean
}) => {
  const {
    validateFieldsOn,
    reValidateFieldsOn,
    reValidateStepOn,
    validateStepOn,
  } = validationOptions

  if (
    (validationTrigger === 'fieldValueChange' ||
      validationTrigger === 'fieldBlur') &&
    fieldName
  ) {
    let validationTriggersToCheck: ValidationTrigger[] = []

    if (isStepValidation && didTriggerRevalidationModeForStep) {
      validationTriggersToCheck = reValidateStepOn
    } else if (isStepValidation && !didTriggerRevalidationModeForStep) {
      validationTriggersToCheck = validateStepOn
    } else if (
      !isStepValidation &&
      (didTriggerRevalidationModeForStep || didTriggerRevalidationModeForField)
    ) {
      validationTriggersToCheck = reValidateFieldsOn
    } else if (
      !isStepValidation &&
      !didTriggerRevalidationModeForStep &&
      !didTriggerRevalidationModeForField
    ) {
      validationTriggersToCheck = validateFieldsOn
    }

    const validationTriggerObj = validationTriggersToCheck.find((trigger) =>
      typeof trigger === 'object'
        ? trigger.trigger === validationTrigger
        : false
    )

    if (
      validationTriggerObj &&
      typeof validationTriggerObj === 'object' &&
      validationTriggerObj.excludeFieldNamesOnly &&
      validationTriggerObj.excludeFieldNamesOnly.includes(fieldName)
    ) {
      return false
    }

    if (
      validationTriggerObj &&
      typeof validationTriggerObj === 'object' &&
      validationTriggerObj.includeFieldNamesOnly &&
      !validationTriggerObj.includeFieldNamesOnly.includes(fieldName)
    ) {
      return false
    }
  }

  if (isStepValidation && didTriggerRevalidationModeForStep) {
    return flattenTriggers(reValidateStepOn).includes(validationTrigger)
  }

  if (isStepValidation && !didTriggerRevalidationModeForStep) {
    return flattenTriggers(validateStepOn).includes(validationTrigger)
  }

  if (
    !isStepValidation &&
    (didTriggerRevalidationModeForStep || didTriggerRevalidationModeForField)
  ) {
    return flattenTriggers(reValidateFieldsOn).includes(validationTrigger)
  }

  if (
    !isStepValidation &&
    !didTriggerRevalidationModeForStep &&
    !didTriggerRevalidationModeForField
  ) {
    return flattenTriggers(validateFieldsOn).includes(validationTrigger)
  }

  return false
}

export const getShouldTriggerValidation = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  {
    validationTrigger,
    fieldName,
    isStepValidation,
  }: {
    validationTrigger:
      | 'fieldBlur'
      | 'fieldValueChange'
      | 'goToNextStep'
      | 'goToPreviousStep'
      | 'goToStep'
      | 'save'
    fieldName?: string
    isStepValidation?: boolean
  }
) => {
  const { didTriggerRevalidationModeForStep, fields } =
    innerStoreApi.getStoreState()
  const currentStep = getCurrentStep(innerStoreApi)

  return _getShouldTriggerValidations({
    validationTrigger,
    validationOptions: currentStep.validationOptions,
    didTriggerRevalidationModeForStep,
    isStepValidation,
    fieldName,
    didTriggerRevalidationModeForField:
      fieldName && fields[fieldName]
        ? fields[fieldName].didTriggerRevalidationMode
        : false,
  })
}
