import { mapValues } from 'lodash'
import { InnerStoreApi } from '../types'
import { setNestedArrayFieldInternalsFromValues } from './set-nested-array-field-internals-from-values'
import { getInitialFields } from './get-initial-fields'
import { setCurrentStep } from './set-current-step'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'

export const triggerInitialDataLoading = async <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'triggerInitialDataLoading'],
  }

  const {
    configuration: { formId },
  } = innerStoreApi.getStoreState()

  const { fields, configuration, isLoadingInitialData } =
    innerStoreApi.getStoreState()

  if (isLoadingInitialData) {
    return
  }

  const getDefaultInitialData = () => {
    return {
      ...(typeof configuration.initialData === 'object'
        ? (configuration.initialData as TFormFields)
        : ({} as TFormFields)),
      ...(mapValues(fields, (field) => field.initialValue) as TFormFields),
    }
  }

  const defaultInitialData = getDefaultInitialData()

  if (typeof configuration.initialData === 'object') {
    innerStoreApi.setStoreState((formStore) => {
      formStore.initialData = defaultInitialData
      formStore.fields = getInitialFields(
        configuration,
        formId,
        defaultInitialData
      )
    })
    setNestedArrayFieldInternalsFromValues(innerStoreApi, defaultInitialData)

    if (configuration.startAtStep) {
      setCurrentStep(innerStoreApi, configuration.startAtStep())
    }
    return
  }

  const fetchAndSetInitialData = async () => {
    let initialData = {
      ...defaultInitialData,
    }

    if (typeof configuration.initialData === 'function') {
      try {
        innerStoreApi.setStoreState(
          (formStore) => {
            formStore.isLoadingInitialData = true
            formStore.initialDataLoadingError = null
          },
          false,
          getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'initiating'])
        )

        const initialDataResponse = await configuration.initialData()

        initialData = {
          ...initialData,
          ...initialDataResponse,
        }

        innerStoreApi.setStoreState(
          (formStore) => {
            formStore.isLoadingInitialData = false
          },
          false,
          getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'success'])
        )
      } catch (error) {
        innerStoreApi.setStoreState(
          (formStore) => {
            formStore.isLoadingInitialData = false
            formStore.initialDataLoadingError = error as Error
          },
          false,
          getReduxDevtoolsDebugLabel([...innerStoreApi.calledBy, 'error'])
        )
      }
    }

    innerStoreApi.setStoreState((formStore) => {
      formStore.initialData = initialData
      formStore.fields = getInitialFields(configuration, formId, initialData)
    })
    setNestedArrayFieldInternalsFromValues(innerStoreApi, initialData)

    if (configuration.startAtStep) {
      setCurrentStep(innerStoreApi, configuration.startAtStep())
    }
  }

  await fetchAndSetInitialData()
}
