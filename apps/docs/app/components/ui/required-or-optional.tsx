import React from 'react'
import { cn } from '../../../utils/cn'

type Props = {
  containerClassName?: string
  default?: string
  type: 'required' | 'optional'
  extraText?: string
}

const RequiredOrOptional = (props: Props) => {
  if (props.type === 'required') {
    return (
      <>
        <span
          className={cn(
            'inline-flex px-[3px] bg-red-300 text-red-800 text-[13px] rounded-[5px] border-red-400 border',
            props.containerClassName
          )}
        >
          required{props.extraText ? ` ${props.extraText}` : null}
        </span>
        {props.default && (
          <span
            className={cn(
              'ml-1 inline-flex px-[3px] bg-gray-100 text-gray-600 text-[13px] rounded-[5px] border-gray-300 border',
              props.containerClassName
            )}
          >
            default: {props.default}
          </span>
        )}
      </>
    )
  }

  if (props.type === 'optional') {
    return (
      <>
        <span
          className={cn(
            'inline-flex px-[3px] bg-gray-100 text-gray-600 text-[13px] rounded-[5px] border-gray-300 border',
            props.containerClassName
          )}
        >
          optional
        </span>
        {props.default && (
          <span
            className={cn(
              'ml-1 inline-flex px-[3px] bg-gray-100 text-gray-600 text-[13px] rounded-[5px] border-gray-300 border',
              props.containerClassName
            )}
          >
            default: {props.default}
          </span>
        )}
      </>
    )
  }

  return null
}

export default RequiredOrOptional
