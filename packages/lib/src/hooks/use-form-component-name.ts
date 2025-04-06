import { useContext } from 'react'
import { FormComponentNameContext } from '../components/form-component-name-context'

export const useFormComponentName = () =>
  useContext(FormComponentNameContext).formComponentName

export const useNestedArrayItemInfo = () =>
  useContext(FormComponentNameContext).nestedArrayItemInfo
