import { useEffect, useLayoutEffect, useState } from 'react'
import {
  CreateFormStoreConfiguration,
  FormStore,
  FormStoreInstance,
} from '../types'
import { useFormComponentMappings } from '../components/form-component-mappings-provider'
import { useRunOnFirstRender } from './use-run-on-first-render'
import { createFormStore } from '../store'

export const useCreateFormStore = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  formStoreKey: string,
  configuration:
    | CreateFormStoreConfiguration<TFormFields>
    | ((
        getFormStore: () => FormStore<TFormFields>
      ) => CreateFormStoreConfiguration<TFormFields>),
  options?: {
    resetStoreOnMount?: boolean
  }
) => {
  const { resetStoreOnMount = true } = options || {}
  const { formStoresMap } = useFormComponentMappings()

  useRunOnFirstRender(() => {
    if (!resetStoreOnMount && formStoresMap[formStoreKey]) {
      return
    }

    formStoresMap[formStoreKey] =
      typeof configuration === 'function'
        ? createFormStore<TFormFields>((getFormStore) => ({
            formId: formStoreKey,
            ...configuration(getFormStore),
          }))
        : createFormStore<TFormFields>({
            formId: formStoreKey,
            ...configuration,
          })
  })

  useEffect(() => {
    return () => {
      if (!resetStoreOnMount) {
        formStoresMap[formStoreKey]?.destroy?.()
        formStoresMap[formStoreKey] = null
      }
    }
  }, [])

  return formStoresMap[formStoreKey] as FormStoreInstance<TFormFields>
}

export const useCreateFormStoreAsync = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  formStoreKey: string,
  creatorFn: () => Promise<FormStoreInstance<TFormFields>>,
  options?: {
    resetStoreOnMount?: boolean
  }
) => {
  const { resetStoreOnMount = true } = options || {}

  const [isLoading, setIsLoading] = useState(false)
  const [loadingError, setLoadingError] = useState<Error | null>(null)
  const { formStoresMap } = useFormComponentMappings()

  useLayoutEffect(() => {
    if (resetStoreOnMount && !formStoresMap[formStoreKey]) {
      ;(async () => {
        try {
          setIsLoading(true)

          formStoresMap[formStoreKey] = await creatorFn()

          setIsLoading(false)
          setLoadingError(null)
        } catch (error) {
          setLoadingError(error as Error)
          setIsLoading(false)
        }
      })()
    }

    if (resetStoreOnMount && formStoresMap[formStoreKey]) {
      formStoresMap[formStoreKey].getState().resetFormState()
    }

    return () => {
      if (!resetStoreOnMount) {
        formStoresMap[formStoreKey]?.destroy?.()
        formStoresMap[formStoreKey] = null
      }
    }
  }, [])

  return {
    isLoading,
    loadingError,
    formStore: formStoresMap[
      formStoreKey
    ] as FormStoreInstance<TFormFields> | null,
  }
}
