import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorResponseMessage = (error: unknown | any) => {
  return (
    error?.message ||
    error?.data ||
    error?.data?.message ||
    'Something went wrong!'
  );
};
