import {
  useFormComponentParams,
  useNestedArrayItemInfo,
  useParentField,
  useParentFormStore,
} from 'react-flexyform'
import { omit } from 'lodash'
import { Button, ButtonProps } from '@mantine/core'
import { ComponentPropsWithoutRef } from 'react'
import { FormIntegratedGoBackConfirmationDialog } from './go-back-confirmation-dialog'

export type Params = ComponentPropsWithoutRef<'button'> & ButtonProps

export const FormIntegratedButton = () => {
  const params = useFormComponentParams<Params>().value

  return <Button {...omit(params, 'wrapperParams')} />
}

export const FormIntegratedSubmitButton = () => {
  const params = useFormComponentParams<Params>().value

  const triggerSubmit = useParentFormStore(
    (formStore) => formStore.triggerSubmit
  )
  const isSubmitting = useParentFormStore((formStore) => formStore.isSubmitting)
  const isChangingStep = useParentFormStore(
    (formStore) => formStore.isChangingStep
  )

  const onClick = () => {
    triggerSubmit()
  }

  return (
    <Button
      children="Submit"
      w="100%"
      {...omit(params, 'wrapperParams')}
      onClick={onClick}
      disabled={isChangingStep}
      loading={isSubmitting}
    />
  )
}

export const FormIntegratedGoToNextStepButton = () => {
  const triggerGoToNextStep = useParentFormStore(
    (formStore) => formStore.triggerGoToNextStep
  )
  const isChangingStep = useParentFormStore(
    (formStore) => formStore.isChangingStep
  )
  const isGoingToNextStep = useParentFormStore(
    (formStore) => formStore.isGoingToNextStep
  )
  const params = useFormComponentParams<Params>().value

  const onClick = () => {
    triggerGoToNextStep()
  }

  return (
    <Button
      children="Next"
      w="100%"
      {...omit(params, 'wrapperParams')}
      onClick={onClick}
      disabled={isChangingStep}
      loading={isGoingToNextStep}
    />
  )
}

export const FormIntegratedGoToPreviousStepButton = () => {
  const triggerGoToPreviousStep = useParentFormStore(
    (formStore) => formStore.triggerGoToPreviousStep
  )
  const isChangingStep = useParentFormStore(
    (formStore) => formStore.isChangingStep
  )
  const isGoingToPreviousStep = useParentFormStore(
    (formStore) => formStore.isGoingToPreviousStep
  )
  const isFirstStep = useParentFormStore((formStore) =>
    formStore.getIsFirstStep()
  )
  const isStepDirty = useParentFormStore((formStore) =>
    formStore.getIsStepDirty()
  )
  const setContext = useParentFormStore((formStore) => formStore.setContext)

  const params = useFormComponentParams<Params>().value

  const onClick = () => {
    if (isStepDirty) {
      setContext({ isConfirmGoBackModalOpen: true })
    } else {
      triggerGoToPreviousStep()
    }
  }

  return (
    <>
      <FormIntegratedGoBackConfirmationDialog />
      <Button
        children="Back"
        w="100%"
        {...omit(params, 'wrapperParams')}
        variant="outline"
        disabled={isFirstStep || isChangingStep}
        onClick={onClick}
        loading={isGoingToPreviousStep}
      />
    </>
  )
}

export const FormIntegratedSaveButton = () => {
  const triggerSave = useParentFormStore((formStore) => formStore.triggerSave)
  const isChangingStep = useParentFormStore(
    (formStore) => formStore.isChangingStep
  )
  const isStepDirty = useParentFormStore((formStore) =>
    formStore.getIsStepDirty()
  )
  const isSaving = useParentFormStore((formStore) => formStore.isSaving)
  const params = useFormComponentParams<Params>().value

  const onClick = () => {
    triggerSave()
  }

  return (
    <Button
      children="Save"
      w="100%"
      {...omit(params, 'wrapperParams')}
      onClick={onClick}
      disabled={isChangingStep || !isStepDirty}
      loading={isSaving}
    />
  )
}

export const FormIntegratedRemoveNestedArrayItemButton = () => {
  const parentField = useParentField()
  const componentParams = useFormComponentParams<ButtonProps>().value
  const { nestedItemIndex, isNestedArrayItem } = useNestedArrayItemInfo()

  if (!parentField || !isNestedArrayItem) {
    return null
  }

  return (
    <Button
      children="Remove"
      w="100%"
      onClick={() => parentField.methods.removeItemFromArray(nestedItemIndex)}
      {...componentParams}
    />
  )
}
