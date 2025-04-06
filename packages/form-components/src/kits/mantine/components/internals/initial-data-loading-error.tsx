import { useParentFormStore } from 'react-flexyform'
import { Button, Flex, GridCol, Text } from '@mantine/core'

export const InitialDataLoadingError = () => {
  const retryInitialDataLoading = useParentFormStore(
    (formStore) => formStore.triggerInitialDataLoading
  )
  const initialDataLoadingError = useParentFormStore(
    (formStore) => formStore.initialDataLoadingError
  )

  return (
    <GridCol span={12}>
      <Flex direction="column" align="center">
        <Text size="lg" mb="lg" style={{ textAlign: 'center' }}>
          {initialDataLoadingError?.message}
        </Text>
        <Button onClick={retryInitialDataLoading}>Retry</Button>
      </Flex>
    </GridCol>
  )
}
