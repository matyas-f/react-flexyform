'use client'

import React from 'react'
import { useCreateFormStore, Form } from 'react-flexyform'
import { CodeExampleWrapper } from '../ui/code-example-wrapper'
import { wait } from '../../../utils/sleep'

type LoanApplicationFields = {
  employmentStatus: string
  annualIncome: number
  savings: number
  outstandingLoans: number
  businessFoundedAt?: Date
  businessType?: string
  businessDescription?: string
  numberOfEmployees?: number
  lastYearRevenue?: number
  requestedAmount: number
  loanPurpose: string
  loanTerm: number
}

const calculateLoanScore = (formData: Partial<LoanApplicationFields>) => {
  let score = 0

  if (formData.savings) {
    if (formData.savings >= 200000) {
      score += 50
    } else if (formData.savings >= 100000) {
      score += 30
    } else if (formData.savings >= 50000) {
      score += 20
    } else if (formData.savings >= 30000) {
      score += 10
    } else {
      score += 0
    }
  }

  if (formData.annualIncome) {
    if (formData.annualIncome >= 100000) {
      score += 30
    } else if (formData.annualIncome >= 75000) {
      score += 25
    } else if (formData.annualIncome >= 50000) {
      score += 20
    } else if (formData.annualIncome >= 30000) {
      score += 15
    } else {
      score += 5
    }
  }

  if (formData.employmentStatus) {
    if (formData.employmentStatus === 'employed') {
      score += 25
    } else if (formData.employmentStatus === 'self-employed') {
      score += 10
    } else {
      score += 0
    }
  }

  if (formData.outstandingLoans !== undefined) {
    if (formData.outstandingLoans === 0) {
      score += 10
    } else if (formData.outstandingLoans <= 1) {
      score += 5
    } else if (formData.outstandingLoans <= 2) {
      score += 0
    } else {
      score += -5
    }
  }

  const isEligible = score >= 40
  const maxLoanAmount = Math.min(formData.annualIncome! * 0.8, 500000)
  const interestRate = Math.max(5 + (70 - score) * 0.2, 5)

  return {
    score,
    maxLoanAmount,
    interestRate,
    isEligible,
  }
}

