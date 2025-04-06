import {
  AutoSaveOptions,
  CreateFormStoreConfiguration,
  CreateStoreMultiStepConfiguration,
  CreateStoreSingleStepConfiguration,
  Step,
  StringKeyOf,
} from '../types'
import { getFirstDefined } from '../utils/get-first-defined'
import { getComponentDefaultNameFromMappingKey } from '../utils/name-generators'

export const DEFAULT_STEP_NAME = 'default-step'

export const getInitialStepsConfiguration = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  configuration: CreateFormStoreConfiguration<TFormFields>
): Step<TFormFields>[] => {
  const isSingleStep = !configuration.steps
  const singleStepConfiguration =
    configuration as CreateStoreSingleStepConfiguration<TFormFields>
  const multiStepConfiguration =
    configuration as CreateStoreMultiStepConfiguration<TFormFields>

  const steps = isSingleStep
    ? [
        {
          ...singleStepConfiguration,
          name: DEFAULT_STEP_NAME,
          validationOptions: {
            shouldFocusFirstInvalidField: getFirstDefined(
              configuration.validationOptions?.shouldFocusFirstInvalidField,
              true
            ) as boolean,
            validateFieldsOn: configuration.validationOptions
              ?.validateFieldsOn || ['fieldBlur', 'save', 'goToNextStep'],
            reValidateFieldsOn: [
              ...(configuration.validationOptions?.validateFieldsOn || [
                'fieldBlur',
                'save',
                'goToNextStep',
              ]),
              ...(configuration.validationOptions?.reValidateFieldsOn || [
                'fieldValueChange',
              ]),
            ],
            fieldValidationDebounceDurationInMs:
              configuration.validationOptions
                ?.fieldValidationDebounceDurationInMs ?? 0,
            fieldAsyncValidationDebounceDurationInMs:
              configuration.validationOptions
                ?.fieldAsyncValidationDebounceDurationInMs ?? 1000,
            validateStepOn: configuration.validationOptions?.validateStepOn || [
              'save',
              'goToNextStep',
            ],
            reValidateStepOn: [
              ...(configuration.validationOptions?.validateStepOn || [
                'save',
                'goToNextStep',
              ]),
              ...(configuration.validationOptions?.reValidateStepOn || [
                'fieldValueChange',
              ]),
            ],
            stepValidationDebounceDurationInMs:
              configuration.validationOptions
                ?.stepValidationDebounceDurationInMs ?? 0,
            stepAsyncValidationDebounceDurationInMs:
              configuration.validationOptions
                ?.stepAsyncValidationDebounceDurationInMs ?? 1000,
          },
          autoSaveOptions: {
            enabled: configuration.autoSaveOptions?.enabled || false,
            autoSaveIntervalInMs:
              configuration.autoSaveOptions?.autoSaveIntervalInMs ?? null,
            autoSaveOn: (configuration.autoSaveOptions
              ?.autoSaveOn as AutoSaveOptions<TFormFields>['autoSaveOn']) || [
              'fieldValueChange',
            ],
            autoSaveDebounceDurationInMs:
              configuration.autoSaveOptions?.autoSaveDebounceDurationInMs ??
              1000,
            ignoreValidation:
              configuration.autoSaveOptions?.ignoreValidation || false,
          },
          components: singleStepConfiguration.components.map((component) => {
            const componentName =
              component.name ||
              getComponentDefaultNameFromMappingKey(
                component.formComponentMappingKey
              )

            if (component.type === 'field') {
              return {
                ...component,
                name: componentName as StringKeyOf<TFormFields>,
                nestedArrayComponents: component.nestedArrayComponents?.map(
                  (nestedArrayComponent) => ({
                    ...nestedArrayComponent,
                    name:
                      nestedArrayComponent.name ||
                      getComponentDefaultNameFromMappingKey(
                        nestedArrayComponent.formComponentMappingKey
                      ),
                    nestedArrayComponents: undefined,
                  })
                ),
              }
            }

            return {
              ...component,
              name: componentName,
            }
          }),
        },
      ]
    : multiStepConfiguration.steps.map<Step<TFormFields>>((step) => {
        return {
          ...step,
          validationOptions: {
            shouldFocusFirstInvalidField: getFirstDefined(
              step.validationOptions?.shouldFocusFirstInvalidField,
              configuration.validationOptions?.shouldFocusFirstInvalidField,
              true
            ) as boolean,
            validateFieldsOn: step.validationOptions?.validateFieldsOn ||
              configuration.validationOptions?.validateFieldsOn || [
                'fieldBlur',
                'save',
                'goToNextStep',
              ],
            reValidateFieldsOn: [
              ...(step.validationOptions?.validateFieldsOn ||
                configuration.validationOptions?.validateFieldsOn || [
                  'fieldBlur',
                  'save',
                  'goToNextStep',
                ]),
              ...(step.validationOptions?.reValidateFieldsOn ||
                configuration.validationOptions?.reValidateFieldsOn || [
                  'fieldValueChange',
                ]),
            ],
            fieldValidationDebounceDurationInMs:
              step.validationOptions?.fieldValidationDebounceDurationInMs ??
              configuration.validationOptions
                ?.fieldValidationDebounceDurationInMs ??
              0,
            fieldAsyncValidationDebounceDurationInMs:
              step.validationOptions
                ?.fieldAsyncValidationDebounceDurationInMs ??
              configuration.validationOptions
                ?.fieldAsyncValidationDebounceDurationInMs ??
              1000,
            validateStepOn: step.validationOptions?.validateStepOn ||
              configuration.validationOptions?.validateStepOn || [
                'save',
                'goToNextStep',
              ],
            reValidateStepOn: [
              ...(step.validationOptions?.validateStepOn ||
                configuration.validationOptions?.validateStepOn || [
                  'save',
                  'goToNextStep',
                ]),
              ...(step.validationOptions?.reValidateStepOn ||
                configuration.validationOptions?.reValidateStepOn || [
                  'fieldValueChange',
                ]),
            ],
            stepValidationDebounceDurationInMs:
              step.validationOptions?.stepValidationDebounceDurationInMs ??
              configuration.validationOptions
                ?.stepValidationDebounceDurationInMs ??
              0,
            stepAsyncValidationDebounceDurationInMs:
              step.validationOptions?.stepAsyncValidationDebounceDurationInMs ??
              configuration.validationOptions
                ?.stepAsyncValidationDebounceDurationInMs ??
              1000,
          },
          autoSaveOptions: {
            enabled:
              step.autoSaveOptions?.enabled ||
              configuration.autoSaveOptions?.enabled ||
              false,
            autoSaveIntervalInMs:
              step.autoSaveOptions?.autoSaveIntervalInMs ??
              configuration.autoSaveOptions?.autoSaveIntervalInMs ??
              null,
            autoSaveOn: step.autoSaveOptions?.autoSaveOn ||
              (configuration.autoSaveOptions
                ?.autoSaveOn as AutoSaveOptions<TFormFields>['autoSaveOn']) || [
                'fieldValueChange',
              ],
            autoSaveDebounceDurationInMs:
              step.autoSaveOptions?.autoSaveDebounceDurationInMs ??
              configuration.autoSaveOptions?.autoSaveDebounceDurationInMs ??
              1000,
            ignoreValidation:
              step.autoSaveOptions?.enabled ||
              configuration.autoSaveOptions?.ignoreValidation ||
              false,
          },
          components: step.components.map((component) => {
            const componentName =
              component.name ||
              getComponentDefaultNameFromMappingKey(
                component.formComponentMappingKey
              )

            if (component.type === 'field') {
              return {
                ...component,
                name: componentName as StringKeyOf<TFormFields>,
                nestedArrayComponents: component.nestedArrayComponents?.map(
                  (nestedArrayComponent) => ({
                    ...nestedArrayComponent,
                    name:
                      nestedArrayComponent.name ||
                      getComponentDefaultNameFromMappingKey(
                        nestedArrayComponent.formComponentMappingKey
                      ),
                    nestedArrayComponents: undefined,
                  })
                ),
              }
            }

            return {
              ...component,
              name: componentName,
            }
          }),
        }
      })

  return steps
}
