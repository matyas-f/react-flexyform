'use client'

import React from 'react'
import {
  CreateStoreMultiStepConfiguration,
  Form,
  FormStore,
  typeSafeFieldComponent,
  typeSafeUiComponent,
  useCreateFormStore,
} from 'react-flexyform'
import { CodeExampleWrapper } from '../ui/code-example-wrapper'
import { wait } from '../../../utils/sleep'
import { format } from 'date-fns'

export type FormStoreFormFields = {
  service: string
  withGuide: boolean
  guide?: string
  bookingDate: Date
  bookingTime: string
  fullName: string
  email: string
  phone: string
  otherParticipants: { fullName: string; email: string; phone: string }[]
}

const getAvailableTimeslotsForDate = async (date: Date | null | undefined) => {
  if (!date) {
    return []
  }

  await wait(1500)

  if (new Date(date).getDate() % 2 === 1) {
    return [
      {
        value: '08:00',
        label: '08:00',
      },
      {
        value: '09:00',
        label: '09:00',
      },
      {
        value: '10:00',
        label: '10:00',
      },
    ]
  }

  return [
    {
      value: '10:00',
      label: '10:00',
    },
    {
      value: '11:00',
      label: '11:00',
    },
    {
      value: '12:00',
      label: '12:00',
    },
  ]
}

