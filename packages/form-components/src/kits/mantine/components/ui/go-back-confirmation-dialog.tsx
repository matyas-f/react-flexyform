import { useParentFormStore } from 'react-flexyform'
import { Button, Flex, Modal, Text } from '@mantine/core'

export const FormIntegratedGoBackConfirmationDialog = () => {
  const setContext = useParentFormStore((formStore) => formStore.setContext)
  const isGoingToPreviousStep = useParentFormStore(
    (formStore) => formStore.isGoingToPreviousStep
  )
  const triggerGoToPreviousStep = useParentFormStore(
    (formStore) => formStore.triggerGoToPreviousStep
  )

  const isConfirmGoBackModalOpen = useParentFormStore(
    (formStore) => formStore.context.isConfirmGoBackModalOpen
  )

  const handleClose = () => {
    setContext({ isConfirmGoBackModalOpen: false })
  }

  const handleConfirm = async () => {
    await triggerGoToPreviousStep()
    setContext({ isConfirmGoBackModalOpen: false })
  }

  return (
    <Modal
      opened={isConfirmGoBackModalOpen}
      onClose={handleClose}
      withCloseButton
      title="Confirmation required"
    >
      <Text size="sm">
        You will lose all the inputs you have made in this step. Are you sure
        you want to go back?
      </Text>
      <Flex w="100%" justify="flex-end" mt="lg">
        <Button
          variant="outline"
          onClick={handleClose}
          mr="md"
          disabled={isGoingToPreviousStep}
        >
          Close
        </Button>
        <Button onClick={handleConfirm} loading={isGoingToPreviousStep}>
          Go back
        </Button>
      </Flex>
    </Modal>
  )
}
