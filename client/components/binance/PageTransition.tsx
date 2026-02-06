import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PageTransitionProps {
  children?: ReactNode;
  className?: string;
}

// Page transition variants for smooth navigation
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

/**
 * Page transition wrapper component
 * Provides smooth fade + slide animation for route changes
 */
export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  // Define transition timing
  const pageTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        type: 'tween' as const,
        ease: [0.6, -0.05, 0.01, 0.99],
        duration: 0.4,
      };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
