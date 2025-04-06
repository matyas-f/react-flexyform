import { useFormComponentParams, useParentFormStore } from 'react-flexyform'
import { omit } from 'lodash'
import { Stepper, StepperProps } from '@mantine/core'
import { useMemo } from 'react'

export type Params = Omit<StepperProps, 'children' | 'active'> & {
  active?: number
  steps: { label: string; description?: string; isActive?: true }[]
}

export const FormIntegratedStepProgress = () => {
  const params = useFormComponentParams<Params>().value

  const currentStepIndex = useParentFormStore((formStore) =>
    formStore.getCurrentStepIndex()
  )

  const activeStepIndex = useMemo(
    () => params.steps?.findIndex((step) => step.isActive),
    [params.steps]
  )

  return (
    <Stepper
      active={activeStepIndex !== -1 ? activeStepIndex : currentStepIndex}
      size="sm"
      {...omit(params, ['wrapperParams', 'steps'])}
    >
      {params.steps?.map((step) => (
        <Stepper.Step
          key={step.label}
          label={step.label}
          allowStepClick={false}
          allowStepSelect={false}
          description={step.description}
        />
      ))}
    </Stepper>
  )
}
