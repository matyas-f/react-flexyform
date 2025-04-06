'use client'

import { FormComponent } from './form-component'
import { ReactNode, useMemo } from 'react'
import {
  FormComponent as FormComponentType,
  FormFieldComponent,
  FormUiComponent,
  FormWrapperComponent,
} from '../types'

type FormComponentsPropsBase = {
  formComponents: (
    | FormFieldComponent
    | FormUiComponent
    | FormWrapperComponent
  )[]
}

type RootFormComponentsProps = FormComponentsPropsBase & {
  parentFieldName?: never
  nestedIndex?: never
}

type NestedFormComponentsProps = FormComponentsPropsBase & {
  parentFieldName: string
  nestedIndex: number
}

type Props = RootFormComponentsProps | NestedFormComponentsProps

export const FormComponents = ({
  formComponents: _formComponents,
  parentFieldName,
  nestedIndex,
}: Props) => {
  const formComponents: (FormComponentType & {
    isProcessed?: boolean
  })[] = useMemo(() => {
    return _formComponents.map((formComponent) => {
      let formComponentName = formComponent.name

      if (parentFieldName !== undefined && nestedIndex !== undefined) {
        formComponentName = `${parentFieldName}[${nestedIndex}].${formComponent.name}`
      }

      return {
        ...formComponent,
        name: formComponentName,
        isProcessed: false,
      }
    })
  }, [_formComponents])

  const components = useMemo(() => {
    const generateComponentTree = (
      result: ReactNode[] = [],
      i = 0,
      startWrapperName = ''
    ) => {
      let shouldContinue = true
      while (shouldContinue && i < formComponents.length) {
        const formComponent = formComponents[i]

        if (!formComponent || formComponent.isProcessed === true) {
          i++
          continue
        }

        formComponent.isProcessed = true

        if (formComponent.type !== 'wrapper') {
          result.push(
            <FormComponent
              formComponent={formComponent}
              key={`${formComponent.name}-${i}`}
            />
          )
        }

        if (
          formComponent.type === 'wrapper' &&
          formComponent.wrapping === 'start'
        ) {
          result.push(
            <FormComponent
              formComponent={formComponent}
              children={generateComponentTree([], i++, formComponent.name)}
              key={`${formComponent.name}-${i}`}
            />
          )
        }

        if (
          startWrapperName &&
          formComponent.type === 'wrapper' &&
          formComponent.wrapping === 'end' &&
          formComponent.name === startWrapperName
        ) {
          shouldContinue = false
        }
      }

      return result
    }

    return generateComponentTree()
  }, [formComponents])

  return components
}
