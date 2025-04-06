import {
  FormFieldComponent,
  FormStore,
  FormWrapperComponent,
  InnerStoreApi,
  StringKeyOf,
} from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { parseNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'
import { getInitialField } from './get-initial-field'
import { getStepByFieldName } from './get-step-by-field-name'
import { triggerFieldValidation } from './trigger-field-validation'
import {
  getNestedArrayItemComponentParamsName,
  getNestedArrayItemFieldName,
} from '../utils/name-generators'
import { isEqual } from 'lodash'
import { getFieldValue } from './get-field-value'
import { getComponentConfiguration } from './get-component-configuration'
import { setComponentParams } from './set-component-params'
import { triggerDynamicComponentParams } from './trigger-dynamic-component-params'
import { getComponentStep } from './get-component-step'
import { setFieldIsDirty } from './set-field-is-dirty'
import { setFieldIsTouched } from './set-field-is-touched'

export const setFieldValue = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  ...[fieldName, newValue, options]: Parameters<FormStore['setFieldValue']>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'setFieldValue'],
  }

  const { formId } = innerStoreApi.getStoreState().configuration
  const parsedNestedArrayItemFieldName =
    parseNestedArrayItemFieldName(fieldName)
  const {
    shouldSetIsDirty = true,
    shouldSetIsTouched = true,
    shouldTriggerValidation = true,
  } = options || {}

  const currentStep = getComponentStep(innerStoreApi, fieldName)

  const componentConfiguration = getComponentConfiguration(
    innerStoreApi,
    fieldName
  ) as FormFieldComponent | undefined

  if (!componentConfiguration) {
    return
  }

  const createActionsToPerform: {
    index: number
    nestedArrayItemValue: Record<string, any>
  }[] = []
  const updateActionsToPerform: {
    index: number
    nestedArrayItemValue: Record<string, any>
  }[] = []
  const deleteActionsToPerform: {
    index: number
  }[] = []

  innerStoreApi.setStoreState(
    (formStore) => {
      if (!formStore.fields[fieldName]) {
        return
      }

      if (!isEqual(formStore.fields[fieldName].value, newValue)) {
        formStore.fields[fieldName].previousValue =
          formStore.fields[fieldName].value
      }

      formStore.fields[fieldName].value = newValue

      const isNestedArray =
        componentConfiguration.nestedArrayComponents &&
        componentConfiguration.nestedArrayComponents.length > 0

      if (isNestedArray) {
        const currentFieldValue = getFieldValue(
          innerStoreApi,
          fieldName as StringKeyOf<TFormFields>
        ) as unknown as any[]

        if (!Array.isArray(currentFieldValue) || !Array.isArray(newValue)) {
          return
        }

        const stepOfNestedArrayField = getStepByFieldName(
          innerStoreApi,
          fieldName as StringKeyOf<TFormFields>
        )

        const currentIndexes = currentFieldValue.map((_, i) => i)

        const incomingIndexMapping = (newValue as any[]).map((_, i) => i)

        incomingIndexMapping.forEach((incomingIndex, i) => {
          if (incomingIndex === currentIndexes[i]) {
            updateActionsToPerform.push({
              index: incomingIndex,
              nestedArrayItemValue: newValue[incomingIndex],
            })
            return
          }

          if (!currentIndexes.includes(incomingIndex)) {
            createActionsToPerform.push({
              index: incomingIndex,
              nestedArrayItemValue: newValue[incomingIndex],
            })
          }
        })

        currentIndexes.forEach((currentIndex) => {
          if (!incomingIndexMapping.includes(currentIndex)) {
            deleteActionsToPerform.push({ index: currentIndex })
          }
        })

        const parentNestedFieldComponentProperties =
          componentConfiguration.nestedArrayComponents?.map(
            (fc) => fc.name
          ) as string[]

        updateActionsToPerform.forEach(({ index, nestedArrayItemValue }) => {
          parentNestedFieldComponentProperties?.forEach(
            (nestedArrayItemProperty) => {
              const nestedArrayItemFieldName = getNestedArrayItemFieldName({
                parentFieldName: fieldName,
                index,
                nestedArrayItemProperty,
              })

              if (formStore.fields[nestedArrayItemFieldName]) {
                formStore.fields[nestedArrayItemFieldName].value =
                  nestedArrayItemValue[nestedArrayItemProperty]
              }
            }
          )
        })

        createActionsToPerform.forEach(({ index, nestedArrayItemValue }) => {
          for (const nestedArrayItemProperty in nestedArrayItemValue) {
            const nestedArrayItemFieldName = getNestedArrayItemFieldName({
              parentFieldName: fieldName,
              index,
              nestedArrayItemProperty,
            })

            const newNestedFieldComponent =
              componentConfiguration.nestedArrayComponents?.find(
                (fc) =>
                  fc.type === 'field' && fc.name === nestedArrayItemProperty
              ) as FormFieldComponent<TFormFields>

            if (
              stepOfNestedArrayField &&
              newNestedFieldComponent &&
              !formStore.fields[nestedArrayItemFieldName]
            ) {
              formStore.fields[
                nestedArrayItemFieldName as StringKeyOf<TFormFields>
              ] = getInitialField(
                {
                  ...newNestedFieldComponent,
                  name: nestedArrayItemFieldName as StringKeyOf<TFormFields>,
                },
                stepOfNestedArrayField,
                formId,
                nestedArrayItemValue[nestedArrayItemProperty]
              )
            }
          }
        })

        deleteActionsToPerform.forEach(({ index }) => {
          for (const nestedArrayItemProperty in currentFieldValue[index]) {
            const nestedArrayItemFieldName = getNestedArrayItemFieldName({
              parentFieldName: fieldName,
              index,
              nestedArrayItemProperty,
            })

            delete formStore.fields[nestedArrayItemFieldName]
            delete formStore.componentParams[
              getNestedArrayItemComponentParamsName({
                stepName: currentStep.name,
                nestedArrayItemFieldName,
              })
            ]
          }

          componentConfiguration.nestedArrayComponents?.forEach((nc) => {
            if (
              nc.type === 'ui' ||
              (nc.type === 'wrapper' && nc.wrapping === 'start')
            ) {
              const nestedArrayItemFieldName = getNestedArrayItemFieldName({
                parentFieldName: fieldName,
                index,
                nestedArrayItemProperty: nc.name,
              })

              delete formStore.componentParams[
                getNestedArrayItemComponentParamsName({
                  stepName: currentStep.name,
                  nestedArrayItemFieldName,
                })
              ]
            }
          })
        })

        return
      }

      if (
        parsedNestedArrayItemFieldName.isNestedArrayItem &&
        formStore.fields[parsedNestedArrayItemFieldName.parentFieldName]
      ) {
        const currentValues = formStore.fields[
          parsedNestedArrayItemFieldName.parentFieldName as StringKeyOf<TFormFields>
        ].value as Record<string, any>[]

        const newValues = currentValues.map((v, index) => {
          if (index === parsedNestedArrayItemFieldName.nestedItemIndex) {
            return {
              ...v,
              [parsedNestedArrayItemFieldName.nestedItemComponentName]:
                newValue,
            }
          }

          return v
        }) as TFormFields[StringKeyOf<TFormFields>]

        formStore.fields[
          parsedNestedArrayItemFieldName.parentFieldName as StringKeyOf<TFormFields>
        ].value = newValues
      }
    },
    false,
    getReduxDevtoolsDebugLabel(innerStoreApi.calledBy, {
      fieldName,
      newValue,
    })
  )

  if (shouldSetIsTouched) {
    setFieldIsTouched(innerStoreApi, fieldName as StringKeyOf<TFormFields>)
  }

  if (shouldSetIsDirty) {
    setFieldIsDirty(
      innerStoreApi,
      fieldName as StringKeyOf<TFormFields>,
      newValue
    )
  }

  createActionsToPerform.forEach(({ index }) => {
    componentConfiguration.nestedArrayComponents?.forEach((nc) => {
      if ((nc as FormWrapperComponent).wrapping !== 'end') {
        const nestedArrayItemFieldName = getNestedArrayItemFieldName({
          parentFieldName: fieldName,
          index,
          nestedArrayItemProperty: nc.name,
        })

        if (typeof nc.componentParams?.value === 'function') {
          triggerDynamicComponentParams(innerStoreApi, nestedArrayItemFieldName)
        } else {
          setComponentParams(
            innerStoreApi,
            nestedArrayItemFieldName,
            nc.componentParams || {}
          )
        }
      }
    })
  })

  if (shouldTriggerValidation) {
    triggerFieldValidation(
      innerStoreApi,
      parsedNestedArrayItemFieldName.parentFieldName as StringKeyOf<TFormFields>,
      { shouldFocusInvalidField: false }
    )
  }
}
