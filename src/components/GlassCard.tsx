import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'highlight' | 'accent' | 'bento';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  title, 
  subtitle, 
  icon,
  variant = 'default' 
}) => {
  return (
    <div className={`bg-[#111116] border border-white/[0.05] rounded-[5px] p-8 transition-all duration-500 group relative ${className}`}>
      {(title || icon) && (
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            {icon && (
              <div className="w-10 h-10 flex items-center justify-center bg-black/40 border border-white/[0.03] rounded-[4px] text-slate-400 group-hover:text-[#00f5d4] transition-all">
                {icon}
              </div>
            )}
            <div>
              {title && <h3 className="text-[10px] font-black text-white tracking-[0.2em] uppercase opacity-90">{title}</h3>}
              {subtitle && <p className="text-[9px] text-slate-600 font-bold mt-1 uppercase tracking-widest">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};


