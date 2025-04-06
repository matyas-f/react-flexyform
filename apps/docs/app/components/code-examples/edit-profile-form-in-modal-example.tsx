'use client'

import React from 'react'
import {
  Form,
  typeSafeFieldComponent,
  typeSafeUiComponent,
  useCreateFormStore,
} from 'react-flexyform'
import { CodeExampleWrapper } from '../ui/code-example-wrapper'
import { wait } from '../../../utils/sleep'

const FormModal = (props: { onModalClose: () => void }) => {
  const editProfileFormInModalStore = useCreateFormStore(
    'editProfileFormInModal',
    (getStoreState) => ({
      initialData: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@gmail.com',
      },
      context: {
        isFormInModal: true,
        onFormModalClose: () => {
          props.onModalClose()
        },
      },
      autoSaveOptions: {
        enabled: true,
        autoSaveOn: ['fieldValueChange'],
        autoSaveDebounceDurationInMs: 1000,
      },
      validationOptions: {
        validateFieldsOn: ['fieldValueChange'],
      },
      events: {
        onAutoSave: async () => {
          await wait(1000)

          const firstName = getStoreState().getFieldValue('firstName') as string
          const lastName = getStoreState().getFieldValue('lastName') as string

          if (
            firstName.toLowerCase().includes('test') ||
            lastName.toLowerCase().includes('test')
          ) {
            throw new Error(
              'First name and last name cannot contain the word "test"'
            )
          }
        },
      },
      components: [
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'title',
            componentParams: {
              children: 'Edit profile',
              size: 'xl',
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
                span: {
                  xs: 12,
                  sm: 6,
                },
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
                span: {
                  xs: 12,
                  sm: 6,
                },
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
          name: 'email',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'text',
            componentParams: {
              label: 'Email',
              disabled: true,
            },
          }),
        },
        {
          name: 'github',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'text',
            componentParams: {
              label: 'Github profile',
            },
          }),
          validationRules: {
            url: {
              message: 'Must be a valid URL',
            },
          },
        },
        {
          name: 'bio',
          ...typeSafeFieldComponent({
            formComponentMappingKey: 'textarea',
            componentParams: {
              label: 'Bio',
            },
          }),
          validationRules: {
            maxLength: {
              value: 100,
              message: () =>
                `Max 100 characters allowed (current: ${getStoreState().getFieldValue('bio')?.length || 0})`,
            },
          },
        },
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'errorMessage',
            componentParams: {},
          }),
        },
      ],
    }),
    {
      resetStoreOnMount: false,
    }
  )

  return <Form formStore={editProfileFormInModalStore} />
}

const EditProfileFormInModalExample = () => {
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)

  return (
    <CodeExampleWrapper handleReset={() => {}}>
      <button onClick={() => setIsFormModalOpen(true)}>
        Click to open edit profile modal
      </button>
      {isFormModalOpen && (
        <FormModal
          onModalClose={() => {
            setIsFormModalOpen(false)
          }}
        />
      )}
    </CodeExampleWrapper>
  )
}

export default EditProfileFormInModalExample
