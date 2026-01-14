'use client';

import { ButtonHTMLAttributes, forwardRef, MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { useRippleEffect } from '@/lib/hooks/useRippleEffect';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  enableRipple?: boolean;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    className, 
    variant = 'ghost', 
    size = 'md', 
    enableRipple = true,
    onClick,
    children,
    ...props 
  }, ref) => {
    const { setContainerRef, triggerCenterRipple } = useRippleEffect({
      color: variant === 'solid' ? 'rgba(255, 255, 255, 0.3)' : 'currentColor',
      size: 80,
      duration: 0.6,
      opacity: 0.2
    });

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (enableRipple) {
        triggerCenterRipple();
      }
      onClick?.(e);
    };

    const variants = {
      ghost: 'text-[var(--tn-fg-muted)] hover:bg-[var(--tn-bg-lighter)] hover:text-[var(--tn-fg)]',
      solid: 'bg-[var(--tn-bg-lighter)] text-[var(--tn-fg)] hover:bg-[var(--tn-bg-light)]',
      outline: 'border border-[var(--tn-bg-lighter)] text-[var(--tn-fg-muted)] hover:border-[var(--tn-fg-muted)] hover:text-[var(--tn-fg)]',
    };

    const sizes = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
    };

    return (
      <button
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          setContainerRef(node);
        }}
        className={cn(
          'relative overflow-hidden rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--tn-primary)]',
          variants[variant],
          sizes[size],
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <span className="relative z-10 block">
          {children}
        </span>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
