import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Mesa } from '@/app/types/mesa.types';
import { MesaItem } from './MesaItem';

interface MesaCanvasProps {
  mesas: Mesa[];
  selectedMesaId: string | null;
  draggedMesaId: string | null;
  canvasRef: React.RefObject<HTMLDivElement>;
  gridSize: number;
  snapToGrid: boolean;
  onMesaMouseDown: (e: React.MouseEvent, mesa: Mesa) => void;
  onMesaClick: (e: React.MouseEvent, mesa: Mesa) => void;
  onCanvasClick: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onMesaDelete?: (mesaId: string) => void;
}

export function MesaCanvas({
  mesas,
  selectedMesaId,
  draggedMesaId,
  canvasRef,
  gridSize,
  snapToGrid,
  onMesaMouseDown,
  onMesaClick,
  onCanvasClick,
  onDrop,
  onDragOver,
  onMesaDelete,
}: MesaCanvasProps) {
  // Dibujar grid en canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = (canvas as any).getContext?.('2d');
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    if (!snapToGrid) return;

    // Dibujar grid
    ctx.strokeStyle = 'rgba(147, 51, 234, 0.1)'; // purple-500/10
    ctx.lineWidth = 1;

    // Líneas verticales
    for (let x = 0; x < canvas.offsetWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.offsetHeight);
      ctx.stroke();
    }

    // Líneas horizontales
    for (let y = 0; y < canvas.offsetHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.offsetWidth, y);
      ctx.stroke();
    }
  }, [canvasRef, gridSize, snapToGrid]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      ref={canvasRef}
      onClick={onCanvasClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="relative w-full h-full bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-purple-500/20 overflow-hidden shadow-inner"
      style={{
        backgroundImage: snapToGrid ? `
          linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
        ` : 'none',
        backgroundSize: snapToGrid ? `${gridSize}px ${gridSize}px` : 'auto',
        minHeight: '600px',
      }}
    >
      {/* Canvas para grid personalizado */}
      <canvas
        className="absolute inset-0 pointer-events-none"
        width={1200}
        height={800}
        style={{ width: '100%', height: '100%' }}
      />

      {/* Grid overlay más visible cuando snap está activo */}
      {snapToGrid && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(147, 51, 234, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(147, 51, 234, 0.15) 1px, transparent 1px),
              linear-gradient(to right, rgba(147, 51, 234, 0.3) 2px, transparent 2px),
              linear-gradient(to bottom, rgba(147, 51, 234, 0.3) 2px, transparent 2px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px, ${gridSize * 5}px ${gridSize * 5}px, ${gridSize * 5}px ${gridSize * 5}px`,
          }}
        />
      )}

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <div className="text-9xl font-bold text-slate-900 dark:text-white">
          ODIN
        </div>
      </div>

      {/* Mesas */}
      {mesas.map((mesa) => (
        <MesaItem
          key={mesa.id}
          mesa={mesa}
          isSelected={selectedMesaId === mesa.id}
          isDragging={draggedMesaId === mesa.id}
          onMouseDown={(e) => onMesaMouseDown(e, mesa)}
          onClick={(e) => onMesaClick(e, mesa)}
          onDelete={onMesaDelete ? () => onMesaDelete(mesa.id) : undefined}
        />
      ))}

      {/* Empty state */}
      {mesas.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center opacity-20">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Plano Vacío
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
              Arrastra tipos de mesa desde la barra lateral izquierda<br />
              o haz clic en un tipo para agregarlo al centro
            </p>
          </div>
        </motion.div>
      )}

      {/* Grid info (cuando está activado) */}
      {snapToGrid && mesas.length > 0 && (
        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg backdrop-blur-sm">
          <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
            Grid: {gridSize}px
          </p>
        </div>
      )}

      {/* Contador de mesas */}
      {mesas.length > 0 && (
        <div className="absolute top-4 right-4 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-purple-500/30 rounded-xl shadow-lg">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Total de mesas
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {mesas.length}
          </p>
        </div>
      )}
    </motion.div>
  );
}