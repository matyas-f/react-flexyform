import { FormWrapper } from './components/internals/form-wrapper'
import { InitialDataLoadingError } from './components/internals/initial-data-loading-error'
import { InitialDataLoadingIndicator } from './components/internals/initial-data-loading-indicator'
import {
  FormIntegratedSelectField,
  Params as SelectFieldParams,
} from './components/fields/select'
import {
  FormIntegratedTextField,
  Params as TextFieldParams,
} from './components/fields/text'
import {
  FormIntegratedTitle,
  FormIntegratedParagraph,
  Params as TypographyParams,
  FormIntegratedProse,
} from './components/ui/typography'
import {
  FormIntegratedButton,
  FormIntegratedGoToNextStepButton,
  FormIntegratedGoToPreviousStepButton,
  FormIntegratedSaveButton,
  FormIntegratedSubmitButton,
  FormIntegratedRemoveNestedArrayItemButton,
  Params as ButtonParams,
} from './components/ui/button'
import { FormIntegratedGoBackConfirmationDialog } from './components/ui/go-back-confirmation-dialog'
import {
  FormIntegratedPasswordField,
  Params as PasswordFieldParams,
} from './components/fields/password'
import {
  FormIntegratedTextareaField,
  Params as TextareaFieldParams,
} from './components/fields/textarea'
import {
  FormIntegratedStepProgress,
  Params as StepProgressParams,
} from './components/ui/step-progress'
import { FormIntegratedErrorMessage } from './components/ui/error-message'
import {
  FormIntegratedNumberField,
  Params as NumberFieldParams,
} from './components/fields/number'
import {
  FormIntegratedRadioField,
  Params as RadioFieldParams,
} from './components/fields/radio'
import {
  FormIntegratedCheckboxField,
  Params as CheckboxFieldParams,
} from './components/fields/checkbox'
import {
  FormIntegratedToggleField,
  Params as ToggleFieldParams,
} from './components/fields/toggle'
import {
  FormIntegratedDateField,
  Params as DateFieldParams,
} from './components/fields/date'
import {
  FormIntegratedNestedArrayField,
  Params as NestedArrayFieldParams,
} from './components/fields/nested-array'
import { MantineSpacing, MantineStyleProps, StyleProp } from '@mantine/core'
import { ComponentWrapper } from './components/internals/component-wrapper'
import {
  FormIntegratedBorderedSection,
  Params as BorderedSectionParams,
} from './components/wrappers/bordered-section'
export type { Params as MantineComponentWrapperParams } from './components/internals/component-wrapper'

const uiComponentMappings = {
  button: FormIntegratedButton,
  submitButton: FormIntegratedSubmitButton,
  saveButton: FormIntegratedSaveButton,
  goToNextStepButton: FormIntegratedGoToNextStepButton,
  goToPreviousStepButton: FormIntegratedGoToPreviousStepButton,
  stepProgress: FormIntegratedStepProgress,
  errorMessage: FormIntegratedErrorMessage,
  title: FormIntegratedTitle,
  paragraph: FormIntegratedParagraph,
  prose: FormIntegratedProse,
  goBackConfirmationDialog: FormIntegratedGoBackConfirmationDialog,
  removeNestedArrayItemButton: FormIntegratedRemoveNestedArrayItemButton,
}

export interface MantineKitUiComponentMappingsInterface {
  stepProgress: StepProgressParams
  errorMessage: Record<string, never>
  title: TypographyParams
  paragraph: TypographyParams
  prose: TypographyParams
  button: ButtonParams
  saveButton: ButtonParams
  submitButton: ButtonParams
  goToNextStepButton: ButtonParams
  goToPreviousStepButton: ButtonParams
  goBackConfirmationDialog: Record<string, never>
  removeNestedArrayItemButton: ButtonParams
}

const fieldComponentMappings = {
  text: FormIntegratedTextField,
  password: FormIntegratedPasswordField,
  textarea: FormIntegratedTextareaField,
  number: FormIntegratedNumberField,
  select: FormIntegratedSelectField,
  radio: FormIntegratedRadioField,
  checkbox: FormIntegratedCheckboxField,
  toggle: FormIntegratedToggleField,
  date: FormIntegratedDateField,
  nestedArray: FormIntegratedNestedArrayField,
}

export interface MantineKitFieldComponentMappingsInterface {
  text: TextFieldParams
  password: PasswordFieldParams
  textarea: TextareaFieldParams
  number: NumberFieldParams
  select: SelectFieldParams
  radio: RadioFieldParams
  checkbox: CheckboxFieldParams
  toggle: ToggleFieldParams
  date: DateFieldParams
  nestedArray: NestedArrayFieldParams
}

const wrapperComponentMappings = {
  borderedSection: FormIntegratedBorderedSection,
}

export interface MantineKitWrapperComponentMappingsInterface {
  borderedSection: BorderedSectionParams
}

const internalComponentMappings = {
  formWrapper: FormWrapper,
  componentWrapper: ComponentWrapper,
  initialDataLoadingIndicator: InitialDataLoadingIndicator,
  initialDataLoadingError: InitialDataLoadingError,
}

export type MantineKitMappingTypes = {
  uiComponentMappings: MantineKitUiComponentMappingsInterface
  fieldComponentMappings: MantineKitFieldComponentMappingsInterface
  wrapperComponentMappings: MantineKitWrapperComponentMappingsInterface
}

export const MantineKitMappings = {
  uiComponentMappings,
  fieldComponentMappings,
  wrapperComponentMappings,
  internalComponentMappings,
}

export type MantineFormComponentsContext = {
  formGridGutter?: StyleProp<MantineSpacing>
  formGridClassName?: string
  formGridStyleProps?: MantineStyleProps
  isFormInModal?: boolean
  onFormModalClose?: () => void
  isConfirmGoBackModalOpen?: boolean
}
