import { Box, Grid, MantineProvider, Modal, Pill } from '@mantine/core'
import { FormStore, useParentFormStore } from 'react-flexyform'
import { ReactNode, useMemo } from 'react'
import { MantineFormComponentsContext } from '../../mappings'
import { useTheme } from 'next-themes'

type Props = { children: ReactNode }

const AutoSaveStatus = () => {
  const isAutoSaving = useParentFormStore((formStore) => formStore.isAutoSaving)

  if (!isAutoSaving) {
    return null
  }

  return (
    <Box pos="absolute" top={20} right={20}>
      <Pill c="blue">Saving...</Pill>
    </Box>
  )
}

export const FormWrapper = (props: Props) => {
  const { resolvedTheme } = useTheme()

  const context = useParentFormStore(
    (formStore: FormStore<MantineFormComponentsContext>) => formStore.context
  )

  const formContent = useMemo(
    () => (
      <Grid
        columns={12}
        gutter={context.formGridGutter || 'xl'}
        mx="auto"
        maw="500px"
        pos="relative"
        {...(context.formGridStyleProps || {})}
      >
        <AutoSaveStatus />
        {props.children}
      </Grid>
    ),
    [context.formGridGutter, context.formGridStyleProps, props.children]
  )

  if (context.isFormInModal) {
    return (
      <MantineProvider forceColorScheme={resolvedTheme as 'light' | 'dark'}>
        <Modal opened onClose={() => context.onFormModalClose?.()}>
          {formContent}
        </Modal>
      </MantineProvider>
    )
  }

  return (
    <MantineProvider forceColorScheme={resolvedTheme as 'light' | 'dark'}>
      {formContent}
    </MantineProvider>
  )
}
