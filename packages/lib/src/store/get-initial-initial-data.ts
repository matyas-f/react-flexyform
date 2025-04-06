import { mapValues } from 'lodash'
import { Fields, FormStoreConfiguration } from '../types'

export const getInitialInitialData = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  configuration: FormStoreConfiguration<TFormFields>,
  fields: Fields<TFormFields>
) => {
  return typeof configuration.initialData === 'function'
    ? null
    : {
        ...((configuration.initialData as TFormFields) || {}),
        ...(mapValues(fields, (field) => field.value) as TFormFields),
      }
}
