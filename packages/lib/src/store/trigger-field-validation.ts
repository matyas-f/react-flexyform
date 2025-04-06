import { isBefore, isValid } from 'date-fns'
import { phone } from 'phone'
import { Field, FormFieldComponent, FormStore, InnerStoreApi } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { triggerFieldFocus } from './trigger-field-focus'
import { getCurrentStep } from './get-current-step'
import { getFieldValue } from './get-field-value'
import { getIsFormComponentShowing } from './get-is-form-component-showing'
import { debounce } from 'lodash'
import isEqual from 'fast-deep-equal'
import { getComponentConfiguration } from './get-component-configuration'
import { parseNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'
import { emailRegex, strongPasswordRegex, urlRegex } from '../utils/regex'

const getErrorMessageForRule = (
  rule: { message: string | ((nestedItemIndex: number | null) => string) },
  nestedItemIndex: number | null
) => {
  if (!rule) {
    return ''
  }

  return typeof rule.message === 'function'
    ? rule.message(nestedItemIndex)
    : rule.message
}

const triggerFieldSyncValidation = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldName, options]: Parameters<FormStore['triggerFieldValidation']>
): string[] => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || [])],
  }
  const field = innerStoreApi.getStoreState().fields[fieldName]
  const { validationOptions } = getCurrentStep(innerStoreApi)
  const fieldConfiguration = getComponentConfiguration(
    innerStoreApi,
    fieldName
  ) as FormFieldComponent | undefined

  if (!field || !fieldConfiguration?.validationRules) {
    return []
  }

  const { nestedItemIndex } = parseNestedArrayItemFieldName(fieldName)
  const isFieldNestedArrayParent = Array.isArray(
    fieldConfiguration.nestedArrayComponents
  )
  const fieldValue = field.value

  const validationRules = fieldConfiguration.validationRules
  const unOrderedValidationErrors: {
    errorMessage: string
    priority?: number
  }[] = []

  if (
    validationRules.required &&
    ([undefined, null, ''].includes(fieldValue as Field['value']) ||
      (isFieldNestedArrayParent &&
        Array.isArray(fieldValue) &&
        fieldValue.length === 0))
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.required,
        nestedItemIndex
      ),
      priority: validationRules.required?.priority,
    })
  }

  if (
    validationRules.minLength &&
    fieldValue.length !== undefined &&
    fieldValue.length < validationRules.minLength.value
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.minLength,
        nestedItemIndex
      ),
      priority: validationRules.minLength?.priority,
    })
  }

  if (
    validationRules.maxLength &&
    fieldValue.length !== undefined &&
    fieldValue.length > validationRules.maxLength.value
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.maxLength,
        nestedItemIndex
      ),
      priority: validationRules.maxLength?.priority,
    })
  }

  if (
    validationRules.exactLength &&
    fieldValue.length !== undefined &&
    fieldValue.length !== validationRules.exactLength.value
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.exactLength,
        nestedItemIndex
      ),
      priority: validationRules.exactLength?.priority,
    })
  }

  if (
    validationRules.minValue &&
    typeof fieldValue === 'number' &&
    fieldValue !== undefined &&
    fieldValue !== null &&
    fieldValue < validationRules.minValue.value
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.minValue,
        nestedItemIndex
      ),
      priority: validationRules.minValue?.priority,
    })
  }

  if (
    validationRules.maxValue &&
    typeof fieldValue === 'number' &&
    fieldValue > validationRules.maxValue.value
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.maxValue,
        nestedItemIndex
      ),
      priority: validationRules.maxValue?.priority,
    })
  }

  if (
    validationRules.mustBeEqualTo &&
    fieldValue !== validationRules.mustBeEqualTo.value
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.mustBeEqualTo,
        nestedItemIndex
      ),
      priority: validationRules.mustBeEqualTo?.priority,
    })
  }

  if (
    validationRules.email &&
    typeof fieldValue === 'string' &&
    fieldValue &&
    !emailRegex.test(fieldValue)
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.email,
        nestedItemIndex
      ),
      priority: validationRules.email?.priority,
    })
  }

  if (
    validationRules.url &&
    typeof fieldValue === 'string' &&
    fieldValue &&
    !urlRegex.test(fieldValue)
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.url,
        nestedItemIndex
      ),
      priority: validationRules.url?.priority,
    })
  }

  if (
    validationRules.onlyStrongPasswordCharacters &&
    typeof fieldValue === 'string' &&
    fieldValue &&
    !strongPasswordRegex.test(fieldValue)
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.onlyStrongPasswordCharacters,
        nestedItemIndex
      ),

      priority: validationRules.onlyStrongPasswordCharacters?.priority,
    })
  }

  if (
    validationRules.pattern &&
    typeof fieldValue === 'string' &&
    fieldValue &&
    !new RegExp(validationRules.pattern.value).test(fieldValue)
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.pattern,
        nestedItemIndex
      ),
      priority: validationRules.pattern?.priority,
    })
  }

  if (
    validationRules.phoneNumber &&
    typeof fieldValue === 'string' &&
    fieldValue &&
    !phone(fieldValue, validationRules.phoneNumber.options).isValid
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.phoneNumber,
        nestedItemIndex
      ),
      priority: validationRules.phoneNumber?.priority,
    })
  }

  if (
    validationRules.minDate &&
    isValid(new Date(fieldValue)) &&
    isBefore(new Date(fieldValue), new Date(validationRules.minDate.value))
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.minDate,
        nestedItemIndex
      ),
      priority: validationRules.minDate?.priority,
    })
  }

  if (
    validationRules.maxDate &&
    isValid(new Date(fieldValue)) &&
    isBefore(new Date(fieldValue), new Date(validationRules.maxDate.value))
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.maxDate,
        nestedItemIndex
      ),
      priority: validationRules.maxDate?.priority,
    })
  }

  if (
    validationRules.matchAnotherField &&
    fieldValue !==
      getFieldValue(innerStoreApi, validationRules.matchAnotherField.value)
  ) {
    unOrderedValidationErrors.push({
      errorMessage: getErrorMessageForRule(
        validationRules.matchAnotherField,
        nestedItemIndex
      ),
      priority: validationRules.required?.priority,
    })
  }

  if (validationRules.customValidation) {
    const customValidationResult =
      validationRules.customValidation.validate(nestedItemIndex)

    if (customValidationResult) {
      unOrderedValidationErrors.push({
        errorMessage: customValidationResult,
        priority: validationRules.customValidation.priority,
      })
    }
  }

  const validationErrors = unOrderedValidationErrors
    .sort((a, b) => (a.priority || 0) - (b.priority || 0))
    .map((error) => error.errorMessage)

  if (
    validationErrors.length > 0 &&
    !isEqual(field.validationError, validationErrors)
  ) {
    innerStoreApi.setStoreState(
      (formStore) => {
        if (formStore.fields[fieldName]) {
          formStore.fields[fieldName].validationError = validationErrors
          formStore.fields[fieldName].didTriggerRevalidationMode = true
          formStore.fields[fieldName].lastValidatedValue = field.value
        }
      },
      false,
      getReduxDevtoolsDebugLabel(innerStoreApi.calledBy, {
        fieldName,
        validationErrors,
      })
    )

    const shouldFocusInvalidField =
      options?.shouldFocusInvalidField !== undefined
        ? options.shouldFocusInvalidField
        : validationOptions.shouldFocusFirstInvalidField

    if (shouldFocusInvalidField) {
      triggerFieldFocus(innerStoreApi, fieldName)
    }
  }

  if (!validationErrors.length && field.validationError) {
    innerStoreApi.setStoreState(
      (formStore) => {
        if (formStore.fields[fieldName]) {
          formStore.fields[fieldName].validationError = null
          formStore.fields[fieldName].lastValidatedValue = field.value

          if (!validationRules.customAsyncValidation) {
            formStore.fields[fieldName].didTriggerRevalidationMode = false
          }
        }
      },
      false,
      getReduxDevtoolsDebugLabel(innerStoreApi.calledBy, {
        fieldName,
        validationErrors,
      })
    )
  }

  return validationErrors.filter(Boolean)
}

