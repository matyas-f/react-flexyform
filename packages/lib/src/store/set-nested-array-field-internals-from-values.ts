import { FormFieldComponent, InnerStoreApi, StringKeyOf } from '../types'
import { deepFlattenObject } from '../utils/deep-flatten-object'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { parseNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'
import { getComponentConfiguration } from './get-component-configuration'
import { getInitialField } from './get-initial-field'
import { setComponentParams } from './set-component-params'
import { triggerDynamicComponentParams } from './trigger-dynamic-component-params'

export const setNestedArrayFieldInternalsFromValues = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  values: Record<string, any>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [
      ...(_innerStoreApi.calledBy || []),
      'setNestedArrayFieldInternalsFromValues',
    ],
  }

  const {
    configuration: { steps, formId },
  } = innerStoreApi.getStoreState()

  const flattenedValues = deepFlattenObject(values)

  innerStoreApi.setStoreState(
    (formStore) => {
      for (const nestedArrayFieldName in flattenedValues) {
        const { isNestedArrayItem, nestedItemComponentName, parentFieldName } =
          parseNestedArrayItemFieldName(nestedArrayFieldName)

        if (!isNestedArrayItem) {
          continue
        }

        let nestedFieldComponent: FormFieldComponent<TFormFields> | null = null

        const stepOfComponent = steps.find((step) =>
          step.components
            .filter((component) => component.type === 'field')
            .some((field) => {
              if (field.name !== parentFieldName) {
                return false
              }

              const nestedFieldComponentFromParent =
                field.nestedArrayComponents?.find(
                  (c) => c.name === nestedItemComponentName
                ) as FormFieldComponent<TFormFields> | undefined

              if (nestedFieldComponentFromParent) {
                nestedFieldComponent = {
                  ...nestedFieldComponentFromParent,
                  name: nestedArrayFieldName as StringKeyOf<TFormFields>,
                }
              }

              return true
            })
        )

        const fieldValue = flattenedValues[nestedArrayFieldName]

        if (stepOfComponent && nestedFieldComponent) {
          formStore.fields[nestedArrayFieldName as StringKeyOf<TFormFields>] =
            getInitialField(
              nestedFieldComponent,
              stepOfComponent,
              formId,
              fieldValue
            )
        }
      }
    },
    false,
    getReduxDevtoolsDebugLabel(innerStoreApi.calledBy, {
      values,
    })
  )

  for (const nestedArrayFieldName in flattenedValues) {
    const { isNestedArrayItem } =
      parseNestedArrayItemFieldName(nestedArrayFieldName)

    if (!isNestedArrayItem) {
      continue
    }

    const componentConfiguration = getComponentConfiguration(
      innerStoreApi,
      nestedArrayFieldName
    )

    if (!componentConfiguration || componentConfiguration.type !== 'field') {
      continue
    }

    if (typeof componentConfiguration.componentParams?.value === 'function') {
      triggerDynamicComponentParams(innerStoreApi, nestedArrayFieldName)
    } else {
      setComponentParams(
        innerStoreApi,
        nestedArrayFieldName,
        componentConfiguration.componentParams
      )
    }
  }
}
