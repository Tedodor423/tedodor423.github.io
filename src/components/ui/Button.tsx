import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
}

const clip =
  'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)';

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand-yellow text-ink hover:brightness-105 active:brightness-95',
  secondary: 'bg-navy-tint text-paper hover:bg-navy-tint/80 border border-paper/15',
  ghost: 'bg-transparent text-paper hover:bg-paper/10 border border-paper/20',
};

/** Shared with any non-<button> element (e.g. an <a>) that needs to look
 * like a Button without going through the button element itself. */
export function buttonClassName(variant: NonNullable<ButtonProps['variant']> = 'primary', className = ''): string {
  return `data-text inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-[filter,background-color] duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`;
}

export const buttonClipStyle = { clipPath: clip };

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button className={buttonClassName(variant, className)} style={buttonClipStyle} {...rest}>
      {children}
    </button>
  );
}
