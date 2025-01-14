import { cn } from '@/lib/utils';
import { Loader2, LucideProps } from 'lucide-react';

export const Spinner = ({ className, size, ...rest }: LucideProps) => {
  return (
    <Loader2
      className={cn('animate-spin mx-1', className)}
      size={size}
      {...rest}
    />
  );
};
