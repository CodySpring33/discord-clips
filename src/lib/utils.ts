import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 * @param inputs - Class names to combine
 * @returns Combined class names string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
} 