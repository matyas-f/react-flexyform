'use client'

import React from 'react'
import { Form, useCreateFormStore } from 'react-flexyform'
import { CodeExampleWrapper } from '../ui/code-example-wrapper'
import {
  FormStoreFormFields,
  getBookingFormStoreBase,
} from './booking-form-example'
import { wait } from '../../../utils/sleep'

const BookingFormSuccessExample = () => {
  const bookingFormStore = useCreateFormStore<FormStoreFormFields>(
    'bookingFormSuccess',
    (getFormStore) => ({
      ...getBookingFormStoreBase(getFormStore),
      initialData: async () => {
        await wait(1000)

        return {
          service: 'kayaking',
          withGuide: false,
          bookingDate: new Date(),
          bookingTime: '10:00',
          fullName: '',
          email: '',
          phone: '',
          otherParticipants: [],
        }
      },
      startAtStep: () => {
        const firstIncompleteStepName =
          getFormStore().getFirstStepNameWithRequiredFieldsNotCompleted()

        return firstIncompleteStepName || getFormStore().getLastStep().name
      },
    })
  )

  return (
    <CodeExampleWrapper
      handleReset={() => {
        bookingFormStore.getState().resetFormState()
      }}
    >
      <Form formStore={bookingFormStore} />
    </CodeExampleWrapper>
  )
}

export default BookingFormSuccessExample
