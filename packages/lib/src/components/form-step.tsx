'use client'

import { useParentFormStore } from '../hooks/use-parent-form-store'
import { useEffect, useLayoutEffect } from 'react'
import { FormComponents } from './form-components'

const useSetupAutoSaveInterval = () => {
  const triggerAutoSave = useParentFormStore(
    (formStore) => formStore.triggerAutoSave
  )

  const currentStepAutoSaveIntervalInMs = useParentFormStore(
    (formStore) =>
      formStore.getCurrentStep().autoSaveOptions.autoSaveIntervalInMs
  )

  useEffect(() => {
    if (typeof currentStepAutoSaveIntervalInMs === 'number') {
      const interval = setInterval(() => {
        triggerAutoSave()
      }, currentStepAutoSaveIntervalInMs)

      return () => {
        clearInterval(interval)
      }
    }
  }, [])
}

const useTriggerEventOnEnter = () => {
  const shouldGoToNextStepOnEnter = useParentFormStore(
    (formStore) => formStore.getCurrentStep().shouldGoToNextStepOnEnter
  )
  const shouldSubmitOnEnter = useParentFormStore(
    (formStore) => formStore.getCurrentStep().shouldSubmitOnEnter
  )
  const shouldSaveOnEnter = useParentFormStore(
    (formStore) => formStore.getCurrentStep().shouldSaveOnEnter
  )
  const getIsStepDirty = useParentFormStore(
    (formStore) => formStore.getIsStepDirty
  )
  const getIsAnyFieldFocused = useParentFormStore(
    (formStore) => formStore.getIsAnyFieldFocused
  )
  const triggerSubmit = useParentFormStore(
    (formStore) => formStore.triggerSubmit
  )
  const triggerSave = useParentFormStore((formStore) => formStore.triggerSave)
  const triggerGoToNextStep = useParentFormStore(
    (formStore) => formStore.triggerGoToNextStep
  )

  useLayoutEffect(() => {
    if (shouldSubmitOnEnter || shouldGoToNextStepOnEnter || shouldSaveOnEnter) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key !== 'Enter' ||
          !getIsAnyFieldFocused() ||
          document.activeElement?.tagName.toLowerCase() !== 'input' ||
          !['text', 'number', 'password', 'email'].includes(
            (document.activeElement as HTMLInputElement)?.type
          )
        ) {
          return
        }

        if (shouldSubmitOnEnter) {
          triggerSubmit()
          return
        }

        if (shouldGoToNextStepOnEnter) {
          triggerGoToNextStep()
          return
        }

        if (shouldSaveOnEnter && getIsStepDirty()) {
          triggerSave()
          return
        }
      }

      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [
    shouldGoToNextStepOnEnter,
    shouldSubmitOnEnter,
    getIsAnyFieldFocused,
    triggerSubmit,
    triggerGoToNextStep,
    getIsStepDirty,
  ])
}

export const FormStep = () => {
  useSetupAutoSaveInterval()

  useTriggerEventOnEnter()

  const currentStepFormComponents = useParentFormStore(
    (formStore) => formStore.getCurrentStep().components
  )

  const currentStepOnMount = useParentFormStore(
    (formStore) => formStore.getCurrentStep().onMount
  )

  const currentStepOnUnmount = useParentFormStore(
    (formStore) => formStore.getCurrentStep().onUnmount
  )

  useLayoutEffect(() => {
    currentStepOnMount?.()

    return () => {
      currentStepOnUnmount?.()
    }
  }, [])

  return <FormComponents formComponents={currentStepFormComponents} />
}
