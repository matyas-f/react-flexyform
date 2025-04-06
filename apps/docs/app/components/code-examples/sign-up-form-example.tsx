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

const SignUpFormExample = () => {
  const signUpFormStore = useCreateFormStore('signUpForm', (getStoreState) => ({
    events: {
      onSubmit: async () => {
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
    shouldSubmitOnEnter: true,
    components: [
      {
        ...typeSafeUiComponent({
          formComponentMappingKey: 'title',
          componentParams: {
            children: 'Sign up',
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
        validationRules: {
          required: {
            message: 'This field is required',
          },
          email: {
            message: 'Must be a valid email',
          },
          customAsyncValidation: async () => {
            await wait(1000)

            const email = signUpFormStore.getState().getFieldValue('email')

            if (email && email.includes('test')) {
              return 'This email is already taken'
            }

            return ''
          },
        },
        ...typeSafeFieldComponent({
          formComponentMappingKey: 'text',
          componentParams: {
            label: 'Email',
          },
        }),
      },
      {
        name: 'password',
        ...typeSafeFieldComponent({
          formComponentMappingKey: 'password',
          componentParams: {
            label: 'Password',
          },
        }),
        validationRules: {
          required: {
            message: 'This field is required',
          },
          minLength: {
            value: 8,
            message: () => {
              const password = getStoreState().getFieldValue(
                'password'
              ) as string

              return `Must be at least 8 characters long (current length ${password.length})`
            },
          },
          maxLength: {
            value: 20,
            message: () => {
              const password = getStoreState().getFieldValue(
                'password'
              ) as string

              return `Must be maximum 20 characters long (current length ${password.length})`
            },
          },
          onlyStrongPasswordCharacters: {
            message:
              'Must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
          },
        },
      },
      {
        name: 'passwordConfirmation',
        validationRules: {
          required: {
            message: 'This field is required',
          },
          matchAnotherField: {
            value: 'password',
            message: 'Must match the previous password',
          },
        },
        ...typeSafeFieldComponent({
          formComponentMappingKey: 'password',
          componentParams: {
            label: 'Confirm password',
          },
        }),
      },
      {
        ...typeSafeUiComponent({
          formComponentMappingKey: 'errorMessage',
          componentParams: {},
        }),
      },
      {
        ...typeSafeUiComponent({
          formComponentMappingKey: 'submitButton',
          componentParams: {},
        }),
        shouldShowOnlyIf: {
          value: () => !getStoreState().didSubmitSuccessfully,
          dependencies: () => [getStoreState().didSubmitSuccessfully],
        },
      },
      {
        ...typeSafeUiComponent({
          formComponentMappingKey: 'paragraph',
          componentParams: {
            children: 'Sign up successful!',
            ta: 'center',
          },
        }),
        shouldShowOnlyIf: {
          value: () => getStoreState().didSubmitSuccessfully,
          dependencies: () => [getStoreState().didSubmitSuccessfully],
        },
      },
    ],
  }))

  return (
    <CodeExampleWrapper
      handleReset={() => signUpFormStore.getState().resetFormState()}
    >
      <Form formStore={signUpFormStore} />
    </CodeExampleWrapper>
  )
}

export default SignUpFormExample