export const getBookingFormStoreBase = (
  getFormStore: () => FormStore<FormStoreFormFields>
): CreateStoreMultiStepConfiguration<FormStoreFormFields> => ({
  events: {
    onGoToNextStep: async () => {
      // In case of going to the previous step, not modifying anything and going to the next step, there will be no need to send a request with the unmodified values
      if (getFormStore().getIsStepDirty()) {
        // Send request to save the state on the server when going to the next step
        // Access field values with getFormStore().getAllFieldValues() or getFormStore().getStepFieldValues()
        await wait(1500)
      }
    },
  },
  steps: [
    {
      name: 'service',
      components: [
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'stepProgress',
            componentParams: {
              steps: [
                { label: 'Service' },
                { label: 'Date & time' },
                { label: 'Personal info' },
              ],
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'title',
            componentParams: {
              children: 'Service',
            },
          }),
        },
        {
          name: 'service',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'select',
            componentParams: {
              label: 'Choose a service for your booking',
              data: [
                {
                  value: 'mountainClimbing',
                  label: 'Mountain climbing',
                },
                {
                  value: 'kayaking',
                  label: 'Kayaking',
                },
              ],
            },
          }),
          validationRules: {
            required: {
              message: 'Required',
            },
          },
        },
        {
          name: 'withGuide',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'toggle',
            componentParams: {
              label: 'I want a guide',
            },
          }),
          defaultValue: false,
        },
        {
          name: 'guide',
          shouldShowOnlyIf: { withGuide: true },
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'select',
            componentParams: {
              label: 'Choose a guide (optional)',
              placeholder: 'Any guide is okay for me',
              clearable: true,
              data: [
                {
                  value: 'johnWood',
                  label: 'John Wood',
                },
                {
                  value: 'christopherRock',
                  label: 'Christopher Rock',
                },
                {
                  value: 'annaWater',
                  label: 'Anna Water',
                },
              ],
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'goToPreviousStepButton',
            componentParams: {
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'goToNextStepButton',
            componentParams: {
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
      ],
    },
    {
      name: 'bookingDetails',
      components: [
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'stepProgress',
            componentParams: {
              steps: [
                { label: 'Service' },
                { label: 'Date & time' },
                { label: 'Personal info' },
              ],
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'title',
            componentParams: {
              children: 'Date & time',
            },
          }),
        },
        {
          name: 'bookingDate',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'date',
            componentParams: {
              label: 'Choose a day for your booking',
            },
          }),
          validationRules: {
            required: {
              message: 'Required',
            },
          },
        },
        {
          name: 'bookingTime',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'select',
            componentParams: {
              value: async () => {
                const bookingDate = getFormStore().getFieldValue('bookingDate')

                return {
                  data: await getAvailableTimeslotsForDate(bookingDate),
                }
              },
              staticPart: {
                label: 'Choose a time for your booking',
                description:
                  'Depends on the date chosen, please choose a date first',
              },
              dependencies: () => [getFormStore().getFieldValue('bookingDate')],
            },
          }),
          reactToChanges: {
            functionToRun: () => {
              const bookingDateField = getFormStore().getField('bookingDate')

              if (
                bookingDateField?.value?.getTime?.() !==
                bookingDateField?.stepInitialValue?.getTime?.()
              ) {
                getFormStore().setFieldValue('bookingTime', '')
              }
            },
            dependencies: () => [getFormStore().getFieldValue('bookingDate')],
          },
          validationRules: {
            required: {
              message: 'Required',
            },
          },
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'goToPreviousStepButton',
            componentParams: {
              variant: 'outline',
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'goToNextStepButton',
            componentParams: {
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
      ],
    },
    {
      name: 'personalDetails',
      shouldGoToNextStepOnEnter: true,
      components: [
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'stepProgress',
            componentParams: {
              steps: [
                { label: 'Service' },
                { label: 'Date & time' },
                { label: 'Personal info' },
              ],
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'title',
            componentParams: {
              children: 'Personal info',
            },
          }),
        },
        {
          name: 'fullName',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'text',
            componentParams: {
              label: 'Full name',
            },
          }),
          validationRules: {
            required: {
              message: 'Required',
            },
          },
        },
        {
          name: 'email',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'text',
            componentParams: {
              label: 'Email',
            },
          }),
          validationRules: {
            required: {
              message: 'Required',
            },
            email: {
              message: 'Must be a valid email',
            },
          },
        },
        {
          name: 'phone',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'text',
            componentParams: {
              label: 'Phone',
              description: 'Include country code too',
            },
          }),
          validationRules: {
            required: {
              message: 'Required',
            },
            phoneNumber: {
              message: 'Must be a valid phone number',
            },
          },
        },
        {
          name: 'otherParticipants',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'nestedArray',
            componentParams: {
              label: 'Other participants (3 max)',
              emptyStateText: 'No other participants added yet',
            },
          }),
          validationRules: {
            maxLength: {
              message: 'Cannot add more than 3 participants',
              value: 3,
            },
          },
          nestedArrayComponents: [
            {
              name: 'fullName',
              ...typeSafeFieldComponent({
                formComponentMappingKey: 'text',
                componentParams: {
                  label: 'Full name',
                },
              }),
              validationRules: {
                required: {
                  message: 'Required',
                },
              },
            },
            {
              name: 'email',
              ...typeSafeFieldComponent({
                formComponentMappingKey: 'text',
                componentParams: {
                  label: 'Email',
                },
              }),
              validationRules: {
                required: {
                  message: 'Required',
                },
                email: {
                  message: 'Must be a valid email',
                },
              },
            },
            {
              name: 'phone',
              ...typeSafeFieldComponent({
                formComponentMappingKey: 'text',
                componentParams: {
                  label: 'Phone',
                  description: 'Include country code too',
                },
              }),
              validationRules: {
                required: {
                  message: 'Required',
                },
                phoneNumber: {
                  message: 'Must be a valid phone number',
                },
              },
            },
            {
              ...typeSafeUiComponent({
                formComponentMappingKey: 'removeNestedArrayItemButton',
                componentParams: {},
              }),
            },
          ],
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'goToPreviousStepButton',
            componentParams: {
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'goToNextStepButton',
            componentParams: {
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
      ],
    },
    {
      name: 'success',
      components: [
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'stepProgress',
            componentParams: {
              steps: [
                { label: 'Service' },
                { label: 'Date & time' },
                { label: 'Personal info' },
              ],
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'title',
            componentParams: {
              children: 'Successful booking',
              size: 'xl',
            },
          }),
        },
        {
          name: 'successMessage',
          ...typeSafeUiComponent({
            formComponentMappingKey: 'paragraph',
            componentParams: {
              value: () => {
                const fieldValues = getFormStore().getAllFieldValues()

                return {
                  children: `Your booking has been confirmed for ${format(fieldValues?.bookingDate, 'yyyy-MM-dd')} at ${fieldValues?.bookingTime}. We look forward to seeing you then!`,
                }
              },
              dependencies: () => [
                getFormStore().getFieldValue('bookingDate'),
                getFormStore().getFieldValue('bookingTime'),
              ],
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'button',
            componentParams: {
              onClick: () => {
                getFormStore().resetFormState()
              },
              children: 'New booking',
            },
          }),
        },
      ],
    },
  ],
})

const BookingFormExample = () => {
  const bookingFormStore = useCreateFormStore<FormStoreFormFields>(
    'bookingForm',
    getBookingFormStoreBase
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

export default BookingFormExample
