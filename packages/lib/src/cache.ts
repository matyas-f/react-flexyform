import { DebouncedFunc } from 'lodash'
import { FormComponent, FormStore, Step } from './types'

export class AutoSaveCache {
  lastTriggerIdMap: Map<string, string> = new Map()
  lastTriggerAbortControllerMap: Map<string, AbortController> = new Map()
  debouncedFunctionMap: Map<
    string,
    DebouncedFunc<
      (params: Parameters<FormStore['triggerAutoSave']>[0]) => Promise<void>
    >
  > = new Map()

  setLastTriggerId(formId: string, triggerId: string) {
    this.lastTriggerIdMap.set(formId, triggerId)
  }

  getLastTriggerId(formId: string) {
    return this.lastTriggerIdMap.get(formId)
  }

  setLastTriggerAbortController(
    formId: string,
    abortController: AbortController
  ) {
    this.lastTriggerAbortControllerMap.set(formId, abortController)
  }

  getLastTriggerAbortController(formId: string) {
    return this.lastTriggerAbortControllerMap.get(formId)
  }

  clearLastTriggerAbortController(formId: string) {
    this.lastTriggerAbortControllerMap.delete(formId)
  }

  getDebouncedFunctionKey(formId: string, currentStepName: string) {
    return `${formId}-${currentStepName}`
  }

  setAndReturnDebouncedFunction(
    formId: string,
    currentStepName: string,
    debouncedFunction: DebouncedFunc<
      (params: Parameters<FormStore['triggerAutoSave']>[0]) => Promise<void>
    >
  ) {
    if (!this.getDebouncedFunction(formId, currentStepName)) {
      this.debouncedFunctionMap.set(
        this.getDebouncedFunctionKey(formId, currentStepName),
        debouncedFunction
      )
    }

    return this.getDebouncedFunction(formId, currentStepName)!
  }

  getDebouncedFunction(
    formId: string,
    currentStepName: string
  ):
    | DebouncedFunc<
        (params: Parameters<FormStore['triggerAutoSave']>[0]) => Promise<void>
      >
    | undefined {
    return this.debouncedFunctionMap.get(
      this.getDebouncedFunctionKey(formId, currentStepName)
    )
  }
}

export class SaveCache {
  lastTriggerIdMap: Map<string, string> = new Map()
  lastTriggerAbortControllerMap: Map<string, AbortController> = new Map()

  setLastTriggerId(formId: string, triggerId: string) {
    this.lastTriggerIdMap.set(formId, triggerId)
  }

  getLastTriggerId(formId: string) {
    return this.lastTriggerIdMap.get(formId)
  }

  setLastTriggerAbortController(
    formId: string,
    abortController: AbortController
  ) {
    this.lastTriggerAbortControllerMap.set(formId, abortController)
  }

  getLastTriggerAbortController(formId: string) {
    return this.lastTriggerAbortControllerMap.get(formId)
  }

  clearLastTriggerAbortController(formId: string) {
    this.lastTriggerAbortControllerMap.delete(formId)
  }
}

export class StepValidationCache {
  lastTriggerIdMap: Map<string, number> = new Map()
  lastTriggerAbortControllerMap: Map<string, AbortController> = new Map()
  syncValidationDebouncedFunctionMap: Map<
    string,
    DebouncedFunc<() => boolean>
  > = new Map()
  asyncValidationDebouncedFunctionMap: Map<
    string,
    DebouncedFunc<() => Promise<boolean>>
  > = new Map()

  setLastTriggerId(formId: string, stepName: string, triggerId: number) {
    this.lastTriggerIdMap.set(`${formId}-${stepName}`, triggerId)
  }

  getLastTriggerId(formId: string, stepName: string) {
    return this.lastTriggerIdMap.get(`${formId}-${stepName}`) || 0
  }

  setLastTriggerAbortController(
    formId: string,
    stepName: string,
    abortController: AbortController
  ) {
    this.lastTriggerAbortControllerMap.set(
      `${formId}-${stepName}`,
      abortController
    )
  }

  getLastTriggerAbortController(formId: string, stepName: string) {
    return this.lastTriggerAbortControllerMap.get(`${formId}-${stepName}`)
  }

  clearLastTriggerAbortController(formId: string, stepName: string) {
    this.lastTriggerAbortControllerMap.delete(`${formId}-${stepName}`)
  }

  getDebouncedFunctionKey(formId: string, stepName: string) {
    return `${formId}-${stepName}`
  }

  setAndReturnSyncDebouncedFunction(
    formId: string,
    stepName: string,
    debouncedFunction: DebouncedFunc<() => boolean>
  ) {
    const key = this.getDebouncedFunctionKey(formId, stepName)
    if (!this.getSyncDebouncedFunction(formId, stepName)) {
      this.syncValidationDebouncedFunctionMap.set(key, debouncedFunction)
    }
    return this.getSyncDebouncedFunction(formId, stepName)!
  }

  getSyncDebouncedFunction(formId: string, stepName: string) {
    return this.syncValidationDebouncedFunctionMap.get(
      this.getDebouncedFunctionKey(formId, stepName)
    )
  }

  setAndReturnAsyncDebouncedFunction(
    formId: string,
    stepName: string,
    debouncedFunction: DebouncedFunc<() => Promise<boolean>>
  ) {
    const key = this.getDebouncedFunctionKey(formId, stepName)
    if (!this.getAsyncDebouncedFunction(formId, stepName)) {
      this.asyncValidationDebouncedFunctionMap.set(key, debouncedFunction)
    }
    return this.getAsyncDebouncedFunction(formId, stepName)!
  }

