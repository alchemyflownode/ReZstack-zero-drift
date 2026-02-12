import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className = '' }: GlassCardProps) => {
  return (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
