import { Field, FormFieldComponent, Step } from '../types'
import { getFieldId } from '../utils/name-generators'

export const getInitialField = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  field: FormFieldComponent<TFormFields>,
  step: Step<TFormFields>,
  formId: string,
  defaultValue?: any
): Field<any> => {
  const isFieldNestedArray = Array.isArray(field.nestedArrayComponents)
  let initialValue: any = isFieldNestedArray ? [] : ''

  if (defaultValue !== undefined) {
    initialValue = defaultValue
  } else if (field.defaultValue !== undefined) {
    initialValue = field.defaultValue
  }

  if (isFieldNestedArray && !Array.isArray(initialValue)) {
    initialValue = []
  }

  return {
    id: getFieldId({ stepName: step.name, fieldName: field.name, formId }),
    stepName: step.name,
    name: field.name,
    initialValue,
    stepInitialValue: initialValue,
    value: initialValue,
    previousValue: undefined,
    isTouched: false,
    isDirty: false,
    isValidating: false,
    validationError: null,
    didPassAsyncValidation: false,
    didTriggerRevalidationMode: false,
    lastValidatedValue: null,
  }
}
