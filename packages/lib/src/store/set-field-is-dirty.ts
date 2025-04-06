import isEqual from 'fast-deep-equal'
import { InnerStoreApi, StringKeyOf } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { getField } from './get-field'
import { parseNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'

export const setFieldIsDirty = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  fieldName: StringKeyOf<TFormFields>,
  newFieldValue: any
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'setFieldIsDirty'],
  }

  const field = getField(innerStoreApi, fieldName)

  if (!field) {
    return
  }

  const { isNestedArrayItem, parentFieldName } =
    parseNestedArrayItemFieldName(fieldName)

  if (!field.isDirty && !isEqual(newFieldValue, field.stepInitialValue)) {
    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.fields[fieldName].isDirty = true

        if (isNestedArrayItem) {
          formStore.fields[
            parentFieldName as StringKeyOf<TFormFields>
          ].isDirty = true
        }
      },
      false,
      getReduxDevtoolsDebugLabel(innerStoreApi.calledBy, {
        fieldName,
        newFieldValue,
      })
    )
  }

  if (field.isDirty && isEqual(newFieldValue, field.stepInitialValue)) {
    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.fields[fieldName].isDirty = false
      },
      false,
      getReduxDevtoolsDebugLabel(innerStoreApi.calledBy, {
        fieldName,
        newFieldValue,
      })
    )
  }
}
