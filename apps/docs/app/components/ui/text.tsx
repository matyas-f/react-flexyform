import React, { ReactNode } from 'react'
import { cn } from '../../../utils/cn'

type Props = {
  className?: string
  children: ReactNode
}

const Text = (props: Props) => {
  return (
    <span className={cn(props.className, 'font-semibold inline text-[13px]')}>
      {props.children}
    </span>
  )
}

export default Text
