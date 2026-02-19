import { motion } from 'motion/react';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function AnimatedButton({ children, variant = 'primary', className = '', ...props }: AnimatedButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white",
    secondary: "bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] hover:bg-purple-500/10",
    outline: "border border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] hover:bg-purple-500/10 hover:border-purple-500/50"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
