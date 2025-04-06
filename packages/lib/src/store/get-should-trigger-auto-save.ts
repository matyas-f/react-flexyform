import { InnerStoreApi, StringKeyOf } from '../types'
import { getCurrentStep } from './get-current-step'

export const getShouldTriggerAutoSave = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  {
    autoSaveTrigger,
    fieldName,
  }: {
    autoSaveTrigger: 'fieldBlur' | 'fieldValueChange'
    fieldName: StringKeyOf<TFormFields>
  }
) => {
  const currentStep = getCurrentStep(innerStoreApi)
  const { autoSaveOn, enabled } = currentStep.autoSaveOptions

  if (!enabled) {
    return false
  }

  const validationTriggerObj = autoSaveOn.find((trigger) =>
    typeof trigger === 'object' ? trigger.trigger === autoSaveTrigger : false
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

  return autoSaveOn.includes(autoSaveTrigger)
}
