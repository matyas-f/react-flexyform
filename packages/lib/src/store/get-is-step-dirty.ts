import { InnerStoreApi } from '../types'
import { getStepFields } from './get-step-fields'

export const getIsStepDirty = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  return Object.values(getStepFields(innerStoreApi)).some(
    (field) => field.isDirty
  )
}
