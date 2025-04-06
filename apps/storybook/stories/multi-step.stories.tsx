import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  Form,
  FormComponentMappingsProvider,
  typeSafeUiComponent,
  typeSafeFieldComponent,
  CreateStoreMultiStepConfiguration,
  FormStore,
  useCreateFormStore,
} from 'react-flexyform'
import { TermsAndConditionsBrief } from './components/terms-and-conditions-brief'
import { MantineKitMappings } from '@react-flexyform/form-components'

const meta: Meta<typeof Form> = {
  component: Form,
  title: 'Multi Step',
}

export default meta
type Story = StoryObj<typeof Form>

const sleep = (ms: number) =>
  new Promise<boolean>((resolve) => setTimeout(() => resolve(true), ms))

type FormStoreFormFields = {
  privacyPolicyConsent: boolean
  marketingConsent: boolean
  firstName: string
  lastName: string
  gender: string
  genderOther: string
  friends: { firstName: string; lastName: string }[]
  bookingDate: Date | null
  bookingTime: string
  favoriteSport: string
  country: string
  city: string
  address: string
  zipCode: string
  bankName: string
  iban: string
}

const getTimes = async (day: Date | null | undefined) => {
  if (!day) {
    return []
  }

  await sleep(1500)

  if (new Date(day).getDate() === 1) {
    return [
      {
        value: '10:30',
        label: '10:30',
      },
    ]
  } else {
    return [
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
}

const createMultiStepFormBaseConfig = (
  getFormStore: () => FormStore<FormStoreFormFields>
): CreateStoreMultiStepConfiguration<FormStoreFormFields> => ({
  steps: [
    {
      name: 'termsAndConditions',
      components: [
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'termsAndConditions',
            componentParams: {},
          }),
        },
        {
          name: 'privacyPolicyConsent',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'checkbox',
            componentParams: {
              label: 'I agree to the terms of use of this service',
            },
          }),
          validationRules: {
            mustBeEqualTo: {
              value: true,
              message: 'You must check this to move forward',
            },
          },
          defaultValue: false,
        },
        {
          name: 'marketingConsent',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'checkbox',
            componentParams: {
              label:
                'I agree to recieve marketing emails and communication about the product',
            },
          }),
          defaultValue: false,
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'button',
            componentParams: {
              children: 'Back',
              disabled: true,
              variant: 'outline',
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'button',
            componentParams: {
              children: 'Next',
              onClick: () => {
                getFormStore().triggerGoToNextStep()
                window.localStorage.setItem('consent', 'true')
              },
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
      components: [
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'stepProgress',
            componentParams: {
              steps: [
                { label: 'Personal details', description: '', isActive: true },
                { label: 'Address info', description: '' },
                { label: 'Banking details', description: '' },
              ],
            },
          }),
        },
        {
          name: 'firstName',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'text',
            componentParams: {
              label: 'First name',
              wrapperParams: {
                span: 6,
              },
            },
          }),
          validationRules: {
            required: {
              message: 'This field is required',
            },
          },
        },
        {
          name: 'lastName',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'text',
            componentParams: {
              label: 'Last name',
              wrapperParams: {
                span: 6,
              },
            },
          }),
          validationRules: {
            required: {
              message: 'This field is required',
            },
          },
        },
        {
          name: 'friends',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'nestedArray',
            componentParams: {
              label: 'Friends',
              emptyStateText: 'No friends added yet',
            },
          }),
          validationRules: {
            minLength: {
              value: 1,
              message: 'This field is required',
            },
          },
          nestedArrayComponents: [
            {
              name: 'firstName',
              ...typeSafeFieldComponent({
                formComponentMappingKey: 'text',
                componentParams: {
                  label: 'First name',
                  wrapperParams: {
                    span: 4,
                  },
                },
              }),
              validationRules: {
                required: {
                  message: 'This field is required',
                },
              },
            },
            {
              name: 'lastName',
              ...typeSafeFieldComponent({
                formComponentMappingKey: 'text',
                componentParams: {
                  label: 'Last name',
                  wrapperParams: {
                    span: 4,
                  },
                },
              }),
              validationRules: {
                required: {
                  message: 'This field is required',
                },
              },
            },
            {
              ...typeSafeUiComponent({
                formComponentMappingKey: 'removeNestedArrayItemButton',
                componentParams: {
                  wrapperParams: {
                    span: 4,
                  },
                  mt: '24px',
                },
              }),
            },
          ],
        },
        {
          name: 'gender',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'radio',
            componentParams: {
              label: 'Gender',
              radioOptions: [
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ],
            },
          }),
          validationRules: {
            required: {
              message: 'This field is required',
            },
          },
        },
        {
          name: 'genderOther',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'text',
            componentParams: {
              label: 'Other gender',
            },
          }),
          validationRules: {
            required: {
              message: 'This field is required',
            },
          },
          shouldShowOnlyIf: { gender: 'other' },
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
                const fieldValues = getFormStore()?.getAllFieldValues()

                if (!fieldValues?.bookingDate) {
                  return {
                    label: 'Choose a time for your booking',
                    data: [],
                    disabled: true,
                  }
                }

                const data = await getTimes(fieldValues?.bookingDate)

                return {
                  label: 'Choose a time for your booking',
                  data,
                  disabled: false,
                }
              },
              dependencies: () => [getFormStore().getFieldValue('bookingDate')],
            },
          }),
          reactToChanges: {
            functionToRun: () => {
              getFormStore().setFieldValue('bookingTime', '')
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
            formComponentMappingKey: 'errorMessage',
            componentParams: {},
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'button',
            componentParams: {
              children: 'Back',
              variant: 'outline',
              onClick: () => {
                const wasStepModified = getFormStore().getIsStepDirty()
                if (wasStepModified) {
                  getFormStore().setContext({
                    isConfirmGoBackModalOpen: true,
                  })
                } else {
                  getFormStore().triggerGoToPreviousStep()
                }
              },
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'button',
            componentParams: {
              children: 'Next',
              onClick: () => {
                getFormStore().triggerGoToNextStep()
              },
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'goBackConfirmationDialog',
            componentParams: {},
          }),
        },
      ],
    },
    {
      name: 'favoriteSport',
      components: [
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'stepProgress',
            componentParams: {
              steps: [
                { label: 'Personal details', description: '', isActive: true },
                { label: 'Address info', description: '' },
                { label: 'Banking details', description: '' },
              ],
            },
          }),
        },
        {
          name: 'favoriteSport',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'select',
            componentParams: {
              label: "Male's favorite sport",
              data: [
                { label: 'Football', value: 'football' },
                { label: 'Basketball', value: 'basketball' },
                { label: 'Tennis', value: 'tennis' },
              ],
            },
          }),
          validationRules: {
            required: {
              message: 'This field is required',
            },
          },
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'errorMessage',
            componentParams: {},
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'button',
            componentParams: {
              children: 'Back',
              variant: 'outline',
              onClick: () => {
                getFormStore().triggerGoToPreviousStep()
              },
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'button',
            componentParams: {
              children: 'Next',
              onClick: () => {
                getFormStore().triggerGoToNextStep()
              },
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
      ],
      shouldSkipWhenGoingToNextStep: () => {
        if (getFormStore().getFieldValue('gender') !== 'male') {
          return true
        }

        return false
      },
      shouldSkipWhenGoingToPreviousStep: () => {
        return true
      },
    },
    {
      name: 'addressInfo',
      components: [
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'stepProgress',
            componentParams: {
              steps: [
                { label: 'Personal details', description: '' },
                { label: 'Address info', description: '', isActive: true },
                { label: 'Banking details', description: '' },
              ],
            },
          }),
        },
        {
          name: 'country',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'select',
            componentParams: {
              label: 'Country',
              data: [
                { label: 'Romania', value: 'romania' },
                { label: 'Hungary', value: 'hungary' },
                { label: 'Bulgaria', value: 'bulgaria' },
                { label: 'Serbia', value: 'serbia' },
              ],
            },
          }),
          validationRules: {
            required: {
              message: 'This field is required',
            },
          },
        },
        {
          name: 'city',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'text',
            componentParams: {
              label: 'City',
            },
          }),
          validationRules: {
            required: {
              message: 'This field is required',
            },
            customAsyncValidation: async () => {
              const fieldValue = getFormStore().getFieldValue('city')

              if (!fieldValue) {
                return ''
              }

              await sleep(1000)

              if (fieldValue !== 'Oradea') {
                return 'Value must be Oradea'
              }

              return ''
            },
          },
        },
        {
          name: 'address',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'text',
            componentParams: {
              label: 'Address',
            },
          }),
          validationRules: {
            required: {
              message: 'This field is required',
              priority: 1,
            },
            customValidation: {
              validate: () => {
                const fieldValue = getFormStore().getFieldValue('address')

                if (!fieldValue) {
                  return ''
                }

                if (fieldValue.length < 5) {
                  return 'Must be at least 5 length'
                }

                return ''
              },
              priority: 2,
            },
          },
        },
        {
          name: 'zipCode',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'text',
            componentParams: {
              label: 'Zip Code',
            },
          }),
          validationRules: {
            required: {
              message: 'This field is required',
            },
            exactLength: {
              value: 6,
              message: () =>
                `Must be 6 characters long (current length: ${
                  getFormStore().getFieldValue('zipCode')?.length
                })`,
            },
          },
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'errorMessage',
            componentParams: {},
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'button',
            componentParams: {
              children: 'Back',
              variant: 'outline',
              onClick: () => {
                getFormStore().triggerGoToPreviousStep()
              },
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'button',
            componentParams: {
              children: 'Next',
              onClick: () => {
                getFormStore().triggerGoToNextStep()
              },
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
      ],
    },
    {
      name: 'bankingDetails',
      components: [
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'stepProgress',
            componentParams: {
              steps: [
                { label: 'Personal details', description: '' },
                { label: 'Address info', description: '' },
                { label: 'Banking details', description: '', isActive: true },
              ],
            },
          }),
        },
        {
          name: 'bankName',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'text',
            componentParams: {
              label: 'Name of Bank',
            },
          }),
          validationRules: {
            required: {
              message: 'This field is required',
            },
          },
        },
        {
          name: 'iban',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'text',
            componentParams: {
              label: 'IBAN',
            },
          }),
          validationRules: {
            required: {
              message: 'This field is required',
            },
          },
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'errorMessage',
            componentParams: {},
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'button',
            componentParams: {
              children: 'Back',
              variant: 'outline',
              onClick: () => {
                getFormStore().triggerGoToPreviousStep()
              },
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'button',
            componentParams: {
              children: 'Submit',
              onClick: () => {
                getFormStore().triggerGoToNextStep({
                  onGoToNextStep: async () => {
                    await sleep(1500)
                  },
                })
              },
              wrapperParams: {
                span: 6,
              },
            },
          }),
        },
      ],
      validate: () => {
        const bankName = getFormStore().getFieldValue('bankName')

        if (bankName && bankName.length < 3) {
          return 'The bank name must be at least of length 3'
        }

        return ''
      },
      validateAsync: async () => {
        await sleep(1000)

        if (
          getFormStore().getFieldValue('iban') !== '12345' ||
          getFormStore().getFieldValue('bankName') !== 'ING'
        ) {
          return 'The bank must be ING and IBAN must be 12345'
        }

        return ''
      },
    },
    {
      name: 'success',
      components: [
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'stepProgress',
            componentParams: {
              steps: [
                { label: 'Personal details', description: '' },
                { label: 'Address info', description: '' },
                { label: 'Banking details', description: '' },
              ],
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'title',
            componentParams: {
              children: 'Success!',
              size: 'xl',
            },
          }),
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'button',
            componentParams: {
              children: 'Back to home',
              onClick: () => {
                window.location.reload()
              },
            },
          }),
        },
      ],
    },
  ],
  startAtStep: () => {
    if (window.localStorage.getItem('consent')) {
      return 'personalDetails'
    }

    return 'termsAndConditions'
  },
})

