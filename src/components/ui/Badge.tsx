import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'white';
}

export const Badge = ({ className, variant = 'primary', ...props }: BadgeProps) => {
  const variants = {
    primary: 'bg-neo-red text-white',
    secondary: 'bg-neo-blue text-white',
    dark: 'bg-neo-black text-white',
    white: 'bg-white text-neo-black',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 font-black text-xs uppercase tracking-widest border-4 border-neo-black shadow-neo-sm',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
