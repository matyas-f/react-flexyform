import { createContext, useContext } from 'react'
import { FormStoreInstance, FormStore } from '../types'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { StoreApi } from 'zustand'

export const FormContext = createContext<FormStoreInstance<any> | null>(null)

export const useParentFormStore = <_TSelectorReturn = any>(
  selector: Parameters<
    typeof useStoreWithEqualityFn<StoreApi<FormStore<any>>, _TSelectorReturn>
  >['1'],
  equalityFn?: Parameters<
    typeof useStoreWithEqualityFn<StoreApi<FormStore<any>>, _TSelectorReturn>
  >['2']
) => {
  const FormStoreInstance = useContext<FormStoreInstance<any> | null>(
    FormContext
  )

  if (!FormStoreInstance) {
    throw new Error('Missing Form Provider')
  }

  return useStoreWithEqualityFn<FormStoreInstance<any>, _TSelectorReturn>(
    FormStoreInstance,
    selector,
    equalityFn
  )
}
