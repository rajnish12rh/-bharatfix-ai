import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

type BaseProps = {
  variant?: Variant
  children: ReactNode
  className?: string
}

type ButtonAsLink = BaseProps & {
  to: string
  onClick?: () => void
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: undefined
  }

const variantClass: Record<Variant, string> = {
  primary:
    'bg-navy-900 text-white shadow-sm hover:bg-navy-800 focus-visible:outline-navy-700',
  secondary:
    'border border-navy-200 bg-white text-navy-900 hover:bg-navy-50 focus-visible:outline-navy-600',
  ghost:
    'text-navy-800 hover:bg-navy-50 focus-visible:outline-navy-600',
}

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = 'primary', children, className } = props
  const classes = cn(baseClass, variantClass[variant], className)

  if (props.to) {
    return (
      <Link to={props.to} className={classes} onClick={props.onClick}>
        {children}
      </Link>
    )
  }

  const {
    variant: _variant,
    children: _children,
    className: _className,
    to: _to,
    ...buttonProps
  } = props
  void _variant
  void _children
  void _className
  void _to

  return (
    <button type="button" {...buttonProps} className={classes}>
      {children}
    </button>
  )
}
