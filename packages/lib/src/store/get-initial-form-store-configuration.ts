import { omit } from 'lodash'
import {
  CreateFormStoreConfiguration,
  CreateStoreMultiStepConfiguration,
  CreateStoreSingleStepConfiguration,
  FormStoreConfiguration,
  Step,
} from '../types'

export const getInitialFormStoreConfigurationuration = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  configuration: CreateFormStoreConfiguration<TFormFields>,
  steps: Step<TFormFields>[],
  formId: string
): FormStoreConfiguration<TFormFields> => {
  const isSingleStep = !configuration.steps
  const singleStepConfiguration =
    configuration as CreateStoreSingleStepConfiguration<TFormFields>
  const multiStepConfiguration =
    configuration as CreateStoreMultiStepConfiguration<TFormFields>

  const initialConfigurationWithDefaultsResolved: FormStoreConfiguration<TFormFields> =
    {
      ...(isSingleStep
        ? (omit(singleStepConfiguration, [
            'initialContext',
            'fields',
            'validation',
            'components',
            'validationOptions',
            'autoSaveOptions',
          ]) as Omit<
            CreateStoreSingleStepConfiguration<TFormFields>,
            | 'initialContext'
            | 'fields'
            | 'validation'
            | 'components'
            | 'validationOptions'
            | 'autoSaveOptions'
          >)
        : (omit(multiStepConfiguration, [
            'initialContext',
            'validationOptions',
            'autoSaveOptions',
          ]) as Omit<
            CreateStoreMultiStepConfiguration<TFormFields>,
            'initialContext' | 'validationOptions' | 'autoSaveOptions'
          >)),
      steps,
      formId,
    }

  return initialConfigurationWithDefaultsResolved
}
