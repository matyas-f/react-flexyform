'use client'

import { useLayoutEffect, useMemo } from 'react'
import { useFormComponentMappings } from './form-component-mappings-provider'
import { FormStep } from './form-step'
import { useParentFormStore } from '../hooks/use-parent-form-store'
import { useRunOnFirstRender } from '../hooks/use-run-on-first-render'
import { FormStoreInstance } from '../types'
import { FormProvider } from './form-provider'
import { useIsFirstRender } from '../hooks/use-is-first-render'
import { isEqual } from 'lodash'

type FormProps<TFormFields extends Record<string, any> = Record<string, any>> =
  {
    formStore: FormStoreInstance<TFormFields>
    isInitialDataLoading?: boolean
    initialDataLoadingError?: Error | null
  }

type FormWitStoreProps = Pick<
  FormProps,
  'isInitialDataLoading' | 'initialDataLoadingError'
>

const useInitialDataLoading = () => {
  const triggerInitialDataLoading = useParentFormStore(
    (formStore) => formStore.triggerInitialDataLoading
  )
  const initialData = useParentFormStore((formStore) => formStore.initialData)

  useRunOnFirstRender(() => {
    if (!initialData) {
      triggerInitialDataLoading()
    }
  })
}

const useSetInitialDynamicParams = () => {
  const currentStepName = useParentFormStore(
    (formStore) => formStore.currentStepName
  )
  const triggerAllDynamicComponentParamsForStep = useParentFormStore(
    (formStore) => formStore.triggerAllDynamicComponentParamsForStep
  )

  useLayoutEffect(() => {
    triggerAllDynamicComponentParamsForStep()
  }, [currentStepName])
}

const useSyncContext = () => {
  const isFirstRender = useIsFirstRender()

  const getDynamicContext = useParentFormStore((formStore) =>
    typeof formStore.configuration.context?.value === 'function'
      ? formStore.configuration.context.value
      : null
  )

  const setContext = useParentFormStore((formStore) => formStore.setContext)

  const dynamicContextDependencies = useParentFormStore(
    (formStore) =>
      typeof formStore.configuration.context?.dependencies === 'function'
        ? formStore.configuration.context.dependencies() || []
        : [],
    isEqual
  )

  useLayoutEffect(() => {
    if (!isFirstRender && getDynamicContext) {
      setContext(getDynamicContext())
    }
  }, [isFirstRender, ...dynamicContextDependencies])
}

const useSyncPropsWithStore = (props: FormWitStoreProps) => {
  const setIsInitialDataLoading = useParentFormStore(
    (formStore) => formStore.setIsLoadingInitialData
  )
  const setInitialDataLoadingError = useParentFormStore(
    (formStore) => formStore.setInitialDataLoadingError
  )

  useLayoutEffect(() => {
    if (props.isInitialDataLoading !== undefined) {
      setIsInitialDataLoading(props.isInitialDataLoading)
    }
  }, [props.isInitialDataLoading])

  useLayoutEffect(() => {
    if (props.initialDataLoadingError !== undefined) {
      setInitialDataLoadingError(props.initialDataLoadingError)
    }
  }, [props.initialDataLoadingError])
}

const FormWithStore = (props: FormWitStoreProps) => {
  useInitialDataLoading()

  useSetInitialDynamicParams()

  useSyncContext()

  useSyncPropsWithStore(props)

  const componentMappings = useFormComponentMappings()

  const currentStepName = useParentFormStore(
    (formStore) => formStore.currentStepName
  )

  const FormWrapper = useMemo(
    () => componentMappings?.internalComponentMappings.formWrapper,
    [componentMappings.internalComponentMappings]
  )
  const InitialLoading = useMemo(
    () =>
      componentMappings?.internalComponentMappings.initialDataLoadingIndicator,
    [componentMappings.internalComponentMappings]
  )
  const InitialLoadingError = useMemo(
    () => componentMappings?.internalComponentMappings.initialDataLoadingError,
    [componentMappings.internalComponentMappings]
  )

  const initialDataLoadingStatus = useParentFormStore((formStore) =>
    formStore.getInitialDataLoadingStatus()
  )

  if (!componentMappings) {
    throw new Error('Missing FormComponentMappingsProvider')
  }

  if (initialDataLoadingStatus === 'loading') {
    return (
      <FormWrapper>
        <InitialLoading />
      </FormWrapper>
    )
  }

  if (initialDataLoadingStatus === 'error') {
    return (
      <FormWrapper>
        <InitialLoadingError />
      </FormWrapper>
    )
  }

  return (
    <FormWrapper>
      <FormStep key={currentStepName} />
    </FormWrapper>
  )
}

export function Form<
  TFormFields extends Record<string, any> = Record<string, any>,
>({
  formStore,
  initialDataLoadingError,
  isInitialDataLoading,
}: FormProps<TFormFields>) {
  return (
    <FormProvider formStore={formStore}>
      <FormWithStore
        initialDataLoadingError={initialDataLoadingError}
        isInitialDataLoading={isInitialDataLoading}
      />
    </FormProvider>
  )
}
