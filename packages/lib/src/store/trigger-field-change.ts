import { FormStore, InnerStoreApi, StringKeyOf } from '../types'
import { getCurrentStep } from './get-current-step'
import { getFieldValue } from './get-field-value'
import { getShouldTriggerAutoSave } from './get-should-trigger-auto-save'
import { getShouldTriggerValidation } from './get-should-trigger-validation'
import { setFieldValue } from './set-field-value'
import { triggerAutoSave } from './trigger-auto-save'
import { triggerStepValidation } from './trigger-step-validation'
import { triggerFieldValidation } from './trigger-field-validation'

export const triggerFieldChange = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldName, htmlEventOrValue, options]: Parameters<
    FormStore<TFormFields>['triggerFieldChange']
  >
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [
      ...(_innerStoreApi.calledBy || []),
      `triggerFieldChange(${fieldName})`,
    ],
  }

  const currentStep = getCurrentStep(innerStoreApi)
  const {
    validationOptions: { shouldFocusFirstInvalidField },
    autoSaveOptions,
  } = currentStep
  const { shouldDisableHtmlEventHandling = false } = options || {}

  let newValue = getFieldValue(innerStoreApi, fieldName) as any
  let wasValueDerivedFromHtmlEvent = false

  const isHtmlEvent =
    (htmlEventOrValue as React.ChangeEvent<HTMLInputElement>)?.target !==
      undefined &&
    (htmlEventOrValue as React.ChangeEvent<HTMLInputElement>)?.type !==
      undefined &&
    (htmlEventOrValue as React.ChangeEvent<HTMLInputElement>)?.currentTarget !==
      undefined
  const htmlEvent = htmlEventOrValue as React.ChangeEvent<HTMLInputElement>

  if (!shouldDisableHtmlEventHandling && isHtmlEvent) {
    const isCheckbox =
      htmlEvent.target.type === 'checkbox' &&
      htmlEvent.target.checked !== undefined

    if (isCheckbox && !wasValueDerivedFromHtmlEvent) {
      newValue = htmlEvent.target.checked
      wasValueDerivedFromHtmlEvent = true
    }

    if (!wasValueDerivedFromHtmlEvent) {
      newValue = htmlEvent.target.value
      wasValueDerivedFromHtmlEvent = true
    }
  }

  const incomingValue =
    htmlEventOrValue as TFormFields[StringKeyOf<TFormFields>]

  if (
    !isHtmlEvent &&
    !shouldDisableHtmlEventHandling &&
    !wasValueDerivedFromHtmlEvent
  ) {
    newValue = incomingValue
  }

  setFieldValue(innerStoreApi, fieldName, newValue, {
    shouldTriggerValidation: false,
  })

  innerStoreApi.cache.lastChangedField = fieldName

  const shouldTriggerFieldValidation = getShouldTriggerValidation(
    innerStoreApi,
    {
      validationTrigger: 'fieldValueChange',
      fieldName,
      isStepValidation: false,
    }
  )

  const shouldTriggerStepValidation = getShouldTriggerValidation(
    innerStoreApi,
    {
      validationTrigger: 'fieldValueChange',
      isStepValidation: true,
    }
  )

  const shouldTriggerAutoSave = getShouldTriggerAutoSave(innerStoreApi, {
    autoSaveTrigger: 'fieldValueChange',
    fieldName,
  })

  if (shouldTriggerFieldValidation) {
    triggerFieldValidation(innerStoreApi, fieldName, {
      shouldFocusInvalidField: shouldFocusFirstInvalidField,
      useDebounce: true,
      onSuccess:
        shouldTriggerAutoSave && !autoSaveOptions.ignoreValidation
          ? () =>
              triggerAutoSave(innerStoreApi, { useDebounce: true, fieldName })
          : undefined,
    })
  }

  if (shouldTriggerStepValidation) {
    triggerStepValidation(innerStoreApi, {
      useDebounce: true,
    })
  }

  if (
    shouldTriggerAutoSave &&
    (!shouldTriggerFieldValidation || autoSaveOptions.ignoreValidation)
  ) {
    triggerAutoSave(innerStoreApi, { useDebounce: true, fieldName })
  }
}
