'use client'

import { ReactNode } from 'react'
import { FormStoreInstance } from '../types'
import { FormContext } from '../hooks/use-parent-form-store'

type Props<TFormFields extends Record<string, any> = Record<string, any>> = {
  children: ReactNode
  formStore: FormStoreInstance<TFormFields>
}

export function FormProvider<
  TFormFields extends Record<string, any> = Record<string, any>,
>({ children, formStore }: Props<TFormFields>) {
  return (
    <FormContext.Provider value={formStore}>{children}</FormContext.Provider>
  )
}