const triggerFieldAsyncValidation = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldName, options]: Parameters<FormStore['triggerFieldValidation']>
): Promise<boolean> => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || [])],
  }

  const formId = innerStoreApi.getStoreState().configuration.formId
  const field = innerStoreApi.getStoreState().fields[fieldName]
  const { validationOptions } = getCurrentStep(innerStoreApi)
  const fieldConfiguration = getComponentConfiguration(
    innerStoreApi,
    fieldName
  ) as FormFieldComponent | undefined
  const currentStep = getCurrentStep(innerStoreApi)

  if (!field || !fieldConfiguration?.validationRules?.customAsyncValidation) {
    return true
  }

  const { nestedItemIndex } = parseNestedArrayItemFieldName(fieldName)

  const triggerId =
    innerStoreApi.cache.fieldValidation.getLastTriggerId(
      formId,
      currentStep.name,
      fieldName
    ) + 1

  let validationError = ''
  try {
    innerStoreApi.setStoreState(
      (formStore) => {
        if (formStore.fields[fieldName]) {
          formStore.fields[fieldName].isValidating = true
          innerStoreApi.cache.fieldValidation.setLastTriggerId(
            formId,
            currentStep.name,
            fieldName,
            triggerId
          )
          innerStoreApi.cache.fieldValidation
            .getLastTriggerAbortController(formId, currentStep.name, fieldName)
            ?.abort('There was a new async field validation triggered')
          innerStoreApi.cache.fieldValidation.setLastTriggerAbortController(
            formId,
            currentStep.name,
            fieldName,
            new AbortController()
          )
        }
      },
      false,
      getReduxDevtoolsDebugLabel(
        [
          ...(innerStoreApi.calledBy || []),
          'customAsyncValidation:initializing',
        ],
        {
          fieldName,
        }
      )
    )

    validationError =
      await fieldConfiguration.validationRules.customAsyncValidation(
        nestedItemIndex,
        innerStoreApi.cache.fieldValidation.getLastTriggerAbortController(
          formId,
          currentStep.name,
          fieldName
        ) as AbortController
      )

    const currentValidationError =
      innerStoreApi.getStoreState().fields[fieldName]?.validationError

    innerStoreApi.setStoreState(
      (formStore) => {
        if (
          innerStoreApi.cache.fieldValidation.getLastTriggerId(
            formId,
            currentStep.name,
            fieldName
          ) === triggerId &&
          formStore.fields[fieldName]
        ) {
          formStore.fields[fieldName].isValidating = false
          formStore.fields[fieldName].validationError = validationError
            ? [validationError]
            : null
          formStore.fields[fieldName].lastValidatedValue = field.value
          formStore.fields[fieldName].didPassAsyncValidation = validationError
            ? false
            : true

          if (
            validationError &&
            !isEqual([field.validationError], currentValidationError)
          ) {
            formStore.fields[fieldName].didTriggerRevalidationMode = true
          }

          innerStoreApi.cache.fieldValidation.clearLastTriggerAbortController(
            formId,
            currentStep.name,
            fieldName
          )
        }
      },
      false,
      getReduxDevtoolsDebugLabel(
        [...(innerStoreApi.calledBy || []), 'customAsyncValidation:success'],
        {
          fieldName,
        }
      )
    )

    const shouldFocusInvalidField =
      options?.shouldFocusInvalidField !== undefined
        ? options.shouldFocusInvalidField
        : validationOptions.shouldFocusFirstInvalidField

    if (validationError && shouldFocusInvalidField) {
      triggerFieldFocus(innerStoreApi, fieldName)
    }

    return !validationError
  } catch (error) {
    validationError =
      typeof error === 'string' ? error : (error as Error).message

    innerStoreApi.setStoreState(
      (formStore) => {
        if (
          formStore.fields[fieldName] &&
          innerStoreApi.cache.fieldValidation.getLastTriggerId(
            formId,
            currentStep.name,
            fieldName
          ) === triggerId
        ) {
          formStore.fields[fieldName].isValidating = false
          formStore.fields[fieldName].didPassAsyncValidation = false
          formStore.fields[fieldName].validationError = [validationError]
          formStore.fields[fieldName].didTriggerRevalidationMode = true
          formStore.fields[fieldName].didPassAsyncValidation = false

          innerStoreApi.cache.fieldValidation.clearLastTriggerAbortController(
            formId,
            currentStep.name,
            fieldName
          )
        }
      },
      false,
      getReduxDevtoolsDebugLabel(
        [...(innerStoreApi.calledBy || []), 'customAsyncValidation:error'],
        {
          fieldName,
        }
      )
    )

    return false
  }
}

