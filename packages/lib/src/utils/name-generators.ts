import { nanoid } from 'nanoid'

export const getNestedArrayItemFieldName = ({
  parentFieldName,
  index,
  nestedArrayItemProperty,
}: {
  parentFieldName: string
  index: number
  nestedArrayItemProperty: string
}) => {
  return `${parentFieldName}[${index}].${nestedArrayItemProperty}`
}

export const getComponentParamsName = ({
  stepName,
  componentName,
  withNanoId,
}: {
  stepName: string
  componentName: string
  withNanoId?: boolean
}) => {
  return `${stepName}-${componentName}${withNanoId ? `-${nanoid()}` : ''}`
}

export const getNestedArrayItemComponentParamsName = ({
  stepName,
  nestedArrayItemFieldName,
  withNanoId,
}: {
  stepName: string
  nestedArrayItemFieldName: string
  withNanoId?: boolean
}) => {
  return `${stepName}-${nestedArrayItemFieldName}${withNanoId ? `-${nanoid()}` : ''}`
}

export const getComponentDefaultNameFromMappingKey = (
  componentMappingKey: string
) => {
  return `${componentMappingKey}-${nanoid()}`
}

export const getFieldId = ({
  stepName,
  fieldName,
  formId,
}: {
  stepName: string
  fieldName: string
  formId: string
}) => {
  return `rff-${formId}-${stepName}-${fieldName}`
}
