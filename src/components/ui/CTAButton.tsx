import React from 'react';

export interface CTAButtonProps {
  variant: 'golden-primary' | 'golden-secondary' | 'white-primary' | 'white-secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const CTAButton: React.FC<CTAButtonProps> = ({
  variant,
  size = 'md',
  children,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}) => {
  // Size configurations
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs sm:text-sm',
    md: 'px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base',
    lg: 'px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg',
  };

  // Variant classes
  const variantClasses = {
    'golden-primary': 'cta-btn-golden-primary',
    'golden-secondary': 'cta-btn-golden-secondary',
    'white-primary': 'cta-btn-white-primary',
    'white-secondary': 'cta-btn-white-secondary',
  };

  const baseClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    font-semibold
    transition-all
    duration-300
    ease-in-out
    cursor-pointer
    disabled:opacity-50
    disabled:cursor-not-allowed
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default CTAButton;
