import { Center, GridCol, Loader } from '@mantine/core'

export const InitialDataLoadingIndicator = () => {
  return (
    <GridCol span={12}>
      <Center>
        <Loader size={30} />
      </Center>
    </GridCol>
  )
}
