import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  to?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, to, ...props }, ref) => {
    const Component = to ? Link : 'div';
    
    return (
      <Component
        to={to as any}
        ref={ref as any}
        className={cn(
          'block bg-white border-4 border-neo-black shadow-neo-md transition-all duration-200',
          'hover:-translate-y-2 hover:shadow-neo-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neo-blue',
          to ? 'cursor-pointer' : '',
          className
        )}
        {...props as any}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';
