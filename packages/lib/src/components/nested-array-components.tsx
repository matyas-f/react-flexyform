'use client'

import { ReactNode, useMemo } from 'react'
import { useField } from '../hooks/use-field'
import { FormComponents } from './form-components'

type Props = {
  render: (params: {
    nestedArrayComponents: ReactNode
    index: number
    isLastIndex: boolean
  }) => ReactNode
}

export const NestedArrayComponents = (props: Props) => {
  const field = useField()

  const nestedArrayItemIndexes = useMemo(
    () =>
      field.state.value && Array.isArray(field.state.value)
        ? field.state.value.map((_, index) => index)
        : null,
    [field.state.value]
  )

  if (
    !field ||
    !field.configuration.nestedArrayComponents ||
    !nestedArrayItemIndexes
  ) {
    return null
  }

  return nestedArrayItemIndexes.map((index) =>
    props.render({
      nestedArrayComponents: (
        <FormComponents
          formComponents={field.configuration.nestedArrayComponents || []}
          parentFieldName={field.configuration.name}
          nestedIndex={index}
          key={index}
        />
      ),
      index,
      isLastIndex: index === nestedArrayItemIndexes.length - 1,
    })
  )
}
