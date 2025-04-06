import {
  useFormComponentParams,
  useField,
  useParentFormStore,
} from 'react-flexyform'
import { InputLabel, Radio, RadioGroupProps } from '@mantine/core'
import { useMemo } from 'react'

export type Params = Omit<RadioGroupProps, 'children'> & {
  label?: string
  radioOptions: { value: string; label: string }[]
}

export function FormIntegratedRadioField() {
  const field = useField()
  const { label, radioOptions, ...params } =
    useFormComponentParams<Params>().value

  const isDisabled = useParentFormStore(
    (formStore) =>
      formStore.isSubmitting || formStore.isChangingStep || formStore.isSaving
  )

  const fieldControls = useMemo(
    () => ({
      id: field.state.id,
      name: field.configuration.name,
      onChange: (value: string | null) => field.methods.handleChange(value),
      onBlur: field.methods.handleBlur,
      error: field.state.validationError?.[0],
      value: field.state.value,
      disabled: isDisabled,
    }),
    [field, isDisabled]
  )

  return (
    <div>
      {label && (
        <InputLabel
          htmlFor={params.id}
          required={Boolean(field.configuration.validationRules?.required)}
        >
          {label}
        </InputLabel>
      )}
      <Radio.Group {...fieldControls}>
        {radioOptions.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            label={option.label}
            my="sm"
          />
        ))}
      </Radio.Group>
    </div>
  )
}
