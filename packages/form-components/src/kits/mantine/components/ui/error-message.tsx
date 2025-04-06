import { useParentFormStore } from 'react-flexyform'
import { Alert, Flex, Loader } from '@mantine/core'
import { isEqual } from 'lodash'

export const FormIntegratedErrorMessage = () => {
  const stepValidationError = useParentFormStore(
    (formStore) => formStore.stepValidationError
  )
  const isValidatingStep = useParentFormStore(
    (formStore) => formStore.isValidatingStep
  )

  const submitError = useParentFormStore((formStore) => formStore.submitError)
  const isSubmitting = useParentFormStore((formStore) => formStore.isSubmitting)

  const stepChangeError = useParentFormStore(
    (formStore) => formStore.stepChangeError
  )
  const isChangingStep = useParentFormStore(
    (formStore) => formStore.isChangingStep
  )

  const autoSaveError = useParentFormStore(
    (formStore) => formStore.autoSaveError
  )

  const invalidFieldNames = useParentFormStore(
    (formStore) =>
      formStore
        .getInvalidFields()
        .map(
          (field) =>
            formStore.getComponentParams(field.name)?.label || field.name
        )
        .join(', '),
    isEqual
  )

  const isAnyFieldInvalid = useParentFormStore((formStore) =>
    formStore.getIsAnyFieldInvalid()
  )
  const isEveryFieldValid = !isAnyFieldInvalid

  if (
    isEveryFieldValid &&
    !stepValidationError &&
    !submitError &&
    !stepChangeError &&
    !autoSaveError
  ) {
    return null
  }

  return (
    <Flex direction="column" align="center" justify="center" gap="lg">
      {isAnyFieldInvalid && (
        <Alert color="red" title="Validation failed" w="100%">
          Some fields are invalid ({invalidFieldNames}), please fix them before
          proceeding.
        </Alert>
      )}
      {isEveryFieldValid && stepValidationError && (
        <Alert color="red" title="Validation failed" w="100%">
          {stepValidationError}
          {isValidatingStep && <Loader ml="sm" size="sm" />}
        </Alert>
      )}
      {isEveryFieldValid && submitError && (
        <Alert color="red" title="Submission failed" w="100%">
          {submitError.message}
          {isSubmitting && <Loader ml="sm" size="sm" />}
        </Alert>
      )}
      {isEveryFieldValid && stepChangeError && (
        <Alert color="red" title="Step change failed" w="100%">
          {stepChangeError.message}
          {isChangingStep && <Loader ml="sm" size="sm" />}
        </Alert>
      )}
      {autoSaveError && (
        <Alert color="red" title="Auto save failed" w="100%">
          {autoSaveError.message}
          {isChangingStep && <Loader ml="sm" size="sm" />}
        </Alert>
      )}
    </Flex>
  )
}