export const CoreFeatures: Story = {
  name: 'Core Features',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const multiStepForm = useCreateFormStore(
      'coreFeaturesMultiStep',
      createMultiStepFormBaseConfig
    )

    return (
      <FormComponentMappingsProvider
        {...MantineKitMappings}
        uiComponentMappings={{
          ...MantineKitMappings.uiComponentMappings,
          termsAndConditions: TermsAndConditionsBrief,
        }}
      >
        <Form formStore={multiStepForm} />
      </FormComponentMappingsProvider>
    )
  },
}

export const InitialDataSuccess: Story = {
  name: 'Initial Data Success',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const multiStepForm = useCreateFormStore<FormStoreFormFields>(
      'coreFeaturesMultiStepDataLoadingSuccess',
      (getFormStore) => ({
        ...createMultiStepFormBaseConfig(getFormStore),
        initialData: async () => {
          await sleep(1500)

          return {
            marketingConsent: true,
            privacyPolicyConsent: true,
            firstName: 'Matyas',
            lastName: 'Furtos',
            bookingDate: new Date(2025, 1, 20),
            bookingTime: '12:00',
            friends: [
              { firstName: 'Szabo', lastName: 'Akos' },
              { firstName: 'Orban', lastName: 'Geza' },
            ],
            gender: 'male',
            favoriteSport: 'football',
            genderOther: '',
            address: '',
            zipCode: '',
            bankName: '',
            city: '',
            country: '',
            iban: '',
          }
        },
        startAtStep: () => {
          if (getFormStore().initialData?.bookingTime) {
            return 'addressInfo'
          }

          return 'termsAndConditions'
        },
      })
    )

    return (
      <FormComponentMappingsProvider
        {...MantineKitMappings}
        uiComponentMappings={{
          ...MantineKitMappings.uiComponentMappings,
          termsAndConditions: TermsAndConditionsBrief,
        }}
      >
        <Form formStore={multiStepForm} />
      </FormComponentMappingsProvider>
    )
  },
}

