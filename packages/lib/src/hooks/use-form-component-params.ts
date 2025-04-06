import { isEqual } from 'lodash'
import { useFormComponentName } from './use-form-component-name'
import { useParentFormStore } from './use-parent-form-store'

export const useFormComponentParams = <
  TComponentParams extends Record<string, any> = Record<string, any>,
>() => {
  const formComponentNameFromContext = useFormComponentName()

  const formComponentParams = useParentFormStore(
    (formStore) => ({
      isLoading: formStore.getAreComponentParamsLoading(
        formComponentNameFromContext
      ),
      error: formStore.getComponentParamsLoadingError(
        formComponentNameFromContext
      ),
      value: (formStore.getComponentParams(formComponentNameFromContext) ||
        {}) as TComponentParams,
    }),
    isEqual
  )

  return formComponentParams
}
