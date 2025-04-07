import { useFormComponentParams } from 'react-flexyform'
import { Grid, GridCol, GridColProps, GridProps } from '@mantine/core'
import { ReactNode } from 'react'
import { useTheme } from 'next-themes'

export type Params = {
  wrapperParams?: GridColProps
  gridParams?: GridProps
}

export const FormIntegratedBorderedSection = (props: {
  children: ReactNode
}) => {
  const { resolvedTheme } = useTheme()

  const params = useFormComponentParams<Params>().value

  return (
    <GridCol
      span={12}
      bd={resolvedTheme === 'dark' ? '1px solid gray.7' : '1px solid gray.4'}
      p="lg"
      style={{
        borderRadius: 6,
      }}
      {...(params.wrapperParams || {})}
    >
      <Grid columns={12} gutter="xl" {...(params.gridParams || {})}>
        {props.children}
      </Grid>
    </GridCol>
  )
}
