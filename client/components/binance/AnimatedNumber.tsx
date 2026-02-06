import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedNumberProps {
  value: number;
  format?: (val: number) => string;
  className?: string;
  decimals?: number;
  duration?: number;
}

/**
 * Animated number component with smooth count-up effect
 * Uses Framer Motion spring animation for natural feel
 */
export default function AnimatedNumber({
  value,
  format,
  className = '',
  decimals = 2,
  duration = 1000,
}: AnimatedNumberProps) {
  const prefersReducedMotion = useReducedMotion();
  const prevValue = useRef(value);

  // Spring animation for smooth counting
  const spring = useSpring(prevValue.current, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Transform spring value to formatted string
  const display = useTransform(spring, (current) => {
    if (format) {
      return format(current);
    }
    return current.toFixed(decimals);
  });

  useEffect(() => {
    // If user prefers reduced motion, jump instantly
    if (prefersReducedMotion) {
      spring.set(value);
      prevValue.current = value;
      return;
    }

    // Animate to new value
    spring.set(value);
    prevValue.current = value;
  }, [value, spring, prefersReducedMotion]);

  return (
    <motion.span className={className}>
      {prefersReducedMotion ? (format ? format(value) : value.toFixed(decimals)) : display}
    </motion.span>
  );
}
