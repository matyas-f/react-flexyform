import {
  MantineFormComponentsContext,
  MantineKitFieldComponentMappingsInterface,
  MantineKitUiComponentMappingsInterface,
  MantineKitWrapperComponentMappingsInterface,
  MantineComponentWrapperParams,
} from '@react-flexyform/form-components'
import '../index.css'

declare global {
  interface FormFieldComponentMappings
    extends MantineKitFieldComponentMappingsInterface {}

  interface FormUiComponentMappings
    extends MantineKitUiComponentMappingsInterface {
    termsAndConditions: {}
  }

  interface FormWrapperComponentMappings
    extends MantineKitWrapperComponentMappingsInterface {}

  interface FormContext extends MantineFormComponentsContext {}

  interface ComponentWrapperParams extends MantineComponentWrapperParams {}
}
