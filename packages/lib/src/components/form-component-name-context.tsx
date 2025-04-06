'use client'

import { createContext, ReactNode, useMemo } from 'react'
import {
  NestedArrayItemInfo,
  parseNestedArrayItemFieldName,
} from '../utils/parse-nested-array-item-field-name'

type Props = {
  children: ReactNode
  formComponentName: string
}

export const FormComponentNameContext = createContext<{
  formComponentName: string
  nestedArrayItemInfo: NestedArrayItemInfo
}>({
  nestedArrayItemInfo: {
    isNestedArrayItem: false,
    parentFieldName: null,
    nestedItemIndex: null,
    nestedItemComponentName: null,
  },
  formComponentName: '',
})

export const FormComponentNameProvider = ({
  children,
  formComponentName,
}: Props) => {
  const {
    isNestedArrayItem,
    nestedItemComponentName,
    nestedItemIndex,
    parentFieldName,
  } = parseNestedArrayItemFieldName(formComponentName)

  const nestedArrayItemInfo = useMemo(
    () =>
      ({
        isNestedArrayItem,
        parentFieldName,
        nestedItemIndex,
        nestedItemComponentName,
      }) as NestedArrayItemInfo,
    [
      isNestedArrayItem,
      nestedItemComponentName,
      nestedItemIndex,
      parentFieldName,
    ]
  )

  const contextValue = useMemo(
    () => ({
      nestedArrayItemInfo,
      formComponentName,
    }),
    [nestedArrayItemInfo, formComponentName]
  )

  return (
    <FormComponentNameContext.Provider value={contextValue}>
      {children}
    </FormComponentNameContext.Provider>
  )
}
