import { cn } from '../../../utils/cn'

type Props = {
  containerClassName?: string
  defaultValue: string
}

const DefaultValue = (props: Props) => {
  return (
    <span
      className={cn(
        props.containerClassName,
        'bg-slate-100 font-semibold text-gray-700'
      )}
    >
      {props.defaultValue}
    </span>
  )
}

export default DefaultValue
