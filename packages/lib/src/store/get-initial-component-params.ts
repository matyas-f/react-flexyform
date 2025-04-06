import { FormStore, Step } from '../types'
import { getComponentParamsName } from '../utils/name-generators'

export const getInitialComponentParams = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  steps: Step<TFormFields>[]
) => {
  return steps.reduce(
    (stepResult, step) => ({
      ...stepResult,
      ...step.components.reduce((componentResult, component) => {
        const componentName = getComponentParamsName({
          stepName: step.name,
          componentName: component.name as string,
        })

        if (typeof component.componentParams?.value === 'function') {
          return {
            ...componentResult,
            [componentName]: {
              isLoading: false,
              loadingError: null,
              value: component.componentParams.staticPart || {},
            },
          }
        }

        return {
          ...componentResult,
          [componentName]: {
            isLoading: false,
            loadingError: null,
            value: component.componentParams || {},
          },
        }
      }, {}),
    }),
    {} as FormStore['componentParams']
  )
}
