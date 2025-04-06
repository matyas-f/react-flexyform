import { StoreApi } from 'zustand'
import { FormStoreCache } from './cache'

declare global {
  interface FormContext extends Record<string, any> {}

  interface ComponentWrapperParams {}

  interface FormFieldComponentMappings {}

  interface FormUiComponentMappings {}

  interface FormWrapperComponentMappings {}
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

export type StringKeyOf<T extends Record<string, any>> = Extract<
  keyof T,
  string
>

export type StateSetter<T> = (state: T) => T
export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type Direction = 'idle' | 'previous' | 'next'
export type InternalComponents =
  | 'formWrapper'
  | 'initialDataLoadingIndicator'
  | 'initialDataLoadingError'
export type LoadingStatus = 'loading' | 'error' | 'success'
export type FormControlEventType =
  | 'goToNextStep'
  | 'goToPreviousStep'
  | 'goToStep'
  | 'save'
  | 'submit'

export type FormControlEventEntry = {
  stepName: string
  type: FormControlEventType
}

export type FormEvents = {
  onGoToStep?: () => Promise<any> | any
  onGoToStepError?: () => any
  onGoToStepSuccess?: () => any
  onGoToNextStep?: () => Promise<any> | any
  onGoToNextStepError?: () => any
  onGoToNextStepSuccess?: () => any
  onGoToPreviousStep?: () => Promise<any> | any
  onGoToPreviousStepError?: () => any
  onGoToPreviousStepSuccess?: () => any
  onSubmit?: () => Promise<any> | any
  onSubmitError?: () => any
  onSubmitSuccess?: () => any
  onSave?: (abortController: AbortController) => Promise<any> | any
  onSaveError?: () => any
  onSaveSuccess?: () => any
  onStepChange?: () => Promise<any> | any
  onStepChangeError?: () => any
  onStepChangeSuccess?: () => any
  onAutoSave?: (abortController: AbortController) => Promise<any> | any
  onAutoSaveError?: () => any
  onAutoSaveSuccess?: () => any
}

type FieldValidationRuleBase = {
  message: string | ((nestedArrayItemIndex: number | null) => string)
  priority?: number
}

export type FieldValidationRule<ValueType> = FieldValidationRuleBase & {
  value: ValueType
}

export type FieldValidationRules = {
  required?: FieldValidationRuleBase
  maxLength?: FieldValidationRule<number>
  minLength?: FieldValidationRule<number>
  exactLength?: FieldValidationRule<number>
  minValue?: FieldValidationRule<number>
  maxValue?: FieldValidationRule<number>
  minDate?: FieldValidationRule<string>
  maxDate?: FieldValidationRule<string>
  email?: FieldValidationRuleBase
  url?: FieldValidationRuleBase
  onlyStrongPasswordCharacters?: FieldValidationRuleBase
  phoneNumber?: FieldValidationRuleBase & {
    options?: {
      country?: string
      validateMobilePrefix?: boolean
      strictDetection?: boolean
    }
  }
  pattern?: FieldValidationRule<string | RegExp>
  matchAnotherField?: FieldValidationRule<string>
  mustBeEqualTo?: FieldValidationRule<any>
  customValidation?: {
    validate: (nestedArrayItemIndex: number | null) => string
    priority?: number
  }
  customAsyncValidation?: (
    nestedArrayItemIndex: number | null,
    abortController: AbortController
  ) => Promise<string>
}

export type FormComponentTypes = 'wrapper' | 'ui' | 'field'

export type FormComponentBase<
  TFormFields extends Record<string, any> = Record<string, any>,
> = {
  type: FormComponentTypes
  componentParams?:
    | Record<string, any>
    | {
        value: (
          nestedArrayItemIndex: number | null,
          abortController: AbortController
        ) => Promise<Record<string, any>> | Record<string, any>
        isAsync?: boolean
        staticPart?: Record<string, any>
        dependencies?: () => any[]
      }
  reactToChanges?: {
    functionToRun: (nestedArrayItemIndex: number | null) => any
    dependencies?: () => any[]
  }
  shouldShowOnlyIf?:
    | Partial<Record<StringKeyOf<TFormFields>, any>>
    | {
        value: (nestedArrayItemIndex: number | null) => boolean
        dependencies: () => any[]
      }
  shouldShowOnlyIfMediaQueryMatches?: string
  shouldShowOnlyOnScreenSize?: ScreenSize
}

export type FormFieldComponent<
  TFormFields extends Record<string, any> = Record<string, any>,
> = FormComponentBase<TFormFields> & {
  type: 'field'
  name: StringKeyOf<TFormFields>
  formComponentMappingKey: keyof FormFieldComponentMappings
  defaultValue?: any
  nestedArrayComponents?: (
    | (Omit<
        FormFieldComponent<TFormFields>,
        'nestedArrayComponents' | 'name'
      > & {
        name: string
        nestedArrayComponents?: never
      })
    | FormUiComponent<TFormFields>
    | FormWrapperComponent<TFormFields>
  )[]
  validationRules?: FieldValidationRules & {
    dependencies?: () => any[]
    debounceDurationInMs?: number
    asyncDebounceDurationInMs?: number
  }
  shouldKeepValueEvenIfHidden?: boolean
  shouldIncludeInValuesEvenIfNotShowing?: boolean
}

export type FormFieldComponentConfiguration<
  TFormFields extends Record<string, any> = Record<string, any>,
> = Omit<FormFieldComponent<TFormFields>, 'nestedArrayComponents'> & {
  nestedArrayComponents?: (
    | (Omit<
        FormFieldComponentConfiguration<TFormFields>,
        'nestedArrayComponents' | 'name'
      > & {
        name: string
      })
    | FormUiComponentConfiguration<TFormFields>
    | FormWrapperComponentConfiguration<TFormFields>
  )[]
}

export type FormUiComponent<
  TFormFields extends Record<string, any> = Record<string, any>,
> = FormComponentBase<TFormFields> & {
  type: 'ui'
  formComponentMappingKey: keyof FormUiComponentMappings
  name: string
}

export type FormUiComponentConfiguration<
  TFormFields extends Record<string, any> = Record<string, any>,
> = Omit<FormUiComponent<TFormFields>, 'name'> & {
  name?: string
}

type FormWrapperBaseComponent<
  TFormFields extends Record<string, any> = Record<string, any>,
> = FormComponentBase<TFormFields> & {
  type: 'wrapper'
  wrapping: 'start' | 'end'
  formComponentMappingKey: keyof FormWrapperComponentMappings
  name: string
}

export type FormWrapperStartComponent<
  TFormFields extends Record<string, any> = Record<string, any>,
> = FormWrapperBaseComponent<TFormFields> & {
  wrapping: 'start'
}

export type FormWrapperEndComponent<
  TFormFields extends Record<string, any> = Record<string, any>,
> = Omit<
  FormComponentBase<TFormFields>,
  | 'componentParams'
  | 'reactToChanges'
  | 'shouldShowOnlyIf'
  | 'shouldShowOnlyOnScreenSize'
  | 'shouldShowOnlyIfMediaQueryMatches'
> & {
  wrapping: 'end'
  componentParams?: never
  shouldShowOnlyIf?: never
  shouldShowOnlyOnScreenSize?: never
  shouldShowOnlyIfMediaQueryMatches?: never
}

export type FormWrapperComponent<
  TFormFields extends Record<string, any> = Record<string, any>,
> = FormComponentBase<TFormFields> & {
  type: 'wrapper'
  formComponentMappingKey: keyof FormWrapperComponentMappings
  wrapping: 'start' | 'end'
  name: string
  reactToChanges?: never
  defaultValue?: never
  nestedArrayComponents?: never
  validationRules?: never
  validationFieldNameDependencies?: never
}

export type FormWrapperComponentConfiguration<
  TFormFields extends Record<string, any> = Record<string, any>,
> = FormWrapperComponent<TFormFields>

export type FormComponentConfiguration<
  TFormFields extends Record<string, any> = Record<string, any>,
> =
  | FormFieldComponentConfiguration<TFormFields>
  | FormUiComponentConfiguration<TFormFields>
  | FormWrapperComponentConfiguration<TFormFields>

export type FormComponent<
  TFormFields extends Record<string, any> = Record<string, any>,
> =
  | FormFieldComponent<TFormFields>
  | FormUiComponent<TFormFields>
  | FormWrapperComponent<TFormFields>

export type ScreenSize = { min: number | null; max: number | null }

export type StepConfiguration<
  TFormFields extends Record<string, any> = Record<string, any>,
> = {
  name: string
  components: FormComponentConfiguration<TFormFields>[]
  validate?: () => string
  validateAsync?: (abortController: AbortController) => Promise<string>
  shouldSkipWhenGoingToNextStep?: () => boolean
  shouldSkipWhenGoingToPreviousStep?: () => boolean
  shouldSkip?: () => boolean
  nextStepDestination?: () => string
  previousStepDestination?: () => string
  onMount?: () => any
  onUnmount?: () => any
  validationOptions?: Partial<ValidationOptions<TFormFields>>
  autoSaveOptions?: Partial<AutoSaveOptions<TFormFields>>
  shouldSubmitOnEnter?: boolean
  shouldSaveOnEnter?: boolean
  shouldGoToNextStepOnEnter?: boolean
}

export type Step<
  TFormFields extends Record<string, any> = Record<string, any>,
> = Omit<
  StepConfiguration<TFormFields>,
  'components' | 'validationOptions' | 'autoSaveOptions'
> & {
  components: FormComponent<TFormFields>[]
  validationOptions: ValidationOptions
  autoSaveOptions: AutoSaveOptions<TFormFields>
}

type CreateStoreConfigurationBase<
  TFormFields extends Record<string, any> = Record<string, any>,
> = {
  formId?: string
  initialData?:
    | TFormFields
    | Promise<TFormFields>
    | (() => Promise<TFormFields>)
  context?:
    | FormContext
    | { value: () => FormContext; dependencies?: () => any[] }
  validationOptions?: Partial<ValidationOptions>
  autoSaveOptions?: Partial<AutoSaveOptions>
  events?: FormEvents
}

export type CreateStoreMultiStepConfiguration<
  TFormFields extends Record<string, any> = Record<string, any>,
> = CreateStoreConfigurationBase<TFormFields> & {
  steps: StepConfiguration<TFormFields>[]
  startAtStep?: () => string
  components?: never
  validate?: never
  validateAsync?: never
}

export type CreateStoreSingleStepConfiguration<
  TFormFields extends Record<string, any> = Record<string, any>,
> = CreateStoreConfigurationBase<TFormFields> & {
  steps?: never
  startAtStep?: never
  components: FormComponentConfiguration<TFormFields>[]
  validate?: () => string
  validateAsync?: () => Promise<string>
  shouldSubmitOnEnter?: boolean
  shouldSaveOnEnter?: boolean
}

export type CreateFormStoreConfiguration<
  TFormFields extends Record<string, any> = Record<string, any>,
> =
  | CreateStoreSingleStepConfiguration<TFormFields>
  | CreateStoreMultiStepConfiguration<TFormFields>

export type ValidationTrigger<
  TFormFields extends Record<string, any> = Record<string, any>,
> =
  | {
      trigger: 'fieldBlur' | 'fieldValueChange'
      excludeFieldNamesOnly?: StringKeyOf<TFormFields>[]
      includeFieldNamesOnly?: StringKeyOf<TFormFields>[]
    }
  | 'fieldBlur'
  | 'fieldValueChange'
  | 'goToNextStep'
  | 'goToPreviousStep'
  | 'goToStep'
  | 'save'

export type ValidationOptions<
  TFormFields extends Record<string, any> = Record<string, any>,
> = {
  shouldFocusFirstInvalidField: boolean
  validateFieldsOn: ValidationTrigger<TFormFields>[]
  reValidateFieldsOn: ValidationTrigger<TFormFields>[]
  fieldValidationDebounceDurationInMs: number
  fieldAsyncValidationDebounceDurationInMs: number
  validateStepOn: ValidationTrigger<TFormFields>[]
  reValidateStepOn: ValidationTrigger<TFormFields>[]
  stepValidationDebounceDurationInMs: number
  stepAsyncValidationDebounceDurationInMs: number
}

export type AutoSaveOptions<
  TFormFields extends Record<string, any> = Record<string, any>,
> = {
  enabled: boolean
  autoSaveOn: (
    | {
        trigger: 'fieldBlur' | 'fieldValueChange'
        excludeFieldNamesOnly?: StringKeyOf<TFormFields>[] | undefined
        includeFieldNamesOnly?: StringKeyOf<TFormFields>[] | undefined
      }
    | 'fieldBlur'
    | 'fieldValueChange'
    | 'interval'
  )[]
  autoSaveIntervalInMs: number | null
  autoSaveDebounceDurationInMs: number
  ignoreValidation?: boolean
}

export type FormStoreConfiguration<
  TFormFields extends Record<string, any> = Record<string, any>,
> = Omit<
  CreateStoreMultiStepConfiguration<TFormFields>,
  'steps' | 'validationOptions' | 'autoSaveOptions'
> & {
  steps: Step<TFormFields>[]
  formId: string
}

export type Field<
  TFieldValue = any,
  TFormFields extends Record<string, any> = Record<string, any>,
> = {
  stepInitialValue: TFieldValue
  initialValue: TFieldValue
  value: TFieldValue
  previousValue: TFieldValue
  id: string
  name: StringKeyOf<TFormFields>
  stepName: string
  isTouched: boolean
  isDirty: boolean
  isValidating: boolean
  validationError: null | string[]
  didPassAsyncValidation: boolean
  didTriggerRevalidationMode: boolean
  lastValidatedValue: TFieldValue
}

export type Fields<
  TFormFields extends Record<string, any> = Record<string, any>,
> = {
  [FieldName in Extract<keyof TFormFields, string>]: Field<
    TFormFields[FieldName],
    TFormFields
  >
}

export type FormStoreInstance<
  TFormFields extends Record<string, any> = Record<string, any>,
> = StoreApi<FormStore<TFormFields>>

export type FormStore<
  TFormFields extends Record<string, any> = Record<string, any>,
> = {
  // Configuration
  configuration: FormStoreConfiguration<TFormFields>

  // Context
  context: FormContext
  setContext: (context: Partial<FormContext>) => void

  // Initial data states
  initialData: TFormFields | null
  isLoadingInitialData: boolean
  initialDataLoadingError: Error | null
  setIsLoadingInitialData: (isLoading: boolean) => void
  setInitialDataLoadingError: (error: Error | null) => void
  triggerInitialDataLoading: () => Promise<void>
  getInitialDataLoadingStatus: () => LoadingStatus

  // Form/Step states
  currentStepName: string
  setCurrentStep: (stepName: string) => {
    currentStepName: string
    lastDirection: Direction
    stepHistory: string[]
  }
  stepHistory: string[]
  lastDirection: Direction
  triggerStepValidation: (options?: {
    useDebounce?: boolean
  }) => Promise<boolean>
  isValidatingStep: boolean
  stepValidationError: string
  eventHistory: FormControlEventEntry[]
  didTriggerRevalidationModeForStep: boolean
  setStepInitialValues: (stepName: string) => void
  resetFormState: () => void
  getStepByName: (stepName: string) => Step<TFormFields> | undefined
  getStepByIndex: (stepIndex: number) => Step<TFormFields> | undefined
  getNextStepName: (stepName?: string) => string
  getPreviousStepName: (stepName?: string) => string
  getStepIndexByName: (stepName: string) => number
  getStepNameByIndex: (stepIndex: number) => string
  getCurrentStep: () => Step<TFormFields>
  getCurrentStepIndex: () => number
  getFirstStep: () => Step<TFormFields>
  getLastStep: () => Step<TFormFields>
  getFirstStepNameWithRequiredFieldsNotCompleted: () => string | undefined
  getIsLastStep: () => boolean
  getIsFirstStep: () => boolean
  getIsStepDirty: () => boolean
  getIsStepTouched: () => boolean
  getIsValidatingAnything: () => boolean
  getEventTriggerCounts: () => Record<FormControlEventType, number>

  // Form field states
  fields: {
    [FieldName in StringKeyOf<TFormFields>]: Field<
      TFormFields[FieldName],
      TFormFields
    >
  }
  setFieldValue: <TFieldName extends StringKeyOf<TFormFields>>(
    fieldName: TFieldName,
    value: TFormFields[TFieldName],
    options?: {
      shouldSetIsDirty?: boolean
      shouldSetIsTouched?: boolean
      shouldTriggerValidation?: boolean
    }
  ) => void
  triggerFieldBlur: (fieldName: StringKeyOf<TFormFields>) => void
  triggerFieldChange: <TFieldName extends StringKeyOf<TFormFields>>(
    fieldName: StringKeyOf<TFormFields>,
    htmlEventOrValue:
      | React.ChangeEvent<HTMLInputElement>
      | TFormFields[TFieldName],
    options?: { shouldDisableHtmlEventHandling?: boolean }
  ) => void
  addItemToNestedArrayField: <TFieldName extends StringKeyOf<TFormFields>>(
    fieldName: StringKeyOf<TFormFields>,
    defaultValues?: TFormFields[TFieldName]
  ) => void
  removeItemFromNestedArrayField: (
    fieldName: StringKeyOf<TFormFields>,
    indexToRemove: number
  ) => void
  triggerFieldFocus: (fieldName: StringKeyOf<TFormFields>) => boolean
  resetField: (
    fieldName: StringKeyOf<TFormFields>,
    options?: {
      shouldKeepValue?: boolean
      shouldKeepIsDirty?: boolean
      shouldKeepIsTouched?: boolean
      shouldKeepValidationError?: boolean
      shouldResetToStepstaticPart?: boolean
    }
  ) => void
  resetFieldsForStep: (
    stepName?: string,
    options?: {
      shouldKeepValue?: boolean
      shouldKeepIsDirty?: boolean
      shouldKeepIsTouched?: boolean
      shouldKeepValidationError?: boolean
      shouldResetToStepstaticPart?: boolean
    }
  ) => void
  triggerFieldValidation: (
    fieldName: StringKeyOf<TFormFields>,
    options?: {
      shouldFocusInvalidField?: boolean
      onSuccess?: () => any
      useDebounce?: boolean
    }
  ) => Promise<boolean>
  triggerMultipleFieldsValidations: (
    fieldNames: StringKeyOf<TFormFields>[],
    options?: {
      shouldFocusInvalidField?: boolean
      useDebounce?: boolean
    }
  ) => Promise<boolean>
  triggerFieldValidationsForStep: (options?: {
    shouldFocusInvalidField?: boolean
  }) => Promise<boolean>
  resetValidationErrorForFields: (
    fieldNames: StringKeyOf<TFormFields>[]
  ) => void
  resetFieldValidationErrorsForStep: () => void
  getFieldValue: <TFieldName extends StringKeyOf<TFormFields>>(
    fieldName: TFieldName
  ) => TFormFields[TFieldName] | undefined
  getStepFieldValues: (stepName?: string) => TFormFields
  getAllFieldValues: () => TFormFields
  getField: <TFieldName extends StringKeyOf<TFormFields>>(
    fieldName: TFieldName
  ) => Field<TFormFields[TFieldName], TFormFields> | undefined
  getNestedArrayItemField: (params: {
    parentFieldName: StringKeyOf<TFormFields>
    fieldName: string
    nestedItemIndex: number
  }) => Field<any, TFormFields> | undefined
  getIsFormComponentShowing: (
    formComponentName: string,
    options?: { shouldConsiderScreenSize?: boolean }
  ) => boolean
  getStepFields: (stepName?: string) => Record<StringKeyOf<TFormFields>, Field>
  getAllFields: () => Record<StringKeyOf<TFormFields>, Field>
  getFieldNamesByStepIndex: (stepIndex: number) => StringKeyOf<TFormFields>[]
  getFieldNamesByStepName: (stepName?: string) => StringKeyOf<TFormFields>[]
  getNestedArrayItemsFields: <
    TNestedValueStructure extends Record<string, any> = Record<string, any>,
  >(
    parentNestedArrayFieldName: StringKeyOf<TFormFields>
  ) => {
    [K in keyof TNestedValueStructure]: Field<
      TNestedValueStructure[K],
      TFormFields
    >
  }[]
  getDirtyFields: () => FormFieldComponent<TFormFields>[]
  getTouchedFields: () => FormFieldComponent<TFormFields>[]
  getRequiredFields: () => FormFieldComponent<TFormFields>[]
  getStepRequiredFields: (
    stepName?: string
  ) => FormFieldComponent<TFormFields>[]
  getInvalidFields: () => FormFieldComponent<TFormFields>[]
  getIsValidatingFields: () => boolean
  getIsAnyFieldInvalid: () => boolean
  getIsAnyFieldFocused: () => boolean
  getFieldValidationError: (
    fieldName: StringKeyOf<TFormFields>
  ) => Field['validationError']

  // Form component states
  componentParams: Record<
    string,
    {
      value: Record<string, any>
      isLoading: boolean
      loadingError: Error | null
    }
  >
  getComponentParams: (
    componentName: StringKeyOf<TFormFields> | (string & {})
  ) => Record<string, any> | undefined
  getAreComponentParamsLoading: (componentName: string) => boolean
  getComponentParamsLoadingError: (componentName: string) => Error | null
  setComponentParams: (
    componentName: StringKeyOf<TFormFields> | (string & {}),
    componentParams: Record<string, any> | null | undefined
  ) => void
  triggerDynamicComponentParams: (
    componentName: StringKeyOf<TFormFields> | (string & {})
  ) => Promise<void>
  triggerAllDynamicComponentParamsForStep: () => Promise<void>
  getAreAnyComponentParamsLoading: () => boolean
  getAreAnyComponentParamsLoadingErrors: () => boolean
  getComponentsWithComponentParamsLoadingError: () => FormComponent<TFormFields>[]
  getComponentConfiguration: (
    componentName: StringKeyOf<TFormFields> | (string & {})
  ) => FormComponentConfiguration<TFormFields> | undefined

  // Form control handler states
  // Next/Prev
  triggerGoToStep: (params: {
    stepName: string
    onGoToStep?: () => Promise<any> | any
    onGoToStepError?: () => any
    onGoToStepSuccess?: () => any
  }) => Promise<void>
  triggerGoToNextStep: (params?: {
    onGoToNextStep?: () => Promise<any> | any
    onGoToNextStepError?: () => any
    onGoToNextStepSuccess?: () => any
  }) => Promise<void>
  triggerGoToPreviousStep: (params?: {
    onGoToPreviousStep?: () => Promise<any> | any
    onGoToPreviousStepError?: () => any
    onGoToPreviousStepSuccess?: () => any
    shouldKeepFieldValues?: boolean
  }) => Promise<void>
  isChangingStep: boolean
  isGoingToNextStep: boolean
  isGoingToPreviousStep: boolean
  stepChangeError: Error | null

  // Save
  triggerSave: (params?: {
    onSave?: (abortController: AbortController) => Promise<any> | any
    onSaveError?: () => any
    onSaveSuccess?: () => any
  }) => Promise<void>
  isSaving: boolean
  saveError: Error | null

  triggerAutoSave: (params?: {
    onAutoSave?: (abortController: AbortController) => Promise<any> | any
    onAutoSaveError?: () => any
    onAutoSaveSuccess?: () => any
    useDebounce?: boolean
    fieldName?: string
  }) => Promise<void>
  isAutoSaving: boolean
  autoSaveError: Error | null

  // Submit
  triggerSubmit: (params?: {
    onSubmit?: () => Promise<any> | any
    onSubmitError?: () => any
    onSubmitSuccess?: () => any
    shouldSkipValidation?: boolean
  }) => Promise<void>
  isSubmitting: boolean
  submitError: Error | null
  didSubmitSuccessfully: boolean
}

export type InnerStoreApi<
  TFormFields extends Record<string, any> = Record<string, any>,
> = {
  getStoreState: () => FormStore<TFormFields>
  setStoreState: (
    nextStateOrUpdater:
      | FormStore<TFormFields>
      | Partial<FormStore<TFormFields>>
      | ((state: FormStore<TFormFields>) => void),
    shouldReplace?: boolean | undefined,
    reduxDevtoolsMetadata?: string
  ) => void
  cache: FormStoreCache<TFormFields>
  calledBy?: string[]
}