export const triggerFieldValidation = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldName, options]: Parameters<FormStore['triggerFieldValidation']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'triggerFieldValidation'],
  }

  const {
    fields,
    configuration: { formId },
  } = innerStoreApi.getStoreState()

  const currentStep = getCurrentStep(innerStoreApi)
  const { validationOptions } = currentStep
  const fieldConfiguration = getComponentConfiguration(
    innerStoreApi,
    fieldName
  ) as FormFieldComponent | undefined
  const field = fields[fieldName]
  const { useDebounce } = options || {}

  if (
    !field ||
    !fieldConfiguration?.validationRules ||
    !getIsFormComponentShowing(innerStoreApi, fieldName)
  ) {
    options?.onSuccess?.()
    return true
  }

  let syncValidationPredicate = true
  let asyncValidationPredicate = true

  const fieldValidationDebounceDurationInMs =
    fieldConfiguration.validationRules.debounceDurationInMs ??
    validationOptions.fieldValidationDebounceDurationInMs ??
    0
  const fieldAsyncValidationDebounceDurationInMs =
    fieldConfiguration.validationRules.asyncDebounceDurationInMs ??
    validationOptions.fieldAsyncValidationDebounceDurationInMs ??
    0

  if (useDebounce && fieldValidationDebounceDurationInMs) {
    const validationErrorsFromSyncValidation =
      innerStoreApi.cache.fieldValidation.setAndReturnSyncDebouncedFunction(
        formId,
        currentStep.name,
        fieldName,
        debounce(
          () => triggerFieldSyncValidation(innerStoreApi, fieldName, options),
          fieldValidationDebounceDurationInMs
        )
      )()

    syncValidationPredicate = validationErrorsFromSyncValidation
      ? validationErrorsFromSyncValidation.length > 0
      : false
  } else {
    const validationErrorsFromSyncValidation = triggerFieldSyncValidation(
      innerStoreApi,
      fieldName,
      options
    )

    syncValidationPredicate = validationErrorsFromSyncValidation.length === 0
  }

  if (syncValidationPredicate === false) {
    innerStoreApi.cache.fieldValidation
      .getAsyncDebouncedFunction(formId, currentStep.name, fieldName)
      ?.cancel()
    return false
  }

  if (
    useDebounce &&
    fieldAsyncValidationDebounceDurationInMs &&
    fieldConfiguration.validationRules.customAsyncValidation
  ) {
    const debouncedTriggerFieldAsyncValidation =
      innerStoreApi.cache.fieldValidation.setAndReturnAsyncDebouncedFunction(
        formId,
        currentStep.name,
        fieldName,
        debounce(
          () => triggerFieldAsyncValidation(innerStoreApi, fieldName, options),
          fieldAsyncValidationDebounceDurationInMs
        )
      )

    const debouncedFunctionPredicate =
      await debouncedTriggerFieldAsyncValidation()

    asyncValidationPredicate = debouncedFunctionPredicate || false
  } else {
    asyncValidationPredicate = await triggerFieldAsyncValidation(
      innerStoreApi,
      fieldName,
      options
    )
  }

  if (asyncValidationPredicate === false) {
    return false
  }

  options?.onSuccess?.()
  return true
}
