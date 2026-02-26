import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { ExportFormat, ExportRequest } from '../../types/reports.types';
import { ReportService } from '../../services/reportService';

interface ReportExportButtonsProps {
  exportRequest: Omit<ExportRequest, 'format'>;
  disabled?: boolean;
}

export function ReportExportButtons({ exportRequest, disabled = false }: ReportExportButtonsProps) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setExporting(format);
    
    try {
      await ReportService.exportReport({
        ...exportRequest,
        format,
      });
    } catch (error) {
      console.error('Error exportando reporte:', error);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Exportar PDF */}
      <button
        onClick={() => handleExport('PDF')}
        disabled={disabled || exporting !== null}
        className="px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 font-semibold transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exporting === 'PDF' ? (
          <>
            <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Generando...</span>
          </>
        ) : (
          <>
            <LucideIcons.FileText className="w-4 h-4" />
            <span className="text-sm">Exportar PDF</span>
          </>
        )}
      </button>

      {/* Exportar Excel */}
      <button
        onClick={() => handleExport('EXCEL')}
        disabled={disabled || exporting !== null}
        className="px-4 py-2.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-600 dark:text-green-400 font-semibold transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exporting === 'EXCEL' ? (
          <>
            <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Generando...</span>
          </>
        ) : (
          <>
            <LucideIcons.FileSpreadsheet className="w-4 h-4" />
            <span className="text-sm">Exportar Excel</span>
          </>
        )}
      </button>

      {/* Exportar CSV */}
      <button
        onClick={() => handleExport('CSV')}
        disabled={disabled || exporting !== null}
        className="px-4 py-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-semibold transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exporting === 'CSV' ? (
          <>
            <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Generando...</span>
          </>
        ) : (
          <>
            <LucideIcons.Download className="w-4 h-4" />
            <span className="text-sm">Exportar CSV</span>
          </>
        )}
      </button>
    </div>
  );
}