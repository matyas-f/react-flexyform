import { useNestedArrayItemInfo } from './use-form-component-name'
import { FormFieldComponent } from '../types'
import { useParentFormStore } from './use-parent-form-store'
import { shallow } from 'zustand/shallow'
import { useMemo } from 'react'
import { isEqual } from 'lodash'

export const useParentField = <TFieldValue = any>() => {
  const { isNestedArrayItem, parentFieldName: _parentFieldName } =
    useNestedArrayItemInfo()
  const parentFieldName = _parentFieldName as string

  const fieldConfiguration = useParentFormStore(
    (formStore) =>
      formStore.getComponentConfiguration(
        parentFieldName
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
          parentFieldName,
          htmlEventOrValue,
          options
        ),
      handleBlur: (_?: any) => formStore.triggerFieldBlur(parentFieldName),
      addItemToArray: (defaultValues?: TFieldValue) =>
        formStore.addItemToNestedArrayField(parentFieldName, defaultValues),
      removeItemFromArray: (indexToRemove: number) =>
        formStore.removeItemFromNestedArrayField(
          parentFieldName,
          indexToRemove
        ),
      triggerValidation: () =>
        formStore.triggerFieldValidation(parentFieldName),
    }),
    shallow
  )

  const fieldState = useParentFormStore(
    (formStore) => ({
      ...formStore.fields[parentFieldName],
      value: formStore.fields[parentFieldName]?.value as TFieldValue,
      initialValue: formStore.fields[parentFieldName]
        ?.initialValue as TFieldValue,
      previousValue: formStore.fields[parentFieldName]
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

  if (!isNestedArrayItem) {
    return null
  }

  return field
}
