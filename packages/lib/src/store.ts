import { createStore } from 'zustand/vanilla'
import {
  CreateFormStoreConfiguration,
  FormStoreInstance,
  FormStore,
  StringKeyOf,
  Field,
} from './types'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { nanoid } from 'nanoid'
import { getInitialStep } from './store/get-initial-step'
import { getInitialComponentParams } from './store/get-initial-component-params'
import { getInitialFields } from './store/get-initial-fields'
import {
  DEFAULT_STEP_NAME,
  getInitialStepsConfiguration,
} from './store/get-initial-steps-configuration'
import { triggerInitialDataLoading } from './store/trigger-initial-data-loading'
import { getInititialDataLoadingStatus } from './store/get-initial-data-loading-status'
import { setCurrentStep } from './store/set-current-step'
import { triggerStepValidation } from './store/trigger-step-validation'
import { resetFormState } from './store/reset-form-state'
import { setFieldValue } from './store/set-field-value'
import { getPreviousStepName } from './store/get-previous-step-name'
import { getNextStepName } from './store/get-next-step-name'
import { getStepByIndex } from './store/get-step-by-index'
import { getStepByName } from './store/get-step-by-name'
import { getStepIndexByName } from './store/get-step-index-by-name'
import { getStepNameByIndex } from './store/get-step-name-by-index'
import { getCurrentStepIndex } from './store/get-current-step-index'
import { getCurrentStep } from './store/get-current-step'
import { getIsStepDirty } from './store/get-is-step-dirty'
import { getIsStepTouched } from './store/get-is-step-touched'
import { getEventTriggerCounts } from './store/get-event-trigger-counts'
import { getIsValidatingAnything } from './store/get-is-validating-anything'
import { triggerFieldFocus } from './store/trigger-field-focus'
import { resetField } from './store/reset-field'
import { resetFieldsForStep } from './store/reset-fields-for-step'
import { triggerMultipleFieldsValidations } from './store/trigger-multiple-fields-validations'
import { triggerFieldValidation } from './store/trigger-field-validation'
import { triggerFieldValidationsForStep } from './store/trigger-field-validations-for-step'
import { resetValidationErrorForFields } from './store/reset-validation-error-for-fields'
import { resetFieldValidationErrorsForStep } from './store/reset-field-validation-errors-for-step'
import { getFieldValue } from './store/get-field-value'
import { getAllFieldValues } from './store/get-all-field-values'
import { getStepFieldValues } from './store/get-step-field-values'
import { getField } from './store/get-field'
import { getIsFormComponentShowing } from './store/get-is-form-component-showing'
import { triggerSubmit } from './store/trigger-submit'
import { triggerSave } from './store/trigger-save'
import { triggerGoToPreviousStep } from './store/trigger-go-to-previous-step'
import { triggerGoToNextStep } from './store/trigger-go-to-next-step'
import { triggerGoToStep } from './store/trigger-go-to-step'
import { getStepFields } from './store/get-step-fields'
import { getAllFields } from './store/get-all-fields'
import { getFieldNamesByStepIndex } from './store/get-field-names-by-step-index'
import { getFieldNamesByStepName } from './store/get-field-names-by-step-name'
import { getNestedArrayItemsFields } from './store/get-nested-array-items-fields'
import { getDirtyFields } from './store/get-dirty-fields'
import { getTouchedFields } from './store/get-touched-fields'
import { getRequiredFields } from './store/get-required-fields'
import { getStepRequiredFields } from './store/get-step-required-fields'
import { getIsValidatingFields } from './store/get-is-validating-fields'
import { getFieldValidationError } from './store/get-field-validation-error'
import { getComponentParams } from './store/get-component-params'
import { setComponentParams } from './store/set-component-params'
import { getInitialFormStoreConfigurationuration } from './store/get-initial-form-store-configuration'
import { triggerAutoSave } from './store/trigger-auto-save'
import { getIsAnyFieldInvalid } from './store/get-is-any-field-invalid'
import { getInvalidFields } from './store/get-invalid-fields'
import { triggerDynamicComponentParams } from './store/trigger-dynamic-component-params'
import { getComponentConfiguration } from './store/get-component-configuration'
import { addItemToNestedArrayField } from './store/add-item-to-nested-array-field'
import { removeItemFromNestedArrayField } from './store/remove-item-from-nested-array-field'
import { triggerFieldBlur } from './store/trigger-field-blur'
import { triggerFieldChange } from './store/trigger-field-change'
import { getAreComponentParamsLoading } from './store/get-are-component-params-loading'
import { getComponentParamsLoadingError } from './store/get-component-params-loading-error'
import { getNestedArrayItemField } from './store/get-nested-array-item-field'
import { setStepInitialValues } from './store/set-step-initial-values'
import { triggerAllDynamicComponentParamsForStep } from './store/trigger-all-dynamic-component-params-for-step'
import { getAreAnyComponentParamsLoading } from './store/get-are-any-component-params-loading'
import { getAreAnyComponentParamsLoadingErrors } from './store/get-are-any-component-params-loading-errors'
import { getComponentsWithComponentParamsLoadingError } from './store/get-components-with-component-params-loading-error'
import { setContext } from './store/set-context'
import { setIsLoadingInitialData } from './store/set-is-loading-initial-data'
import { setInitialDataLoadingError } from './store/set-initial-data-loading-error'
import { getIsAnyFieldFocused } from './store/get-is-any-field-focused'
import { getIsLastStep } from './store/get-is-last-step'
import { getIsFirstStep } from './store/get-is-first-step'
import { getFirstStepNameWithRequiredFieldsNotCompleted } from './store/get-first-step-name-with-required-fields-not-completed'
import { getFirstStep } from './store/get-first-step'
import { getLastStep } from './store/get-last-step'
import { FormStoreCache } from './cache'

