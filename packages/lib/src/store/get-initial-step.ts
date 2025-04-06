import { FormStoreConfiguration, Step } from '../types'

export const getInitialStep = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  configuration: FormStoreConfiguration<TFormFields>
): Step<TFormFields> => {
  {
    if (
      configuration.startAtStep &&
      typeof configuration.initialData !== 'function'
    ) {
      return (
        configuration.steps.find(
          (s) => s.name === configuration.startAtStep?.()
        ) || (configuration.steps[0] as Step<TFormFields>)
      )
    }

    return configuration.steps[0] as Step<TFormFields>
  }
}
