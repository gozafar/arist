import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, variant = 'primary', className, ...rest }: ButtonProps) => {
  return (
    <button className={clsx(variant === 'primary' ? 'button-primary' : 'button-outline', className)} {...rest}>
      {children}
    </button>
  );
};

export default Button;
