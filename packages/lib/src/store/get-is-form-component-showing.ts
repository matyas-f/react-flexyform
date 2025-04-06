import { isEqual } from 'lodash'
import { FormComponent, FormStore, InnerStoreApi, StringKeyOf } from '../types'
import { parseNestedArrayItemFieldName } from '../utils/parse-nested-array-item-field-name'
import { getResolvedMediaQuery } from '../utils/get-resolved-media-query'

export const getIsFormComponentShowing = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>,
  ...[formComponentName, options = {}]: Parameters<
    FormStore['getIsFormComponentShowing']
  >
) => {
  const { shouldConsiderScreenSize = false } = options

  const formStore = innerStoreApi.getStoreState()

  const {
    isNestedArrayItem,
    parentFieldName,
    nestedItemIndex,
    nestedItemComponentName,
  } = parseNestedArrayItemFieldName(formComponentName)

  let formComponent: FormComponent<TFormFields> | null = null

  for (const step of formStore.configuration.steps) {
    if (formComponent) {
      break
    }

    for (const component of step.components) {
      if (formComponent) {
        break
      }

      if (
        isNestedArrayItem &&
        component.type === 'field' &&
        component.nestedArrayComponents &&
        component.name === parentFieldName
      ) {
        for (const nestedArrayComponent of component.nestedArrayComponents) {
          if (nestedArrayComponent.name === nestedItemComponentName) {
            formComponent = nestedArrayComponent as FormComponent<TFormFields>
            break
          }
        }
      }

      if (component.name === formComponentName) {
        formComponent = component
      }
    }
  }

  if (!formComponent) {
    return false
  }

  if (!formComponent.shouldShowOnlyIf) {
    return true
  }

  if (
    typeof window !== 'undefined' &&
    'matchMedia' in window &&
    shouldConsiderScreenSize
  ) {
    const resolvedMediaQuery = getResolvedMediaQuery(
      formComponent.shouldShowOnlyIfMediaQueryMatches ||
        formComponent.shouldShowOnlyOnScreenSize ||
        null
    )

    if (resolvedMediaQuery && !window.matchMedia(resolvedMediaQuery).matches) {
      return false
    }
  }

  if (typeof formComponent.shouldShowOnlyIf?.value === 'function') {
    return formComponent.shouldShowOnlyIf.value(nestedItemIndex)
  }

  const shouldShow = Object.keys(formComponent.shouldShowOnlyIf).every(
    (fieldName) => {
      if (
        formComponent &&
        isEqual(
          (
            formComponent.shouldShowOnlyIf as Partial<
              Record<Extract<keyof TFormFields, string>, any>
            >
          )[fieldName],
          formStore.getFieldValue(fieldName as StringKeyOf<TFormFields>)
        )
      ) {
        return true
      }

      return false
    }
  )

  return shouldShow
}
