import { useFormComponentParams } from 'react-flexyform'
import { omit } from 'lodash'
import { Text, TextProps } from '@mantine/core'

export type Params = TextProps & { children: string }

export const FormIntegratedTitle = () => {
  const params = useFormComponentParams<Params>().value

  return <Text {...omit(params, 'wrapperParams')} size="xl" fw="bolder" />
}

export const FormIntegratedParagraph = () => {
  const params = useFormComponentParams<Params>().value

  return <Text {...omit(params, 'wrapperParams')} size="md" />
}

export const FormIntegratedProse = () => {
  const params = useFormComponentParams<Params>().value

  return <div className="prose">{params.children}</div>
}
