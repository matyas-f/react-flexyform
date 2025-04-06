import {
  useFormComponentParams,
  useField,
  useParentFormStore,
} from 'react-flexyform'
import { omit } from 'lodash'
import { Loader, Select, SelectProps } from '@mantine/core'
import { useMemo } from 'react'

export type Params = SelectProps & {
  loading?: boolean
}

export function FormIntegratedSelectField() {
  const field = useField()
  const {
    value: params,
    isLoading: areDynamicComponentParamsLoading,
    error: dynamicComponentParamsLoadingError,
  } = useFormComponentParams<Params>()

  const isDisabled = useParentFormStore(
    (formStore) =>
      formStore.isSubmitting || formStore.isChangingStep || formStore.isSaving
  )

  const fieldControls = useMemo(
    () => ({
      id: field.state.id,
      value: field.state.value || null,
      name: field.configuration.name,
      onChange: (value: string | null) => field.methods.handleChange(value),
      onBlur: field.methods.handleBlur,
      error:
        field.state.validationError?.[0] ||
        dynamicComponentParamsLoadingError?.message,
      required: Boolean(field.configuration.validationRules?.required),
      disabled:
        isDisabled ||
        areDynamicComponentParamsLoading ||
        params.data?.length === 0,
      rightSection: areDynamicComponentParamsLoading ? (
        <Loader size="sm" />
      ) : undefined,
    }),
    [field, isDisabled, areDynamicComponentParamsLoading, params.data]
  )

  return <Select {...fieldControls} {...omit(params, 'wrapperParams')} />
}
