import React, { ReactNode } from 'react'
import { Repeat } from 'lucide-react'
import { FormComponentMappingsProvider } from 'react-flexyform'
import {
  MantineFormComponentsContext,
  MantineKitFieldComponentMappingsInterface,
  MantineKitMappings,
  MantineKitUiComponentMappingsInterface,
  MantineKitWrapperComponentMappingsInterface,
  MantineComponentWrapperParams,
} from '@react-flexyform/form-components'

declare global {
  interface FormFieldComponentMappings
    extends MantineKitFieldComponentMappingsInterface {}

  interface FormUiComponentMappings
    extends MantineKitUiComponentMappingsInterface {}

  interface FormWrapperComponentMappings
    extends MantineKitWrapperComponentMappingsInterface {}

  interface FormContext extends MantineFormComponentsContext {}

  interface ComponentWrapperParams extends MantineComponentWrapperParams {}
}

type Props = {
  children: ReactNode
  handleReset?: () => void
}

export const CodeExampleWrapper = ({ children, handleReset }: Props) => {
  return (
    <FormComponentMappingsProvider {...MantineKitMappings}>
      <div className="relative flex flex-col w-full p-6 my-6 border rounded-lg group bg-fd-secondary/50 not-prose">
        {handleReset && (
          <button
            type="button"
            className="absolute inline-flex items-center justify-center p-2 text-sm font-medium transition-all duration-100 rounded-md opacity-0 disabled:pointer-events-none disabled:opacity-50 hover:bg-fd-accent hover:text-fd-accent-foreground group-hover:opacity-100 right-2 top-2 z-2 backdrop-blur-xs"
            onClick={handleReset}
          >
            <Repeat size={16} />
          </button>
        )}
        {children}
      </div>
    </FormComponentMappingsProvider>
  )
}
