import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'primary' | 'secondary';
  // Internal link
  to?: string;
  // External link
  href?: string;
};

const MyButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'secondary',
  to,
  href,
}) => {
  const baseStyles =
    'group px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105';
  const variants = {
    primary:
      'bg-foreground text-background shadow-lg hover:shadow-purple-500/50',
    secondary:
      'border-2 border-foreground hover:bg-purple-200 dark:hover:bg-purple-800',
  };

  if (to) {
    return (
      <Link
        href={to}
        className={twMerge(baseStyles, variants[type], className)}
      >
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={twMerge(baseStyles, variants[type], className)}
        
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={twMerge(baseStyles, variants[type], className)}
    >
      {children}
    </button>
  );
};

export default MyButton;