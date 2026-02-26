import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { ReportDefinition } from '../../types/reports.types';

interface ReportCardProps {
  report: ReportDefinition;
  onClick: () => void;
  disabled?: boolean;
}

export function ReportCard({ report, onClick, disabled = false }: ReportCardProps) {
  const IconComponent = (LucideIcons as any)[report.icon] || LucideIcons.FileText;

  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    orange: 'from-orange-600 to-orange-700',
    red: 'from-red-600 to-red-700',
    yellow: 'from-yellow-600 to-yellow-700',
    cyan: 'from-cyan-600 to-cyan-700',
    pink: 'from-pink-600 to-pink-700',
    emerald: 'from-emerald-600 to-emerald-700',
    indigo: 'from-indigo-600 to-indigo-700',
  };

  const bgGradient = colorClasses[report.color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative group w-full p-6 rounded-xl border border-border bg-card hover:shadow-xl transition-all text-left ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {/* Ícono */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${bgGradient} flex items-center justify-center shadow-lg`}>
          <IconComponent className="w-7 h-7 text-white" />
        </div>

        {/* Badge si tiene datos monetarios */}
        {report.hasMoneyData && (
          <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            $
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="space-y-2">
        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
          {report.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {report.description}
        </p>
      </div>

      {/* Indicador de categoría */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground capitalize">
          {getCategoryLabel(report.category)}
        </span>
        <LucideIcons.ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>

      {/* Borde animado en hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-xl transition-colors pointer-events-none" />
    </motion.button>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    OPERATIONAL: 'Operativo',
    INVENTORY: 'Inventario',
    STAFF: 'Personal',
    FINANCIAL: 'Financiero',
  };
  return labels[category] || category;
}
