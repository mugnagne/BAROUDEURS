import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-neo-red text-white hover:bg-neo-red/90',
      secondary: 'bg-neo-blue text-white',
      outline: 'bg-white text-neo-black',
      ghost: 'bg-transparent text-neo-black border-transparent hover:border-neo-black shadow-none hover:shadow-neo-sm',
    };

    const borders = variant === 'ghost' ? 'border-4 border-transparent hover:border-neo-black' : 'border-4 border-neo-black';
    const shadows = variant === 'ghost' ? '' : 'shadow-neo-sm hover:shadow-neo-md';
    
    const sizes = {
      sm: 'h-10 px-4 text-xs',
      md: 'h-12 px-6 text-sm',
      lg: 'h-14 px-8 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-bold uppercase tracking-wide transition-all duration-100 ease-linear',
          variants[variant],
          sizes[size],
          borders,
          shadows,
          'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neo-blue',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
