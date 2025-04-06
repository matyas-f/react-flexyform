import { useFormComponentParams } from 'react-flexyform'
import { Grid, GridCol, GridColProps, GridProps } from '@mantine/core'
import { ReactNode } from 'react'
import { useColorScheme } from '@mantine/hooks'

export type Params = {
  wrapperParams?: GridColProps
  gridParams?: GridProps
}

export const FormIntegratedBorderedSection = (props: {
  children: ReactNode
}) => {
  const colorScheme = useColorScheme()

  const params = useFormComponentParams<Params>().value

  return (
    <GridCol
      span={12}
      bd={colorScheme === 'dark' ? '1px solid gray.7' : '1px solid gray.4'}
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