export const createFormStore = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  configurationParam:
    | CreateFormStoreConfiguration<TFormFields>
    | ((
        getFormStore: () => FormStore<TFormFields>
      ) => CreateFormStoreConfiguration<TFormFields>)
): FormStoreInstance<TFormFields> => {
  const vanillaStore = createStore(
    devtools(
      immer<FormStore<TFormFields>>((setStoreState, getStoreState) => {
        const configurationObject =
          typeof configurationParam === 'function'
            ? configurationParam(getStoreState)
            : configurationParam

        const formStoreCache = new FormStoreCache<TFormFields>()

        const innerStoreApi = {
          setStoreState,
          getStoreState,
          cache: formStoreCache,
        }

        const formId = configurationObject.formId || nanoid()

        const initialSteps = getInitialStepsConfiguration(configurationObject)

        const initialComponentParams = getInitialComponentParams(initialSteps)

        const initialConfiguration = getInitialFormStoreConfigurationuration(
          configurationObject,
          initialSteps,
          formId
        )
        const initialStep = getInitialStep(initialConfiguration)
        const initialFields = getInitialFields(initialConfiguration, formId)

        formStoreCache.setInitialComponentConfigurations(initialSteps)

        return {
          // Configuration
          configuration: initialConfiguration,

          // Context
          context:
            (typeof configurationObject.context?.value === 'function'
              ? configurationObject.context.value()
              : configurationObject.context) || ({} as FormContext),
          setContext: (...args) => setContext(innerStoreApi, ...args),

          // Initial data states
          initialData: null,
          isLoadingInitialData: false,
          initialDataLoadingError: null,

          setIsLoadingInitialData: (...args) =>
            setIsLoadingInitialData(innerStoreApi, ...args),

          setInitialDataLoadingError: (...args) =>
            setInitialDataLoadingError(innerStoreApi, ...args),

          triggerInitialDataLoading: () =>
            triggerInitialDataLoading(innerStoreApi),

          getInitialDataLoadingStatus: () =>
            getInititialDataLoadingStatus(innerStoreApi),

          // Form/Step states
          currentStepName: initialStep?.name || DEFAULT_STEP_NAME,

          setCurrentStep: (...args) => setCurrentStep(innerStoreApi, ...args),

          stepHistory: [],
          lastDirection: 'idle',
          eventHistory: [],

          triggerStepValidation: () => triggerStepValidation(innerStoreApi),
          isValidatingStep: false,
          stepValidationError: '',
          didTriggerRevalidationModeForStep: false,

          setStepInitialValues: (...args) =>
            setStepInitialValues(innerStoreApi, ...args),

          resetFormState: () =>
            resetFormState(innerStoreApi, {
              initialFields,
              initialStep,
              initialConfiguration,
            }),

          getStepByName: (...args) => getStepByName(innerStoreApi, ...args),

          getStepByIndex: (...args) => getStepByIndex(innerStoreApi, ...args),

          getNextStepName: (...args) => getNextStepName(innerStoreApi, ...args),

          getPreviousStepName: (...args) =>
            getPreviousStepName(innerStoreApi, ...args),

          getStepIndexByName: (...args) =>
            getStepIndexByName(innerStoreApi, ...args),

          getStepNameByIndex: (...args) =>
            getStepNameByIndex(innerStoreApi, ...args),

          getCurrentStep: () => getCurrentStep(innerStoreApi),

          getCurrentStepIndex: () => getCurrentStepIndex(innerStoreApi),

          getFirstStep: () => getFirstStep(innerStoreApi),

          getLastStep: () => getLastStep(innerStoreApi),

          getIsFirstStep: () => getIsFirstStep(innerStoreApi),

          getIsLastStep: () => getIsLastStep(innerStoreApi),

          getFirstStepNameWithRequiredFieldsNotCompleted: () =>
            getFirstStepNameWithRequiredFieldsNotCompleted(innerStoreApi),

          getIsStepDirty: () => getIsStepDirty(innerStoreApi),

          getIsStepTouched: () => getIsStepTouched(innerStoreApi),

          getIsValidatingAnything: () => getIsValidatingAnything(innerStoreApi),

          getIsAnyFieldInvalid: () => getIsAnyFieldInvalid(innerStoreApi),

          getIsAnyFieldFocused: () => getIsAnyFieldFocused(innerStoreApi),

          getEventTriggerCounts: () => getEventTriggerCounts(innerStoreApi),

          // Field states
          fields: initialFields,

          setFieldValue: (...args) => setFieldValue(innerStoreApi, ...args),

          addItemToNestedArrayField: (...args) =>
            addItemToNestedArrayField(innerStoreApi, ...args),

          removeItemFromNestedArrayField: (...args) =>
            removeItemFromNestedArrayField(innerStoreApi, ...args),

          triggerFieldBlur: (...args) =>
            triggerFieldBlur(innerStoreApi, ...args),

          triggerFieldChange: (...args) =>
            triggerFieldChange(innerStoreApi, ...args),

          triggerFieldFocus: (...args) =>
            triggerFieldFocus(innerStoreApi, ...args),

          resetField: (...args) => resetField(innerStoreApi, ...args),

          resetFieldsForStep: (...args) =>
            resetFieldsForStep(innerStoreApi, ...args),

          triggerFieldValidation: (...args) =>
            triggerFieldValidation(innerStoreApi, ...args),

          triggerMultipleFieldsValidations: (...args) =>
            triggerMultipleFieldsValidations(innerStoreApi, ...args),

          triggerFieldValidationsForStep: (...args) =>
            triggerFieldValidationsForStep(innerStoreApi, ...args),

          resetValidationErrorForFields: (...args) =>
            resetValidationErrorForFields(innerStoreApi, ...args),

          resetFieldValidationErrorsForStep: () =>
            resetFieldValidationErrorsForStep(innerStoreApi),

          getFieldValue: <TFieldName extends StringKeyOf<TFormFields>>(
            ...args: Parameters<FormStore['getFieldValue']>
          ) =>
            getFieldValue(innerStoreApi, ...args) as
              | TFormFields[TFieldName]
              | undefined,

          getStepFieldValues: (...args) =>
            getStepFieldValues(innerStoreApi, ...args),

          getAllFieldValues: () => getAllFieldValues(innerStoreApi),

          getField: <TFieldName extends StringKeyOf<TFormFields>>(
            ...args: Parameters<FormStore['getField']>
          ) =>
            getField(innerStoreApi, ...args) as
              | Field<TFormFields[TFieldName], TFormFields>
              | undefined,

          getNestedArrayItemField: (...args) =>
            getNestedArrayItemField(innerStoreApi, ...args),

          getIsFormComponentShowing: (...args) =>
            getIsFormComponentShowing(innerStoreApi, ...args),

          getStepFields: (...args) => getStepFields(innerStoreApi, ...args),

          getAllFields: () => getAllFields(innerStoreApi),

          getFieldNamesByStepIndex: (...args) =>
            getFieldNamesByStepIndex(innerStoreApi, ...args),

          getFieldNamesByStepName: (...args) =>
            getFieldNamesByStepName(innerStoreApi, ...args),

          getNestedArrayItemsFields: <
            TNestedValue extends Record<string, any> = Record<string, any>,
          >(
            ...args: Parameters<FormStore['getNestedArrayItemsFields']>
          ) =>
            getNestedArrayItemsFields<TFormFields, TNestedValue>(
              innerStoreApi,
              ...args
            ),

          getDirtyFields: () => getDirtyFields(innerStoreApi),

          getTouchedFields: () => getTouchedFields(innerStoreApi),

          getRequiredFields: () => getRequiredFields(innerStoreApi),

          getStepRequiredFields: (...args) =>
            getStepRequiredFields(innerStoreApi, ...args),

          getInvalidFields: () => getInvalidFields(innerStoreApi),

          getIsValidatingFields: () => getIsValidatingFields(innerStoreApi),

          getFieldValidationError: (...args) =>
            getFieldValidationError(innerStoreApi, ...args),

          // Component params states
          componentParams: initialComponentParams,

          getAreComponentParamsLoading: (...args) =>
            getAreComponentParamsLoading(innerStoreApi, ...args),

          getComponentParamsLoadingError: (...args) =>
            getComponentParamsLoadingError(innerStoreApi, ...args),

          getComponentParams: (...args) =>
            getComponentParams(innerStoreApi, ...args),

          setComponentParams: (...args) =>
            setComponentParams(innerStoreApi, ...args),

          triggerDynamicComponentParams: (...args) =>
            triggerDynamicComponentParams(innerStoreApi, ...args),

          triggerAllDynamicComponentParamsForStep: (...args) =>
            triggerAllDynamicComponentParamsForStep(innerStoreApi, ...args),

          getComponentConfiguration: (...args) =>
            getComponentConfiguration(innerStoreApi, ...args),

          getAreAnyComponentParamsLoading: () =>
            getAreAnyComponentParamsLoading(innerStoreApi),

          getAreAnyComponentParamsLoadingErrors: () =>
            getAreAnyComponentParamsLoadingErrors(innerStoreApi),

          getComponentsWithComponentParamsLoadingError: () =>
            getComponentsWithComponentParamsLoadingError(innerStoreApi),

          // Form control handler states
          // Next/Prev
          isChangingStep: false,
          isGoingToPreviousStep: false,
          isGoingToNextStep: false,
          stepChangeError: null,
          triggerGoToStep: (...args) => triggerGoToStep(innerStoreApi, ...args),
          triggerGoToNextStep: (...args) =>
            triggerGoToNextStep(innerStoreApi, ...args),
          triggerGoToPreviousStep: (...args) =>
            triggerGoToPreviousStep(innerStoreApi, ...args),

          // Save
          isSaving: false,
          saveError: null,
          triggerSave: (...args) => triggerSave(innerStoreApi, ...args),

          // Auto save
          isAutoSaving: false,
          autoSaveError: null,
          triggerAutoSave: () => triggerAutoSave(innerStoreApi),

          // Submit
          isSubmitting: false,
          submitError: null,
          triggerSubmit: (...args) => triggerSubmit(innerStoreApi, ...args),
          didSubmitSuccessfully: false,
        }
      }),
      {
        store: nanoid().substring(0, 2),
        enabled:
          typeof window !== 'undefined' &&
          localStorage.getItem('REACT_FLEXYFORM_DEVTOOLS') === 'true',
      }
    )
  )

  return vanillaStore
}
