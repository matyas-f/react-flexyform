export const typeSafeFieldComponent = <
  TMappings extends Record<string, any> = FormFieldComponentMappings,
  TComponentName extends keyof TMappings = string,
>(fieldComponentConfiguration: {
  formComponentMappingKey: TComponentName
  componentParams:
    | (TMappings[TComponentName] & ComponentWrapperParams)
    | {
        value: (
          nestedArrayItemIndex?: number
        ) =>
          | Promise<TMappings[TComponentName] & ComponentWrapperParams>
          | (TMappings[TComponentName] & ComponentWrapperParams)
        staticPart?: never
        dependencies?: () => any[]
      }
    | {
        value: (
          nestedArrayItemIndex?: number
        ) =>
          | Partial<Promise<TMappings[TComponentName] & ComponentWrapperParams>>
          | Partial<TMappings[TComponentName] & ComponentWrapperParams>
        staticPart?: Partial<TMappings[TComponentName] & ComponentWrapperParams>
        dependencies?: () => any[]
      }
}) => {
  return { type: 'field', ...fieldComponentConfiguration } as const
}

export const typeSafeUiComponent = <
  TMappings extends Record<string, any> = FormUiComponentMappings,
  TComponentName extends keyof TMappings = string,
>(uiComponentConfiguration: {
  formComponentMappingKey: TComponentName
  componentParams:
    | (TMappings[TComponentName] & ComponentWrapperParams)
    | {
        value: (
          nestedArrayItemIndex?: number
        ) =>
          | Promise<TMappings[TComponentName] & ComponentWrapperParams>
          | (TMappings[TComponentName] & ComponentWrapperParams)
        staticPart?: never
        dependencies?: () => any[]
      }
    | {
        value: (
          nestedArrayItemIndex?: number
        ) =>
          | Partial<Promise<TMappings[TComponentName] & ComponentWrapperParams>>
          | Partial<TMappings[TComponentName] & ComponentWrapperParams>
        staticPart?: Partial<TMappings[TComponentName] & ComponentWrapperParams>
        dependencies?: () => any[]
      }
}) => {
  return { type: 'ui', ...uiComponentConfiguration } as const
}

export const typeSafeWrapperComponent = <
  TMappings extends Record<string, any> = FormWrapperComponentMappings,
  TComponentName extends keyof TMappings = string,
>(wrapperComponentConfiguration: {
  formComponentMappingKey: TComponentName
  componentParams:
    | TMappings[TComponentName]
    | {
        value: (
          nestedArrayItemIndex?: number
        ) => Promise<TMappings[TComponentName]> | TMappings[TComponentName]
        staticPart?: never
        dependencies?: () => any[]
      }
    | {
        value: (
          nestedArrayItemIndex?: number
        ) =>
          | Partial<Promise<TMappings[TComponentName] & ComponentWrapperParams>>
          | Partial<TMappings[TComponentName] & ComponentWrapperParams>
        staticPart?: Partial<TMappings[TComponentName] & ComponentWrapperParams>
        dependencies?: () => any[]
      }
}) => {
  return {
    type: 'wrapper',
    ...wrapperComponentConfiguration,
  } as const
}