  getAsyncDebouncedFunction(formId: string, stepName: string) {
    return this.asyncValidationDebouncedFunctionMap.get(
      this.getDebouncedFunctionKey(formId, stepName)
    )
  }
}

export class FieldValidationCache {
  lastTriggerIdMap: Map<string, number> = new Map()
  lastTriggerAbortControllerMap: Map<string, AbortController> = new Map()
  syncValidationDebouncedFunctionMap: Map<
    string,
    DebouncedFunc<() => string[]>
  > = new Map()
  asyncValidationDebouncedFunctionMap: Map<
    string,
    DebouncedFunc<() => Promise<boolean>>
  > = new Map()

  setLastTriggerId(
    formId: string,
    stepName: string,
    fieldName: string,
    triggerId: number
  ) {
    this.lastTriggerIdMap.set(`${formId}-${stepName}-${fieldName}`, triggerId)
  }

  getLastTriggerId(formId: string, stepName: string, fieldName: string) {
    return this.lastTriggerIdMap.get(`${formId}-${stepName}-${fieldName}`) || 0
  }

  setLastTriggerAbortController(
    formId: string,
    stepName: string,
    fieldName: string,
    abortController: AbortController
  ) {
    this.lastTriggerAbortControllerMap.set(
      `${formId}-${stepName}-${fieldName}`,
      abortController
    )
  }

  getLastTriggerAbortController(
    formId: string,
    stepName: string,
    fieldName: string
  ) {
    return this.lastTriggerAbortControllerMap.get(
      `${formId}-${stepName}-${fieldName}`
    )
  }

  clearLastTriggerAbortController(
    formId: string,
    stepName: string,
    fieldName: string
  ) {
    this.lastTriggerAbortControllerMap.delete(
      `${formId}-${stepName}-${fieldName}`
    )
  }

  setAndReturnSyncDebouncedFunction(
    formId: string,
    stepName: string,
    fieldName: string,
    debouncedFunction: DebouncedFunc<() => string[]>
  ) {
    if (!this.getSyncDebouncedFunction(formId, stepName, fieldName)) {
      this.syncValidationDebouncedFunctionMap.set(
        `${formId}-${stepName}-${fieldName}`,
        debouncedFunction
      )
    }
    return this.getSyncDebouncedFunction(formId, stepName, fieldName)!
  }

  getSyncDebouncedFunction(
    formId: string,
    stepName: string,
    fieldName: string
  ) {
    return this.syncValidationDebouncedFunctionMap.get(
      `${formId}-${stepName}-${fieldName}`
    )
  }

  setAndReturnAsyncDebouncedFunction(
    formId: string,
    stepName: string,
    fieldName: string,
    debouncedFunction: DebouncedFunc<() => Promise<boolean>>
  ) {
    if (!this.getAsyncDebouncedFunction(formId, stepName, fieldName)) {
      this.asyncValidationDebouncedFunctionMap.set(
        `${formId}-${stepName}-${fieldName}`,
        debouncedFunction
      )
    }
    return this.getAsyncDebouncedFunction(formId, stepName, fieldName)!
  }

  getAsyncDebouncedFunction(
    formId: string,
    stepName: string,
    fieldName: string
  ) {
    return this.asyncValidationDebouncedFunctionMap.get(
      `${formId}-${stepName}-${fieldName}`
    )
  }
}

export class DynamicComponentParamsCache {
  lastTriggerIdMap: Map<string, string> = new Map()
  lastTriggerAbortControllerMap: Map<string, AbortController> = new Map()

  setLastTriggerId(formId: string, componentName: string, triggerId: string) {
    this.lastTriggerIdMap.set(`${formId}-${componentName}`, triggerId)
  }

  getLastTriggerId(formId: string, componentName: string) {
    return this.lastTriggerIdMap.get(`${formId}-${componentName}`)
  }

  setLastTriggerAbortController(
    formId: string,
    componentName: string,
    abortController: AbortController
  ) {
    this.lastTriggerAbortControllerMap.set(
      `${formId}-${componentName}`,
      abortController
    )
  }

  getLastTriggerAbortController(formId: string, componentName: string) {
    return this.lastTriggerAbortControllerMap.get(`${formId}-${componentName}`)
  }

  clearLastTriggerAbortController(formId: string, componentName: string) {
    this.lastTriggerAbortControllerMap.delete(`${formId}-${componentName}`)
  }
}

export class FormStoreCache<
  TFormFields extends Record<string, any> = Record<string, any>,
> {
  autoSave: AutoSaveCache = new AutoSaveCache()
  save: SaveCache = new SaveCache()
  stepValidation: StepValidationCache = new StepValidationCache()
  fieldValidation: FieldValidationCache = new FieldValidationCache()
  dynamicComponentParams: DynamicComponentParamsCache =
    new DynamicComponentParamsCache()

  componentConfiguration: Map<string, FormComponent> = new Map()
  setInitialComponentConfigurations(steps: Step<TFormFields>[]) {
    steps.forEach((step) => {
      step.components.forEach((component) => {
        this.componentConfiguration.set(
          `${step.name}-${component.name}`,
          component
        )

        if (component.type === 'field' && component.nestedArrayComponents) {
          component.nestedArrayComponents.forEach((nestedComponent) => {
            this.componentConfiguration.set(
              `${step.name}-${component.name}.${nestedComponent.name}`,
              nestedComponent
            )
          })
        }
      })
    })
  }

  lastChangedField: string | null = null
}
