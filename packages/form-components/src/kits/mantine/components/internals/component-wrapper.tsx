import { useFormComponentParams } from 'react-flexyform'
import { Box, GridCol, MantineStyleProps, StyleProp } from '@mantine/core'
import { Children, ReactNode } from 'react'

export type Params = {
  wrapperParams?: {
    span?: StyleProp<number>
    offset?: StyleProp<number>
    styleProps?: MantineStyleProps
    className?: string
    isGridItem?: boolean
  }
}

const areChildrenEmpty = (children: ReactNode) => {
  let areChildrenEmpty = true

  Children.forEach(children, (child) => {
    // @ts-expect-error wrong type
    if (child?.type() !== null) {
      areChildrenEmpty = false
    }
  })

  return areChildrenEmpty
}

export const ComponentWrapper = (props: { children: ReactNode }) => {
  const {
    styleProps = {},
    className = '',
    isGridItem = true,
    span = 12,
    offset = 0,
  } = useFormComponentParams<Params>().value.wrapperParams || {}

  if (areChildrenEmpty(props.children)) {
    return null
  }

  if (!isGridItem) {
    return (
      <Box className={className} {...styleProps}>
        {props.children}
      </Box>
    )
  }

  return (
    <GridCol span={span} offset={offset} className={className} {...styleProps}>
      {props.children}
    </GridCol>
  )
}
