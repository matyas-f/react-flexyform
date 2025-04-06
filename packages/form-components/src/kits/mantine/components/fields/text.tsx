import {
  useFormComponentParams,
  useField,
  useParentFormStore,
} from 'react-flexyform'
import { omit } from 'lodash'
import { Loader, TextInput, TextInputProps } from '@mantine/core'
import { useMemo } from 'react'
import { IconCheck } from '@tabler/icons-react'

export type Params = TextInputProps

export function FormIntegratedTextField() {
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
      rightSection: field.state.isValidating ? (
        <Loader size="sm" />
      ) : !field.state.validationError && field.state.didPassAsyncValidation ? (
        <IconCheck size={14} color="green" />
      ) : undefined,
    }),
    [field, isDisabled]
  )

  return <TextInput {...fieldControls} {...omit(params, 'wrapperParams')} />
}
