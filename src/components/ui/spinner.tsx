
import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Spinner = ({ size = 'medium', className }: SpinnerProps) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={cn(
          'animate-spin rounded-full border-solid border-t-coffee-green border-r-transparent border-b-transparent border-l-transparent',
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};
