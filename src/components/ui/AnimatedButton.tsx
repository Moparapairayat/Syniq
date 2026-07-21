import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { getButtonClassName, type ButtonSize, type ButtonVariant } from './buttonStyles'

export interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  readonly size?: ButtonSize
  readonly variant?: ButtonVariant
  readonly children: ReactNode
}

/**
 * Reusable premium button combining framer motion animations and standard styling classes.
 * Gracefully respects user Reduced Motion system configurations.
 */
export function AnimatedButton({
  className,
  size = 'md',
  type = 'button',
  variant = 'primary',
  children,
  ...props
}: AnimatedButtonProps) {
  const shouldReduceMotion = useReducedMotion()

  const hoverAnimation = shouldReduceMotion ? {} : { scale: 1.015 }
  const tapAnimation = shouldReduceMotion ? {} : { scale: 0.985 }

  return (
    <motion.button
      className={getButtonClassName({ className, size, variant })}
      type={type}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      {...props}
    >
      {children}
    </motion.button>
  )
}
