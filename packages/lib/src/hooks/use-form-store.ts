import { useFormComponentMappings } from '../components/form-component-mappings-provider'
import { FormStoreInstance } from '../types'

export const useFormStore = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  formStoreKey: string
) => {
  const { formStoresMap } = useFormComponentMappings()

  return formStoresMap[formStoreKey] as FormStoreInstance<TFormFields> | null
}
