import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  Form,
  FormComponentMappingsProvider,
  typeSafeFieldComponent,
  typeSafeUiComponent,
  useCreateFormStore,
  FormStore,
  CreateStoreSingleStepConfiguration,
} from 'react-flexyform'
import { MantineKitMappings } from '@react-flexyform/form-components'
import { TermsAndConditionsBrief } from './components/terms-and-conditions-brief'

const meta: Meta<typeof Form> = {
  component: Form,
  title: 'Single Step',
}

export default meta
type Story = StoryObj<typeof Form>

const sleep = (ms: number) =>
  new Promise<boolean>((resolve) => setTimeout(() => resolve(true), ms))

type FormStoreFormFields = {
  firstName: string
  lastName: string
  gender: string
  genderOther: string
  friends: { firstName: string; lastName: string }[]
  dateOfBirth: Date
}

const createSingleStepFormBaseConfig = (
  getFormStore: () => FormStore<FormStoreFormFields>
): CreateStoreSingleStepConfiguration<FormStoreFormFields> => {
  return {
    components: [
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
            message: 'Must add at least 1 friend',
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
                  styleProps: {
                    mt: 'auto',
                  },
                },
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
        name: 'dateOfBirth',
        ...typeSafeFieldComponent({
          formComponentMappingKey: 'date',
          componentParams: {
            label: 'Date of birth',
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
            value: () => ({
              children: 'Submit',
              loading: getFormStore().isSubmitting,
              onClick: () => {
                getFormStore().triggerSubmit({
                  onSubmit: async () => {
                    await sleep(1500)
                  },
                  onSubmitSuccess() {
                    alert('success')
                  },
                })
              },
            }),
            dependencies: () => [getFormStore().isSubmitting],
          },
        }),
      },
    ],
    validateAsync: async () => {
      await sleep(1000)

      if (getFormStore().getFieldValue('firstName') !== 'asd') {
        return 'The first name must be asd'
      }

      return ''
    },
  }
}

export const CoreFeatures: Story = {
  name: 'Core Features',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const singleStepForm = useCreateFormStore(
      'coreFeaturesSingleStep',
      createSingleStepFormBaseConfig
    )

    return (
      <FormComponentMappingsProvider
        {...MantineKitMappings}
        uiComponentMappings={{
          ...MantineKitMappings.uiComponentMappings,
          termsAndConditions: TermsAndConditionsBrief,
        }}
      >
        <Form formStore={singleStepForm} />
      </FormComponentMappingsProvider>
    )
  },
}

export const InitialDataSuccess: Story = {
  name: 'Initial Data Success',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const singleStepFormWithSuccess = useCreateFormStore<FormStoreFormFields>(
      'coreFeaturesSingleStepDataLoadingSuccess',
      (getFormStore) => {
        return {
          ...createSingleStepFormBaseConfig(getFormStore),
          initialData: async () => {
            await sleep(1500)

            return {
              firstName: 'Matyas',
              lastName: 'Furtos',
              dateOfBirth: new Date(1995, 3, 1),
              friends: [
                { firstName: 'Szabo', lastName: 'Akos' },
                { firstName: 'Orban', lastName: 'Geza' },
              ],
              gender: '',
              genderOther: '',
            }
          },
        }
      }
    )

    return (
      <FormComponentMappingsProvider
        {...MantineKitMappings}
        uiComponentMappings={{
          ...MantineKitMappings.uiComponentMappings,
          termsAndConditions: TermsAndConditionsBrief,
        }}
      >
        <Form formStore={singleStepFormWithSuccess} />
      </FormComponentMappingsProvider>
    )
  },
}

let failCount = 0

export const InitialDataError: Story = {
  name: 'Initial Data Error',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const singleStepFormWithSuccess = useCreateFormStore<FormStoreFormFields>(
      'coreFeaturesSingleStepDataLoadingError',
      (getFormStore) => ({
        ...createSingleStepFormBaseConfig(getFormStore),
        initialData: async () => {
          await sleep(1500)

          if (failCount < 2) {
            failCount++
            throw new Error('Internal server error')
          }

          return {
            firstName: 'Matyas',
            lastName: 'Furtos',
            gender: 'female',
            dateOfBirth: new Date(1995, 3, 1),
            friends: [],
            genderOther: '',
          }
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
        <Form formStore={singleStepFormWithSuccess} />
      </FormComponentMappingsProvider>
    )
  },
}
