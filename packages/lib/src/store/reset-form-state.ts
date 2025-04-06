import { Fields, FormStoreConfiguration, InnerStoreApi, Step } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { getInitialComponentParams } from './get-initial-component-params'
import { triggerAllDynamicComponentParamsForStep } from './trigger-all-dynamic-component-params-for-step'
import { triggerInitialDataLoading } from './trigger-initial-data-loading'

export const resetFormState = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  {
    initialFields,
    initialStep,
    initialConfiguration,
  }: {
    initialFields: Fields<TFormFields>
    initialStep: Step<TFormFields>
    initialConfiguration: FormStoreConfiguration<TFormFields>
  }
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'resetFormState'],
  }

  const {
    configuration: { initialData, steps },
  } = innerStoreApi.getStoreState()

  innerStoreApi.setStoreState(
    (formStore) => {
      if (formStore.isLoadingInitialData) {
        return
      }

      formStore.configuration = initialConfiguration

      formStore.context =
        (typeof initialConfiguration.context?.value === 'function'
          ? initialConfiguration.context.value()
          : initialConfiguration.context) || {}

      formStore.fields = initialFields

      formStore.isLoadingInitialData = false
      formStore.initialDataLoadingError = null

      formStore.currentStepName = initialStep?.name || 'default-step'
      formStore.stepHistory = []
      formStore.eventHistory = []
      formStore.lastDirection = 'idle'
      formStore.didTriggerRevalidationModeForStep = false

      formStore.isValidatingStep = false
      formStore.stepValidationError = ''

      formStore.isSaving = false
      formStore.saveError = null

      formStore.isSubmitting = false
      formStore.submitError = null
      formStore.didSubmitSuccessfully = false

      formStore.isChangingStep = false
      formStore.stepChangeError = null

      formStore.componentParams = {
        ...formStore.componentParams,
        ...getInitialComponentParams(steps),
      }
    },
    false,
    getReduxDevtoolsDebugLabel(innerStoreApi.calledBy)
  )

  if (typeof initialData === 'function') {
    triggerInitialDataLoading(innerStoreApi)
  }

  triggerAllDynamicComponentParamsForStep(innerStoreApi)
}
