import { CreateFormStoreConfiguration } from '../types'

export const getInitialIsLoadingInitialData = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  configuration: CreateFormStoreConfiguration<TFormFields>
) => {
  return typeof configuration.initialData === 'function' ? true : false
}
