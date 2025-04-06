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

const EditProfileFormWithSaveExample = () => {
  const editProfileFormStoreWithSave = useCreateFormStore(
    'editProfileFormWithSave',
    (getStoreState) => ({
      initialData: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@gmail.com',
      },
      autoSaveOptions: {
        enabled: false,
      },
      validationOptions: {
        validateFieldsOn: ['fieldBlur', 'save'],
        reValidateFieldsOn: ['fieldValueChange'],
      },
      shouldSaveOnEnter: true,
      events: {
        onSave: async () => {
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
        {
          ...typeSafeUiComponent({
            formComponentMappingKey: 'saveButton',
            componentParams: {},
          }),
        },
      ],
    })
  )

  return (
    <CodeExampleWrapper
      handleReset={() =>
        editProfileFormStoreWithSave.getState().resetFormState()
      }
    >
      <Form formStore={editProfileFormStoreWithSave} />
    </CodeExampleWrapper>
  )
}

export default EditProfileFormWithSaveExample
