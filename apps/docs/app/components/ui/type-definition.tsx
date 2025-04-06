import { cn } from '../../../utils/cn'

type Props = {
  containerClassName?: string
  typeDefinition: string
}

export const TypeDefinition = (props: Props) => {
  return (
    <span
      className={cn(
        props.containerClassName,
        'bg-slate-100 font-semibold text-gray-700'
      )}
    >
      {props.typeDefinition}
    </span>
  )
}
