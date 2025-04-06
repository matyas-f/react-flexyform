'use client'

import { useFormComponentMappings } from './form-component-mappings-provider'
import { useParentFormStore } from '../hooks/use-parent-form-store'
import { useMediaQuery } from '../hooks/use-media-query'
import { FormComponent as FormComponentType } from '../types'
import { FormComponentNameProvider } from './form-component-name-context'
import { ReactNode, useEffect, useLayoutEffect, useMemo } from 'react'
import { useIsFirstRender } from '../hooks/use-is-first-render'
import { _getShouldTriggerValidations } from '../store/get-should-trigger-validation'
import { isEqual } from 'lodash'
import { parseNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'
import { useRunOnFirstRender } from '../hooks/use-run-on-first-render'

const useIsShowing = (formComponent: FormComponentType) => {
  const matchesMediaQuery = useMediaQuery(
    formComponent.shouldShowOnlyIfMediaQueryMatches ||
      formComponent.shouldShowOnlyOnScreenSize ||
      null
  )

  const showOnlyIfDependencies = useParentFormStore((formStore) => {
    if (!formComponent.shouldShowOnlyIf) {
      return []
    }

    return typeof formComponent.shouldShowOnlyIf === 'object' &&
      typeof formComponent.shouldShowOnlyIf.value !== 'function'
      ? Object.keys(formComponent.shouldShowOnlyIf).map((fieldName) =>
          formStore.getFieldValue(fieldName)
        )
      : formComponent.shouldShowOnlyIf?.dependencies?.() || []
  })

  const getIsFormComponentShowing = useParentFormStore(
    (formStore) => formStore.getIsFormComponentShowing
  )

  const isShowing = useMemo(
    () =>
      getIsFormComponentShowing(formComponent.name, {
        shouldConsiderScreenSize: false,
      }),
    [getIsFormComponentShowing, ...showOnlyIfDependencies]
  )

  const resetField = useParentFormStore((formStore) => formStore.resetField)

  useEffect(() => {
    if (
      formComponent.type === 'field' &&
      !isShowing &&
      !formComponent.shouldKeepValueEvenIfHidden
    ) {
      resetField(formComponent.name)
    }
  }, [isShowing])

  return { matchesMediaQuery, isShowing }
}

const useReactToChanges = (
  formComponent: FormComponentType,
  options: { isDisabled: boolean }
) => {
  const { nestedItemIndex } = useMemo(
    () => parseNestedArrayItemFieldName(formComponent.name),
    [formComponent.name]
  )

  const isFirstRender = useIsFirstRender()

  const reactToChangesDependencies = useParentFormStore(() => {
    if (typeof formComponent.reactToChanges?.dependencies !== 'function') {
      return []
    }

    return formComponent.reactToChanges?.dependencies?.() || []
  }, isEqual)

  useLayoutEffect(() => {
    if (
      !isFirstRender &&
      !options.isDisabled &&
      formComponent.reactToChanges?.functionToRun &&
      reactToChangesDependencies.length
    ) {
      formComponent.reactToChanges.functionToRun(nestedItemIndex)
    }
  }, [
    options.isDisabled,
    isFirstRender,
    nestedItemIndex,
    ...reactToChangesDependencies,
  ])
}

const useSyncComponentParams = (
  formComponent: FormComponentType,
  options: { isDisabled: boolean }
) => {
  const isFirstRender = useIsFirstRender()

  const triggerDynamicComponentParams = useParentFormStore(
    (formStore) => formStore.triggerDynamicComponentParams
  )

  useRunOnFirstRender(() => {
    triggerDynamicComponentParams(formComponent.name)
  })

  const componentParamsDependencies = useParentFormStore(() => {
    if (typeof formComponent.componentParams?.dependencies !== 'function') {
      return []
    }

    return formComponent.componentParams?.dependencies?.() || []
  }, isEqual)

  useLayoutEffect(() => {
    if (
      formComponent.componentParams?.value &&
      !options.isDisabled &&
      !isFirstRender &&
      componentParamsDependencies.length
    ) {
      triggerDynamicComponentParams(formComponent.name)
    }
  }, [options.isDisabled, isFirstRender, ...componentParamsDependencies])
}

const useTriggerValidationsBasedOnOtherFields = (
  formComponent: FormComponentType,
  options: { isDisabled: boolean }
) => {
  const isFirstRender = useIsFirstRender()

  const triggerFieldValidation = useParentFormStore(
    (formStore) => formStore.triggerFieldValidation
  )

  const currentStepName = useParentFormStore(
    (formStore) => formStore.currentStepName
  )
  const didTriggerRevalidationModeForStep = useParentFormStore(
    (formStore) => formStore.didTriggerRevalidationModeForStep
  )
  const getCurrentStep = useParentFormStore(
    (formStore) => formStore.getCurrentStep
  )

  const validationDependencies = useParentFormStore(() => {
    if (formComponent.type !== 'field') {
      return []
    }

    if (typeof formComponent.validationRules?.dependencies !== 'function') {
      return []
    }

    return formComponent.validationRules?.dependencies?.() || []
  }, isEqual)

  const didTriggerRevalidationModeForField = useParentFormStore(
    (formStore) =>
      formStore.fields[formComponent.name]?.didTriggerRevalidationMode
  )

  useLayoutEffect(() => {
    if (
      options.isDisabled ||
      isFirstRender ||
      formComponent.type !== 'field' ||
      !formComponent.validationRules ||
      !validationDependencies.length
    ) {
      return
    }

    const shouldTriggerValidations = _getShouldTriggerValidations({
      didTriggerRevalidationModeForStep,
      validationOptions: getCurrentStep().validationOptions,
      validationTrigger: 'fieldValueChange',
      fieldName: formComponent.name,
      isStepValidation: false,
      didTriggerRevalidationModeForField,
    })

    if (shouldTriggerValidations) {
      triggerFieldValidation(formComponent.name)
    }
  }, [
    currentStepName,
    didTriggerRevalidationModeForStep,
    options.isDisabled,
    isFirstRender,
    didTriggerRevalidationModeForField,
    ...validationDependencies,
  ])
}

type Props = {
  formComponent: FormComponentType
  children?: ReactNode
}

export const FormComponent = ({ formComponent, children }: Props) => {
  const {
    uiComponentMappings,
    fieldComponentMappings,
    wrapperComponentMappings,
    internalComponentMappings,
  } = useFormComponentMappings()

  const ComponentWrapper = useMemo(
    () => internalComponentMappings.componentWrapper,
    [internalComponentMappings]
  )

  const { matchesMediaQuery, isShowing } = useIsShowing(formComponent)

  useSyncComponentParams(formComponent, {
    isDisabled: !matchesMediaQuery || !isShowing,
  })

  useTriggerValidationsBasedOnOtherFields(formComponent, {
    isDisabled: !matchesMediaQuery || !isShowing,
  })

  useReactToChanges(formComponent, {
    isDisabled: !matchesMediaQuery || !isShowing,
  })

  if (!matchesMediaQuery || !isShowing) {
    return null
  }

  let formComponentMappings: Record<string, any> = {}

  if (formComponent.type === 'field') {
    formComponentMappings = fieldComponentMappings
  }

  if (formComponent.type === 'ui') {
    formComponentMappings = uiComponentMappings
  }

  if (formComponent.type === 'wrapper') {
    formComponentMappings = wrapperComponentMappings
  }

  const Component = formComponentMappings[
    formComponent.formComponentMappingKey
  ] as React.FC<{ [key: string]: any }> | null

  if (!Component) {
    throw new Error(
      `Missing mapping key ${formComponent.formComponentMappingKey} from FormComponentMappingsProvider`
    )
  }

  if (formComponent.type === 'wrapper') {
    return (
      <FormComponentNameProvider formComponentName={formComponent.name}>
        <Component children={children} />
      </FormComponentNameProvider>
    )
  }

  return (
    <FormComponentNameProvider formComponentName={formComponent.name}>
      <ComponentWrapper>
        <Component />
      </ComponentWrapper>
    </FormComponentNameProvider>
  )
}
