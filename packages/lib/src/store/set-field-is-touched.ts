import { InnerStoreApi, StringKeyOf } from '../types'
import { getReduxDevtoolsDebugLabel } from '../utils/get-redux-devtools-debug-label'
import { getField } from './get-field'
import { parseNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'

export const setFieldIsTouched = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  _innerStoreApi: InnerStoreApi<TFormFields>,
  fieldName: StringKeyOf<TFormFields>
) => {
  const innerStoreApi = {
    ..._innerStoreApi,
    calledBy: [...(_innerStoreApi.calledBy || []), 'setFieldIsTouched'],
  }

  const field = getField(innerStoreApi, fieldName)

  if (!field) {
    return
  }

  const { isNestedArrayItem, parentFieldName } =
    parseNestedArrayItemFieldName(fieldName)

  if (!field?.isTouched) {
    innerStoreApi.setStoreState(
      (formStore) => {
        formStore.fields[fieldName].isTouched = true

        if (isNestedArrayItem) {
          formStore.fields[
            parentFieldName as StringKeyOf<TFormFields>
          ].isTouched = true
        }
      },
      false,
      getReduxDevtoolsDebugLabel(innerStoreApi.calledBy, { fieldName })
    )
  }
}
