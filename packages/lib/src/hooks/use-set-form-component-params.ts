import { useFormComponentName } from './use-form-component-name'
import { useParentFormStore } from './use-parent-form-store'
import { shallow } from 'zustand/shallow'

export const useSetFormComponentParams = <
  TComponentParams extends Record<string, any> = Record<string, any>,
>() => {
  const formComponentNameFromContext = useFormComponentName()

  const setFormComponentParams = useParentFormStore(
    (formStore) => formStore.setComponentParams,
    shallow
  )

  return (formComponentParams: TComponentParams) =>
    setFormComponentParams(formComponentNameFromContext, formComponentParams)
}
