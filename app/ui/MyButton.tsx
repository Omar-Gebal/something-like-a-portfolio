import clsx from 'clsx';
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'primary' | 'secondary';
  href?: string; // ✅ add href support
};

const MyButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'secondary',
  href,
}) => {
  const baseStyles =
    'group px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105';
  const variants = {
    primary:
      'bg-foreground text-background shadow-lg hover:shadow-purple-500/50',
    secondary: 'border-2 border-black-400 hover:bg-gray-200',
  };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(baseStyles, variants[type], className)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseStyles, variants[type], className)}
    >
      {children}
    </button>
  );
};

export default MyButton;
