import { useFormComponentName } from './use-form-component-name'
import { useParentFormStore } from './use-parent-form-store'
import { useSubscribeToFieldValueChanges } from './use-subscribe-to-field-value-changes'

export const useFieldErrorMessage = () => {
  const formComponentNameFromContext = useFormComponentName()

  useSubscribeToFieldValueChanges([formComponentNameFromContext])

  const validationError = useParentFormStore(
    (formStore) =>
      formStore.fields[formComponentNameFromContext]?.validationError
  )

  return validationError || ''
}
