import React from 'react';

interface CoastersLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CoastersLogo: React.FC<CoastersLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl'
  };

  return (
    <div className={`font-hackney font-bold text-primary ${sizeClasses[size]} ${className}`}>
      COASTERS
    </div>
  );
};

export const DecorativeBorder: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary to-primary/20 h-1 rounded-full"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent h-0.5 top-0.5 rounded-full"></div>
      
      {/* Decorative elements */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
      
      {/* Additional decorative dots */}
      <div className="absolute left-12 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-primary/60 rounded-full"></div>
      <div className="absolute right-12 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-primary/60 rounded-full"></div>
    </div>
  );
};