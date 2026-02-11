'use client';

import { Check, LayoutDashboard, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

interface ThemePreviewCardProps {
  theme: 'dark' | 'light';
  isSelected: boolean;
  onSelect: () => void;
}

export function ThemePreviewCard({ theme, isSelected, onSelect }: ThemePreviewCardProps) {
  const isDark = theme === 'dark';
  
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full rounded-2xl overflow-hidden transition-all duration-300
        ${isSelected 
          ? 'ring-4 ring-purple-500 shadow-2xl shadow-purple-500/30' 
          : 'ring-2 ring-transparent hover:ring-purple-500/50'
        }
      `}
    >
      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <Check className="w-5 h-5 text-white" />
        </motion.div>
      )}
      
      {/* Preview content */}
      <div className={`
        p-6 text-left
        ${isDark 
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
          : 'bg-gradient-to-br from-slate-50 to-blue-50/30'
        }
      `}>
        {/* Theme name */}
        <div className="mb-4">
          <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {isDark ? 'Tema Oscuro' : 'Tema Claro'}
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {isDark 
              ? 'Ideal para entornos con poca iluminación' 
              : 'Diseño profesional para oficinas y espacios iluminados'
            }
          </p>
        </div>

        {/* Mini dashboard preview */}
        <div className="space-y-3">
          {/* Simulated header */}
          <div className={`
            h-10 rounded-xl flex items-center px-3 space-x-2
            ${isDark 
              ? 'bg-slate-800/50 border border-purple-500/20' 
              : 'bg-white border border-slate-200 shadow-sm'
            }
          `}>
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500`}></div>
            <div className={`h-2 w-20 rounded ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}></div>
          </div>

          {/* Simulated stats cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className={`
              p-3 rounded-xl
              ${isDark 
                ? 'bg-gradient-to-br from-slate-800/50 to-green-900/20 border border-green-500/30' 
                : 'bg-white border border-green-200 shadow-sm'
              }
            `}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Ventas</div>
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>$12,450</div>
            </div>

            <div className={`
              p-3 rounded-xl
              ${isDark 
                ? 'bg-gradient-to-br from-slate-800/50 to-purple-900/20 border border-purple-500/30' 
                : 'bg-white border border-purple-200 shadow-sm'
              }
            `}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Órdenes</div>
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <LayoutDashboard className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>48</div>
            </div>
          </div>

          {/* Simulated list */}
          <div className={`
            p-3 rounded-xl space-y-2
            ${isDark 
              ? 'bg-slate-800/50 border border-purple-500/20' 
              : 'bg-white border border-slate-200 shadow-sm'
            }
          `}>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${isDark ? 'bg-purple-500' : 'bg-purple-500'}`}></div>
              <div className={`h-2 flex-1 rounded ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-500'}`}></div>
              <div className={`h-2 flex-1 rounded ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}></div>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}