import { mapValues, pick, isEqual, uniq } from 'lodash'
import { FormStore, StringKeyOf } from '../types'
import { useParentFormStore } from './use-parent-form-store'
import { usePreviousValue } from './use-previous-value'
import { useMemo } from 'react'

export const useSubscribeToFieldValueChanges = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  fieldNames: StringKeyOf<TFormFields>[]
) => {
  const fieldValues = useParentFormStore(
    (formStore: FormStore<TFormFields>) => {
      if (fieldNames.length === 0) {
        return {} as TFormFields
      }

      const relevantFields = pick(formStore.fields, uniq(fieldNames))

      return mapValues(relevantFields, (field) => field.value) as TFormFields
    },
    isEqual
  )

  return fieldValues
}

export const useSubscribeToFieldValueChangesWithChangedFieldsReturned = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  fieldNames: StringKeyOf<TFormFields>[]
) => {
  const fieldValues = useParentFormStore(
    (formStore: FormStore<TFormFields>) => {
      if (fieldNames.length === 0) {
        return {} as TFormFields
      }

      const relevantFields = pick(formStore.fields, uniq(fieldNames))

      return mapValues(relevantFields, (field) => field.value) as TFormFields
    },
    isEqual
  )

  const previousFieldValues = usePreviousValue(fieldValues)

  const changedFields = useMemo(
    () =>
      Object.keys(fieldValues)
        .reduce((result, fieldName) => {
          if (
            isEqual(fieldValues[fieldName], previousFieldValues?.[fieldName])
          ) {
            return [...result, fieldName as StringKeyOf<TFormFields>]
          }

          return result
        }, [] as StringKeyOf<TFormFields>[])
        .sort((a, b) => a.localeCompare(b)),
    [fieldValues]
  )

  return { fieldValues, changedFields }
}
