'use client'

import React, { ReactNode, createContext, useContext, useMemo } from 'react'
import { FormStoreInstance } from '../types'

const DefaultFormWrapper = (props: { children: ReactNode }) => props.children

const DefaultComponentWrapper = (props: { children: ReactNode }) =>
  props.children

const ProvideInitialDataLoadingErrorComponentMessage = () => (
  <p style={{ textAlign: 'center', fontSize: 18 }}>
    Please provide an <b>initialDataLoadingError</b> component in the mappings
  </p>
)

const ProvideInitialDataLoadingIndicatorComponentMessage = () => (
  <p style={{ textAlign: 'center', fontSize: 18 }}>
    Please provide an <b>initialDataLoadingIndicator</b> component in the
    mappings
  </p>
)

type FormInternalComponentMappings = {
  formWrapper: React.FC<{ [key: string]: any; children: ReactNode }>
  componentWrapper: React.FC<{ [key: string]: any; children: ReactNode }>
  initialDataLoadingIndicator: React.FC<any>
  initialDataLoadingError: React.FC<any>
}

type Props = {
  children: ReactNode
  fieldComponentMappings: {
    [key in keyof FormFieldComponentMappings]: React.FC<any>
  }
  uiComponentMappings: {
    [key in keyof FormUiComponentMappings]: React.FC<any>
  }
  wrapperComponentMappings: {
    [key in keyof FormWrapperComponentMappings]: React.FC<any>
  }
  internalComponentMappings?: Partial<FormInternalComponentMappings>
}

type ContextValue = {
  fieldComponentMappings: {
    [key in keyof FormFieldComponentMappings]: React.FC<any>
  }
  uiComponentMappings: {
    [key in keyof FormUiComponentMappings]: React.FC<any>
  }
  wrapperComponentMappings: {
    [key in keyof FormWrapperComponentMappings]: React.FC<any>
  }
  internalComponentMappings: FormInternalComponentMappings
  formStoresMap: {
    [key: string]: FormStoreInstance<any> | null
  }
}

const ComponentMappingsContext = createContext<ContextValue | null>({
  fieldComponentMappings: {},
  uiComponentMappings: {},
  internalComponentMappings: {
    formWrapper: DefaultFormWrapper,
    componentWrapper: DefaultComponentWrapper,
    initialDataLoadingError: ProvideInitialDataLoadingErrorComponentMessage,
    initialDataLoadingIndicator:
      ProvideInitialDataLoadingIndicatorComponentMessage,
  },
  wrapperComponentMappings: {},
  formStoresMap: {},
})
export const useFormComponentMappings = () =>
  useContext(ComponentMappingsContext) as ContextValue

export const FormComponentMappingsProvider = ({
  children,
  fieldComponentMappings,
  uiComponentMappings,
  wrapperComponentMappings,
  internalComponentMappings: _internalComponentMappings,
}: Props) => {
  const formStoresRef = React.useRef<{
    [key: string]: FormStoreInstance<any> | null
  }>({})

  const internalComponentMappings = useMemo(() => {
    return {
      formWrapper: DefaultFormWrapper,
      componentWrapper: DefaultComponentWrapper,
      initialDataLoadingError: ProvideInitialDataLoadingErrorComponentMessage,
      initialDataLoadingIndicator:
        ProvideInitialDataLoadingIndicatorComponentMessage,
      ...(_internalComponentMappings || {}),
    }
  }, [_internalComponentMappings])

  return (
    <ComponentMappingsContext.Provider
      value={{
        fieldComponentMappings,
        uiComponentMappings,
        internalComponentMappings,
        wrapperComponentMappings,
        formStoresMap: formStoresRef.current,
      }}
    >
      {children}
    </ComponentMappingsContext.Provider>
  )
}
