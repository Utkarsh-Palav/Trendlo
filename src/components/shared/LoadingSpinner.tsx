import type { FC } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ size = 'md', color, className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };
  
  return (
    <div 
      className={`animate-spin rounded-full border-t-transparent ${sizeMap[size]} ${className}`} 
      style={{ borderBottomColor: color || 'currentColor', borderLeftColor: color || 'currentColor', borderRightColor: color || 'currentColor' }} 
    />
  );
};

export default LoadingSpinner;
