import {
  useFormComponentParams,
  useField,
  NestedArrayComponents,
} from 'react-flexyform'
import {
  Button,
  Grid,
  InputLabel,
  MantineStyleProps,
  Text,
  TextProps,
} from '@mantine/core'
import { useTheme } from 'next-themes'

export type Params = TextProps & {
  label?: string
  emptyStateText?: string
  nestedComponentsGridGutter?: string
  nestedComponentsGridClassName?: string
  nestedComponentsGridStyleProps?: MantineStyleProps
}

export const FormIntegratedNestedArrayField = () => {
  const { resolvedTheme } = useTheme()
  const field = useField()
  const {
    label,
    emptyStateText,
    nestedComponentsGridClassName,
    nestedComponentsGridGutter = 'xl',
    nestedComponentsGridStyleProps = {},
  } = useFormComponentParams<Params>().value

  return (
    <>
      {label && (
        <InputLabel
          required={Boolean(field.configuration.validationRules?.required)}
          mb="md"
        >
          {label}
        </InputLabel>
      )}
      {emptyStateText && field.state.value.length === 0 && (
        <Text size="xs">{emptyStateText || 'No items are added'}</Text>
      )}
      {field.state.value.length > 0 && (
        <NestedArrayComponents
          render={({ nestedArrayComponents, isLastIndex }) => (
            <Grid
              columns={12}
              gutter={nestedComponentsGridGutter}
              style={{
                width: '100%',
                borderRadius: 6,
              }}
              p="lg"
              bd={
                resolvedTheme === 'dark'
                  ? '1px solid gray.7'
                  : '1px solid gray.4'
              }
              mb={!isLastIndex ? 'xl' : undefined}
              className={nestedComponentsGridClassName}
              {...nestedComponentsGridStyleProps}
            >
              {nestedArrayComponents}
            </Grid>
          )}
        />
      )}
      <Button
        onClick={() => field.methods.addItemToArray()}
        children="Add"
        mt="md"
        variant="outline"
      />
      {field.state.validationError?.[0] && (
        <Text c="red" mt="md" size="sm">
          {field.state.validationError[0]}
        </Text>
      )}
    </>
  )
}