export const LoanApplicationFormExample = () => {
  const loanApplicationFormStore = useCreateFormStore<LoanApplicationFields>(
    'loanApplicationForm',
    (getFormStore) => ({
      events: {
        onSubmit: async () => {
          await wait(1000)
        },
        onSubmitSuccess: () => {
          getFormStore().triggerGoToNextStep()
        },
      },
      steps: [
        {
          name: 'financialDetails',
          shouldGoToNextStepOnEnter: true,
          components: [
            {
              type: 'ui',
              formComponentMappingKey: 'stepProgress',
              componentParams: {
                value: () => {
                  const isSelfEmployed =
                    getFormStore().getFieldValue('employmentStatus') ===
                    'self-employed'

                  return {
                    steps: [
                      { label: 'Financial' },
                      { label: isSelfEmployed ? 'Business' : '' },
                      { label: 'Loan terms' },
                      { label: 'Review' },
                    ].filter((l) => Boolean(l.label)),
                  }
                },
                dependencies: () => [
                  getFormStore().getFieldValue('employmentStatus'),
                ],
              },
            },
            {
              type: 'wrapper',
              name: 'financialDetailsFieldsWrapper',
              formComponentMappingKey: 'borderedSection',
              wrapping: 'start',
            },
            {
              type: 'field',
              name: 'annualIncome',
              formComponentMappingKey: 'number',
              defaultValue: 0,
              componentParams: {
                label: 'Annual income',
                leftSection: '$',
              },
              validationRules: {
                required: {
                  message: 'Required',
                },
              },
            },
            {
              type: 'field',
              name: 'employmentStatus',
              formComponentMappingKey: 'select',
              componentParams: {
                label: 'Employment status',
                data: [
                  { value: 'employed', label: 'Employed' },
                  { value: 'self-employed', label: 'Self-employed' },
                  { value: 'unemployed', label: 'Unemployed' },
                ],
              },
              validationRules: {
                required: {
                  message: 'Required',
                },
              },
            },
            {
              type: 'field',
              name: 'outstandingLoans',
              formComponentMappingKey: 'number',
              defaultValue: 0,
              componentParams: {
                label: 'Number of outstanding loans',
              },
              validationRules: {
                required: {
                  message: 'Required',
                },
              },
            },
            {
              type: 'wrapper',
              name: 'financialDetailsFieldsWrapper',
              formComponentMappingKey: 'borderedSection',
              wrapping: 'end',
            },
            {
              type: 'ui',
              formComponentMappingKey: 'paragraph',
              componentParams: {
                value: () => {
                  const formData = getFormStore().getAllFieldValues()
                  const loanScore = calculateLoanScore(formData)

                  return {
                    children: `Your current credit score is ${loanScore.score}`,
                  }
                },
                dependencies: () => [
                  calculateLoanScore(getFormStore().getAllFieldValues()).score,
                ],
              },
            },
            {
              type: 'ui',
              formComponentMappingKey: 'errorMessage',
            },
            {
              type: 'ui',
              formComponentMappingKey: 'goToPreviousStepButton',
              componentParams: {
                wrapperParams: {
                  span: 6,
                },
              },
            },
            {
              type: 'ui',
              formComponentMappingKey: 'goToNextStepButton',
              componentParams: {
                wrapperParams: {
                  span: 6,
                },
              },
            },
          ],
          validate: () => {
            const formData = getFormStore().getAllFieldValues()
            const loanScore = calculateLoanScore(formData)

            if (!loanScore.isEligible) {
              return 'You need to score at least 40 points to be eligible.'
            }

            return ''
          },
        },
        {
          name: 'businessDetails',
          shouldGoToNextStepOnEnter: true,
          shouldSkip: () => {
            const isSelfEmployed =
              getFormStore().getFieldValue('employmentStatus') ===
              'self-employed'

            return !isSelfEmployed
          },
          components: [
            {
              type: 'ui',
              formComponentMappingKey: 'stepProgress',
              componentParams: {
                value: () => {
                  const isSelfEmployed =
                    getFormStore().getFieldValue('employmentStatus') ===
                    'self-employed'

                  return {
                    steps: [
                      { label: 'Financial' },
                      { label: isSelfEmployed ? 'Business' : '' },
                      { label: 'Loan terms' },
                      { label: 'Review' },
                    ].filter((l) => Boolean(l.label)),
                  }
                },
                dependencies: () => [
                  getFormStore().getFieldValue('employmentStatus'),
                ],
              },
            },
            {
              type: 'ui',
              formComponentMappingKey: 'title',
              componentParams: {
                children: 'Business details',
              },
            },
            {
              type: 'field',
              name: 'businessFoundedAt',
              formComponentMappingKey: 'date',
              componentParams: {
                label: 'Founded at',
              },
              validationRules: {
                required: {
                  message: 'Required',
                },
              },
            },
            {
              type: 'field',
              name: 'businessType',
              formComponentMappingKey: 'select',
              componentParams: {
                label: 'Type',
                data: [
                  { value: 'LLC', label: 'LLC' },
                  {
                    value: 'sole-proprietorship',
                    label: 'Sole Proprietorship',
                  },
                  { value: 'corporation', label: 'Corporation' },
                  { value: 'partnership', label: 'Partnership' },
                  { value: 'non-profit', label: 'Non-profit' },
                  { value: 'other', label: 'Other' },
                ],
              },
              validationRules: {
                required: {
                  message: 'Required',
                },
              },
            },
            {
              type: 'field',
              name: 'businessDescription',
              formComponentMappingKey: 'textarea',
              componentParams: {
                label: 'Describe your business',
              },
              validationRules: {
                required: {
                  message: 'Required',
                },
              },
            },
            {
              type: 'field',
              name: 'numberOfEmployees',
              formComponentMappingKey: 'number',
              componentParams: {
                label: 'Number of employees',
                defaultValue: 1,
              },
              validationRules: {
                required: {
                  message: 'Required',
                },
              },
            },
            {
              type: 'field',
              name: 'lastYearRevenue',
              formComponentMappingKey: 'number',
              componentParams: {
                label: "Last year's revenue",
                leftSection: '$',
              },
              validationRules: {
                required: {
                  message: 'Required',
                },
              },
            },
            {
              type: 'ui',
              formComponentMappingKey: 'errorMessage',
            },
            {
              type: 'ui',
              formComponentMappingKey: 'goToPreviousStepButton',
              componentParams: {
                wrapperParams: {
                  span: 6,
                },
              },
            },
            {
              type: 'ui',
              formComponentMappingKey: 'goToNextStepButton',
              componentParams: {
                wrapperParams: {
                  span: 6,
                },
              },
            },
          ],
        },
        {
          name: 'loanTerms',
          shouldGoToNextStepOnEnter: true,
          components: [
            {
              type: 'ui',
              formComponentMappingKey: 'stepProgress',
              componentParams: {
                value: () => {
                  const isSelfEmployed =
                    getFormStore().getFieldValue('employmentStatus') ===
                    'self-employed'

                  return {
                    steps: [
                      { label: 'Financial' },
                      { label: isSelfEmployed ? 'Business' : '' },
                      { label: 'Loan terms' },
                      { label: 'Review' },
                    ].filter((l) => Boolean(l.label)),
                  }
                },
                dependencies: () => [
                  getFormStore().getFieldValue('employmentStatus'),
                ],
              },
            },
            {
              type: 'field',
              name: 'requestedAmount',
              formComponentMappingKey: 'number',
              defaultValue: 0,
              componentParams: {
                value: () => {
                  const formData = getFormStore().getAllFieldValues()
                  const loanScore = calculateLoanScore(formData)

                  return {
                    label: 'Requested loan amount',
                    leftSection: '$',
                    description: `Max loan amount based on your credit score: $${loanScore.maxLoanAmount.toFixed(2)}`,
                  }
                },
                dependencies: () => [
                  calculateLoanScore(getFormStore().getAllFieldValues())
                    .maxLoanAmount,
                ],
              },
              validationRules: {
                required: {
                  message: 'Required',
                  priority: 1,
                },
                customValidation: {
                  validate: () => {
                    const formData = getFormStore().getAllFieldValues()
                    const loanScore = calculateLoanScore(formData)

                    if (formData.requestedAmount > loanScore.maxLoanAmount) {
                      return `The requested amount exceeds your maximum eligible amount of $${loanScore.maxLoanAmount.toFixed(2)}`
                    }

                    return ''
                  },
                  priority: 2,
                },
                dependencies: () => [
                  calculateLoanScore(getFormStore().getAllFieldValues())
                    .maxLoanAmount,
                  getFormStore().getFieldValue('requestedAmount'),
                ],
              },
            },
            {
              type: 'field',
              name: 'loanPurpose',
              formComponentMappingKey: 'textarea',
              componentParams: {
                label: 'Loan purpose',
              },
              validationRules: {
                required: {
                  message: 'Required',
                },
              },
            },
            {
              type: 'field',
              name: 'loanTerm',
              formComponentMappingKey: 'number',
              componentParams: {
                label: 'Loan term (months)',
              },
              validationRules: {
                required: {
                  message: 'Required',
                },
                minValue: {
                  message: 'Loan term must be at least 6 months',
                  value: 6,
                },
              },
            },
            {
              type: 'ui',
              formComponentMappingKey: 'errorMessage',
            },
            {
              type: 'ui',
              formComponentMappingKey: 'goToPreviousStepButton',
              componentParams: {
                wrapperParams: {
                  span: 6,
                },
              },
            },
            {
              type: 'ui',
              formComponentMappingKey: 'goToNextStepButton',
              componentParams: {
                wrapperParams: {
                  span: 6,
                },
              },
            },
          ],
        },
        {
          name: 'review',
          shouldSubmitOnEnter: true,
          components: [
            {
              type: 'ui',
              formComponentMappingKey: 'stepProgress',
              componentParams: {
                value: () => {
                  const isSelfEmployed =
                    getFormStore().getFieldValue('employmentStatus') ===
                    'self-employed'

                  return {
                    steps: [
                      { label: 'Financial' },
                      { label: isSelfEmployed ? 'Business' : '' },
                      { label: 'Loan terms' },
                      { label: 'Review' },
                    ].filter((l) => Boolean(l.label)),
                  }
                },
                dependencies: () => [
                  getFormStore().getFieldValue('employmentStatus'),
                ],
              },
            },
            {
              type: 'ui',
              formComponentMappingKey: 'title',
              componentParams: {
                children: 'Loan application summary',
              },
            },
            {
              type: 'ui',
              formComponentMappingKey: 'prose',
              componentParams: {
                value: () => {
                  return {
                    children: (
                      <>
                        <b>Financial Information:</b>
                        <p>
                          Annual Income: $
                          {getFormStore().getFieldValue('annualIncome')}
                        </p>
                        <p>
                          Employment Status:{' '}
                          {getFormStore().getFieldValue('employmentStatus')}
                        </p>
                        <p>
                          Outstanding Loans:
                          {getFormStore().getFieldValue('outstandingLoans')}
                        </p>
                        <br />
                        <b>Eligibility:</b>
                        <p>
                          Credit Score:{' '}
                          {
                            calculateLoanScore(
                              getFormStore().getAllFieldValues()
                            ).score
                          }{' '}
                          points
                        </p>
                        <p>
                          Interest Rate:{' '}
                          {
                            calculateLoanScore(
                              getFormStore().getAllFieldValues()
                            ).interestRate
                          }
                          %
                        </p>
                        <p>
                          Max Loan Amount: $
                          {calculateLoanScore(
                            getFormStore().getAllFieldValues()
                          ).maxLoanAmount.toFixed(2)}
                        </p>
                        <br />
                        <b>Loan Details:</b>
                        <p>
                          Requested Amount: $
                          {getFormStore().getFieldValue('requestedAmount')}
                        </p>
                        <p>
                          Purpose: {getFormStore().getFieldValue('loanPurpose')}
                        </p>
                        <p>
                          Term: {getFormStore().getFieldValue('loanTerm')}{' '}
                          months
                        </p>
                      </>
                    ),
                  }
                },
              },
            },
            {
              type: 'ui',
              formComponentMappingKey: 'errorMessage',
            },
            {
              type: 'ui',
              formComponentMappingKey: 'goToPreviousStepButton',
              componentParams: {
                wrapperParams: {
                  span: 6,
                },
              },
            },
            {
              type: 'ui',
              formComponentMappingKey: 'submitButton',
              componentParams: {
                wrapperParams: {
                  span: 6,
                },
              },
            },
          ],
        },
        {
          name: 'success',
          components: [
            {
              type: 'ui',
              formComponentMappingKey: 'stepProgress',
              componentParams: {
                value: () => {
                  const isSelfEmployed =
                    getFormStore().getFieldValue('employmentStatus') ===
                    'self-employed'

                  return {
                    steps: [
                      { label: 'Financial' },
                      { label: isSelfEmployed ? 'Business' : '' },
                      { label: 'Loan terms' },
                      { label: 'Review' },
                    ].filter((l) => Boolean(l.label)),
                  }
                },
                dependencies: () => [
                  getFormStore().getFieldValue('employmentStatus'),
                ],
              },
            },
            {
              type: 'ui',
              formComponentMappingKey: 'title',
              componentParams: {
                children: 'Success',
              },
            },
            {
              type: 'ui',
              formComponentMappingKey: 'paragraph',
              componentParams: {
                children:
                  'Your loan application has been submitted successfully. We will contact you shortly.',
              },
            },
          ],
        },
      ],
    })
  )

  return (
    <CodeExampleWrapper
      handleReset={() => {
        loanApplicationFormStore.getState().resetFormState()
      }}
    >
      <Form formStore={loanApplicationFormStore} />
    </CodeExampleWrapper>
  )
}

export default LoanApplicationFormExample
