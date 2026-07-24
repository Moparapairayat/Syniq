export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonStyleOptions {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function getButtonClassName(
  optionsOrVariant?: ButtonStyleOptions | ButtonVariant,
  sizeArg: ButtonSize = 'md',
): string {
  let variant: ButtonVariant = 'primary'
  let size: ButtonSize = sizeArg

  if (typeof optionsOrVariant === 'object' && optionsOrVariant !== null) {
    variant = optionsOrVariant.variant || 'primary'
    size = optionsOrVariant.size || 'md'
  } else if (typeof optionsOrVariant === 'string') {
    variant = optionsOrVariant
  }

  const base = 'inline-flex items-center justify-center rounded-xl font-black uppercase tracking-wider transition-transform active:translate-y-0.5 cursor-pointer outline-none select-none'
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs',
    lg: 'px-6 py-3.5 text-sm',
  }
  const variants = {
    primary: 'border border-[#78350f] bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] text-[#3a1d0d] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_3px_0_#78350f]',
    secondary: 'border border-[#5a341a] bg-gradient-to-b from-[#9e5d2b] to-[#5a2e12] text-[#fff3cd] shadow-[inset_0_1px_0_rgba(255,226,162,0.4),0_2px_0_#2b1408]',
    danger: 'border border-[#78281a] bg-gradient-to-b from-[#c93b2b] via-[#a82416] to-[#6e140b] text-[#ffe49e] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_0_#4a0d06]',
    ghost: 'bg-transparent text-[#ffe49e] hover:bg-white/10',
  }
  return `${base} ${sizes[size]} ${variants[variant]}`
}
