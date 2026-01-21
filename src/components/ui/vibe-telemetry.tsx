// src/components/ui/vibe-telemetry.tsx
import React from 'react';
import { Shield, AlertTriangle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils'; // Ensure this file exists, or remove this line if not using tailwind-merge
import clsx from 'clsx';

// If you don't have @/lib/utils, replace `cn(...)` with `clsx(...)` or simple template strings.
// Fallback helper if utils missing:
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

interface VibeTelemetryProps {
  status: 'STABLE' | 'DRIFTING' | 'CRITICAL';
  score: number;
}

export const VibeTelemetry: React.FC<VibeTelemetryProps> = ({ status, score }) => {
  const config = {
    STABLE: {
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10 border-emerald-400/20',
      icon: Shield,
      label: 'STABLE'
    },
    DRIFTING: {
      color: 'text-amber-400',
      bg: 'bg-amber-400/10 border-amber-400/20',
      icon: AlertTriangle,
      label: 'DRIFTING'
    },
    CRITICAL: {
      color: 'text-rose-500',
      bg: 'bg-rose-500/10 border-rose-500/30',
      icon: AlertTriangle,
      label: 'CRITICAL'
    }
  };

  const current = config[status];
  const Icon = current.icon;
  const isUnstable = status !== 'STABLE';

  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-1.5 rounded-lg border text-xs font-mono tracking-wider transition-all duration-300",
      current.bg,
      isUnstable && "animate-pulse"
    )}>
      <Icon className={cn("w-4 h-4", current.color)} />
      <span className={cn("font-bold", current.color)}>{current.label}</span>
      <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden ml-auto">
        <div 
          className={cn("h-full transition-all duration-500", current.color.replace('text', 'bg'))}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-gray-400">{score}%</span>
    </div>
  );
};
