// src/components/sovereign/LuxuryDataGrid.tsx
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';

export interface FinancialData {
  date: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

interface LuxuryDataGridProps {
  data: FinancialData[];
  currency?: string;
  density?: 'compact' | 'balanced' | 'expanded';
  trendLines?: boolean;
  designTokens: Record<string, string>;
  motionConfig: any;
}

const LuxuryDataGrid: React.FC<LuxuryDataGridProps> = memo(({
  data,
  currency = 'CAD',
  density = 'balanced',
  trendLines = true,
  designTokens,
  motionConfig
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionConfig.duration / 1000,
        ease: motionConfig.easing,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
      style={{
        borderColor: designTokens.accent + '30',
        boxShadow: `0 20px 40px ${designTokens.primary}10`
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Financial Appraisal</h3>
          <p className="text-slate-400">Real-time market valuation analysis</p>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10">
          <DollarSign className="w-6 h-6" style={{ color: designTokens.luxuryGold }} />
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          className="space-y-3"
        >
          {data.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 4 }}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent">
                  {item.trend === 'up' ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{item.date}</p>
                  <p className="text-slate-400 text-sm">Market value assessment</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold text-white">{formatCurrency(item.value)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="w-16 h-1 rounded-full bg-gradient-to-r"
                    style={{
                      background: item.trend === 'up' 
                        ? `linear-gradient(to right, ${designTokens.success}, ${designTokens.accent})`
                        : `linear-gradient(to right, ${designTokens.error}, ${designTokens.warning})`
                    }}
                  />
                  <span className={`text-sm ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {item.trend.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {trendLines && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          <div className="h-32 w-full relative">
            {/* SVG Trend Line */}
            <svg className="w-full h-full" viewBox="0 0 400 100">
              <path
                d="M0,80 L100,60 L200,40 L300,70 L400,30"
                fill="none"
                stroke={designTokens.accent}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

LuxuryDataGrid.displayName = 'LuxuryDataGrid';
export default LuxuryDataGrid;
