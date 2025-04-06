import {
  useFormComponentParams,
  useField,
  useParentFormStore,
} from 'react-flexyform'
import { omit } from 'lodash'
import { Textarea, TextareaProps } from '@mantine/core'
import { useMemo } from 'react'

export type Params = TextareaProps

export function FormIntegratedTextareaField() {
  const field = useField()
  const params = useFormComponentParams<Params>().value

  const isDisabled = useParentFormStore(
    (formStore) =>
      formStore.isSubmitting || formStore.isChangingStep || formStore.isSaving
  )

  const fieldControls = useMemo(
    () => ({
      id: field.state.id,
      value: field.state.value,
      name: field.configuration.name,
      onChange: field.methods.handleChange,
      onBlur: field.methods.handleBlur,
      error: field.state.validationError?.[0],
      required: Boolean(field.configuration.validationRules?.required),
      disabled: isDisabled,
    }),
    [field, isDisabled]
  )

  return <Textarea {...fieldControls} {...omit(params, 'wrapperParams')} />
}
