import { InnerStoreApi, StringKeyOf } from '../types'

export const getStepByFieldName = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  fieldName: StringKeyOf<TFormFields>
) => {
  const {
    configuration: { steps },
  } = innerStoreApi.getStoreState()

  const step = steps.find((step) =>
    step.components.some((component) => component.name === fieldName)
  )

  return step
}
