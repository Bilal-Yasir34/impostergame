import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { playSound } from '@/lib/sound';
import { useSettings } from '@/context/SettingsContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', children, fullWidth, onClick, className = '', ...rest }: ButtonProps) {
  const { settings } = useSettings();

  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }[variant];

  return (
    <button
      className={`${variantClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={(e) => {
        if (settings.soundEnabled) playSound('click');
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
