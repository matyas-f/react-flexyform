import {
  useFormComponentParams,
  useField,
  useParentFormStore,
} from 'react-flexyform'
import { omit } from 'lodash'
import { NumberInput, NumberInputProps } from '@mantine/core'
import { useMemo } from 'react'

export type Params = NumberInputProps

export function FormIntegratedNumberField() {
  const field = useField()
  const params = useFormComponentParams<Params>().value

  const isDisabled = useParentFormStore(
    (formStore) =>
      formStore.isSubmitting || formStore.isChangingStep || formStore.isSaving
  )

  const fieldControls = useMemo(
    () => ({
      id: field.state.id,
      name: field.configuration.name,
      onChange: field.methods.handleChange,
      onBlur: field.methods.handleBlur,
      error: field.state.validationError?.[0],
      required: Boolean(field.configuration.validationRules?.required),
      value: field.state.value,
      disabled: isDisabled,
    }),
    [field, isDisabled]
  )

  return <NumberInput {...fieldControls} {...omit(params, 'wrapperParams')} />
}
