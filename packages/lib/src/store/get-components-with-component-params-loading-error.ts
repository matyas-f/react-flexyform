import { FormComponent, InnerStoreApi } from '../types'
import { getComponentConfiguration } from './get-component-configuration'

export const getComponentsWithComponentParamsLoadingError = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const { componentParams } = innerStoreApi.getStoreState()

  return Object.entries(componentParams).reduce(
    (result, [componentName, componentParams]) => {
      if (componentParams.loadingError) {
        return [
          ...result,
          getComponentConfiguration(
            innerStoreApi,
            componentName
          ) as FormComponent<TFormFields>,
        ]
      }

      return result
    },
    [] as FormComponent<TFormFields>[]
  )
}