let failCount = 0

export const InitialDataError: Story = {
  name: 'Initial Data Error',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const multiStepForm = useCreateFormStore<FormStoreFormFields>(
      'coreFeaturesMultiStepDataLoadingError',
      (getFormStore) => ({
        ...createMultiStepFormBaseConfig(getFormStore),
        initialData: async () => {
          await sleep(1500)

          if (failCount < 2) {
            failCount++
            throw new Error('Internal server error')
          }

          return {
            marketingConsent: true,
            privacyPolicyConsent: true,
            firstName: 'Matyas',
            lastName: 'Furtos',
            bookingDate: new Date(2025, 1, 20),
            bookingTime: '12:00',
            friends: [
              { firstName: 'Szabo', lastName: 'Akos' },
              { firstName: 'Orban', lastName: 'Geza' },
            ],
            gender: 'male',
            favoriteSport: 'football',
            genderOther: '',
            address: '',
            zipCode: '',
            bankName: '',
            city: '',
            country: '',
            iban: '',
          }
        },
        startAtStep: () => {
          if (getFormStore().initialData?.bookingTime) {
            return 'addressInfo'
          }

          return 'termsAndConditions'
        },
      })
    )

    return (
      <FormComponentMappingsProvider
        {...MantineKitMappings}
        uiComponentMappings={{
          ...MantineKitMappings.uiComponentMappings,
          termsAndConditions: TermsAndConditionsBrief,
        }}
      >
        <Form formStore={multiStepForm} />
      </FormComponentMappingsProvider>
    )
  },
}
