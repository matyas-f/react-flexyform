import { useFormComponentName } from './use-form-component-name'
import { FormFieldComponent } from '../types'
import { useParentFormStore } from './use-parent-form-store'
import { useMemo } from 'react'
import { isEqual } from 'lodash'
import { shallow } from 'zustand/shallow'

export const useField = <TFieldValue = any>() => {
  const formComponentNameFromContext = useFormComponentName()

  const fieldConfiguration = useParentFormStore(
    (formStore) =>
      formStore.getComponentConfiguration(
        formComponentNameFromContext
      ) as FormFieldComponent,
    shallow
  )

  const fieldMethods = useParentFormStore(
    (formStore) => ({
      handleChange: (
        htmlEventOrValue: React.ChangeEvent<HTMLInputElement> | TFieldValue,
        options?: { shouldDisableHtmlEventHandling?: boolean }
      ) =>
        formStore.triggerFieldChange(
          formComponentNameFromContext,
          htmlEventOrValue,
          options
        ),
      handleBlur: (_?: any) =>
        formStore.triggerFieldBlur(formComponentNameFromContext),
      addItemToArray: (defaultValues?: TFieldValue) =>
        formStore.addItemToNestedArrayField(
          formComponentNameFromContext,
          defaultValues
        ),
      removeItemFromArray: (indexToRemove: number) =>
        formStore.removeItemFromNestedArrayField(
          formComponentNameFromContext,
          indexToRemove
        ),
      resetField: () => formStore.resetField(formComponentNameFromContext),
      triggerValidation: () =>
        formStore.triggerFieldValidation(formComponentNameFromContext),
    }),
    shallow
  )

  const fieldState = useParentFormStore(
    (formStore) => ({
      ...formStore.fields[formComponentNameFromContext]!,
      value: formStore.fields[formComponentNameFromContext]
        ?.value as TFieldValue,
      initialValue: formStore.fields[formComponentNameFromContext]
        ?.initialValue as TFieldValue,
      previousValue: formStore.fields[formComponentNameFromContext]
        ?.previousValue as TFieldValue,
    }),
    isEqual
  )

  const field = useMemo(
    () => ({
      configuration: fieldConfiguration,
      methods: fieldMethods,
      state: fieldState,
    }),
    [fieldConfiguration, fieldMethods, fieldState]
  )

  return field
}
