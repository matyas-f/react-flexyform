'use client'

import React from 'react'
import { Form, useCreateFormStore } from 'react-flexyform'
import { CodeExampleWrapper } from '../ui/code-example-wrapper'
import {
  FormStoreFormFields,
  getBookingFormStoreBase,
} from './booking-form-example'
import { wait } from '../../../utils/sleep'

let didRetry = false

const BookingFormErrorExample = () => {
  const bookingFormStore = useCreateFormStore<FormStoreFormFields>(
    'bookingFormError',
    (getFormStore) => ({
      ...getBookingFormStoreBase(getFormStore),
      initialData: async () => {
        await wait(1000)

        if (!didRetry) {
          didRetry = true
          throw new Error('Something unexpected happened, try again please')
        }

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
        const firstIncompleteStep =
          getFormStore().getFirstStepNameWithRequiredFieldsNotCompleted()

        return firstIncompleteStep || 'success'
      },
    })
  )

  return (
    <CodeExampleWrapper
      handleReset={() => {
        didRetry = false
        bookingFormStore.getState().resetFormState()
      }}
    >
      <Form formStore={bookingFormStore} />
    </CodeExampleWrapper>
  )
}

export default BookingFormErrorExample
