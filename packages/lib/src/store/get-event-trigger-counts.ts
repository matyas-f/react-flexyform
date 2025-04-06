import { FormControlEventEntry, InnerStoreApi } from '../types'

export const getEventTriggerCounts = <
  TFormFields extends Record<string, any> = Record<string, any>,
>(
  innerStoreApi: InnerStoreApi<TFormFields>
) => {
  const getResult = () => {
    const { eventHistory, currentStepName } = innerStoreApi.getStoreState()

    const reversedEventHistory = [...eventHistory].reverse()
    const currentStepEvents: FormControlEventEntry[] = []

    let shouldContinue = true
    let idx = 0

    while (shouldContinue) {
      const eventHistoryEntry = reversedEventHistory[idx]

      if (
        !eventHistoryEntry ||
        eventHistoryEntry.stepName !== currentStepName
      ) {
        shouldContinue = false
      } else {
        currentStepEvents.unshift(eventHistoryEntry)
      }

      idx += 1
    }

    let saveEventTriggerCount = 0
    let nextEventTriggerCount = 0
    let goToStepEventTriggerCount = 0
    let previousEventTriggerCount = 0
    let submitEventTriggerCount = 0

    currentStepEvents.forEach((event) => {
      switch (event.type) {
        case 'save':
          saveEventTriggerCount += 1
          break

        case 'goToNextStep':
          nextEventTriggerCount += 1
          break

        case 'goToStep':
          goToStepEventTriggerCount += 1
          break

        case 'goToPreviousStep':
          previousEventTriggerCount += 1
          break

        case 'submit':
          submitEventTriggerCount += 1
          break

        default:
          break
      }
    })

    return {
      eventTriggerCounts: {
        save: saveEventTriggerCount,
        goToNextStep: nextEventTriggerCount,
        goToPreviousStep: previousEventTriggerCount,
        submit: submitEventTriggerCount,
        goToStep: goToStepEventTriggerCount,
      },
    }
  }

  return getResult().eventTriggerCounts
}
