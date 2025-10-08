'use client'

import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-md hover:shadow-lg',
        destructive: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 shadow-md hover:shadow-lg',
        outline: 'border border-primary-200 bg-transparent text-primary-600 hover:bg-primary-50 hover:border-primary-300 dark:border-primary-700 dark:text-primary-400 dark:hover:bg-primary-900/20 dark:hover:border-primary-600',
        secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-300 dark:bg-secondary-800 dark:text-secondary-100 dark:hover:bg-secondary-700',
        ghost: 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 dark:text-secondary-400 dark:hover:bg-secondary-800 dark:hover:text-secondary-100',
        link: 'text-primary-600 underline-offset-4 hover:underline dark:text-primary-400',
        gradient: 'bg-gradient-primary text-white hover:shadow-glow active:scale-95',
        accent: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-md hover:shadow-lg',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      width: {
        default: 'w-auto',
        full: 'w-full',
        fit: 'w-fit',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      width: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, width, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, width, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }