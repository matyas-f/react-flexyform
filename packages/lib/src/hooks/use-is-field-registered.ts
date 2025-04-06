import { useFormComponentName } from './use-form-component-name'
import { useParentFormStore } from './use-parent-form-store'

export const useIsFieldRegistered = (fieldName?: string) => {
  const formComponentNameFromContext = useFormComponentName()

  const isFieldRegistered = useParentFormStore((formStore) =>
    Boolean(formStore.fields[fieldName || formComponentNameFromContext])
  )

  return isFieldRegistered
}
