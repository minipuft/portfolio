'use client';

import { ButtonHTMLAttributes, forwardRef, MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { useRippleEffect } from '@/lib/hooks/useRippleEffect';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  enableRipple?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    enableRipple = true,
    children, 
    onClick,
    ...props 
  }, ref) => {
    const { setContainerRef, triggerRipple } = useRippleEffect({
      color: variant === 'outline' || variant === 'ghost' ? 'currentColor' : 'rgba(255, 255, 255, 0.3)',
      size: 100,
      duration: 0.8
    });

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (enableRipple && !loading) {
        triggerRipple(e.clientX, e.clientY);
      }
      onClick?.(e);
    };

    const variants = {
      primary: 'bg-[var(--tn-primary)] text-white hover:opacity-90 active:scale-[0.98]',
      secondary: 'bg-[var(--tn-secondary)] text-white hover:opacity-90 active:scale-[0.98]',
      outline: 'border border-[var(--tn-primary)] text-[var(--tn-primary)] hover:bg-[var(--tn-primary)]/10 active:scale-[0.98]',
      ghost: 'text-[var(--tn-fg-muted)] hover:text-[var(--tn-primary)] hover:bg-[var(--tn-primary)]/10',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={(node) => {
            // Handle both refs
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
            // Internal ref for ripple
            setContainerRef(node);
        }}
        className={cn(
          'relative overflow-hidden rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--tn-primary)] focus:ring-offset-2 focus:ring-offset-[var(--tn-bg-dark)]',
          variants[variant],
          sizes[size],
          loading && 'cursor-not-allowed opacity-70',
          className
        )}
        onClick={handleClick}
        disabled={loading || props.disabled}
        {...props}
      >
        <span className={cn('relative z-10 flex items-center justify-center gap-2', loading && 'invisible')}>
          {children}
        </span>
        
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
