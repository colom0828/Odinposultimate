'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { 
  Mesa, 
  Area, 
  PlanoRestaurante,
  MesaTemplate,
  MesaStatus,
  AreaType,
  MESA_TEMPLATES,
} from '@/app/types/mesa.types';
import { MesaCanvas } from '@/app/components/mesa/MesaCanvas';
import { MesaToolbar } from '@/app/components/mesa/MesaToolbar';
import { MesaSidebar } from '@/app/components/mesa/MesaSidebar';
import { MesaProperties } from '@/app/components/mesa/MesaProperties';
import { AreaDialog } from '@/app/components/mesa/AreaDialog';
import { Button } from '@/app/components/ui/button';
import { useDragDrop } from '@/app/hooks/useDragDrop';

const GRID_SIZE = 20;

export default function PlanoMesaPage() {
  // Estados principales
  const [plano, setPlano] = useState<PlanoRestaurante>({
    id: 'plano-1',
    nombre: 'Plano Principal',
    mesas: [],
    areas: [
      {
        id: 'area-1',
        nombre: 'Salón Principal',
        tipo: AreaType.SALON,
        color: 'bg-gradient-to-br from-blue-600 to-cyan-600',
        activa: true,
      },
    ],
    gridSize: GRID_SIZE,
    canvasWidth: 1200,
    canvasHeight: 800,
    ultimaModificacion: new Date().toISOString(),
  });

  const [selectedMesaId, setSelectedMesaId] = useState<string | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('area-1');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showProperties, setShowProperties] = useState(false);
  const [propertiesPosition, setPropertiesPosition] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [showAreaDialog, setShowAreaDialog] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Drag & Drop hook
  const { dragState, dragRef, handleDragStart, handleDragMove, handleDragEnd } = useDragDrop({
    snapToGrid,
    gridSize: GRID_SIZE,
    bounds: {
      minX: 0,
      maxX: 1200,
      minY: 0,
      maxY: 800,
    },
    onDragEnd: (id, position) => {
      updateMesaPosition(id, position);
    },
  });

  // Asignar ref del drag & drop
  useEffect(() => {
    if (canvasRef.current) {
      (dragRef as any).current = canvasRef.current;
    }
  }, [canvasRef, dragRef]);

  // Event listeners para drag
  useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [dragState.isDragging, handleDragMove, handleDragEnd]);

  // Crear nueva mesa desde template
  const createMesa = (template: MesaTemplate, position?: { x: number; y: number }) => {
    const newMesa: Mesa = {
      id: `mesa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      numero: plano.mesas.length + 1,
      shape: template.shape,
      capacidad: template.defaultCapacidad,
      status: MesaStatus.LIBRE,
      position: position || {
        x: plano.canvasWidth / 2 - template.defaultSize.width / 2,
        y: plano.canvasHeight / 2 - template.defaultSize.height / 2,
      },
      size: template.defaultSize,
      rotation: 0,
      areaId: selectedAreaId,
    };

    setPlano(prev => ({
      ...prev,
      mesas: [...prev.mesas, newMesa],
      ultimaModificacion: new Date().toISOString(),
    }));
  };

  // Actualizar posición de mesa
  const updateMesaPosition = (mesaId: string, position: { x: number; y: number }) => {
    setPlano(prev => ({
      ...prev,
      mesas: prev.mesas.map(m =>
        m.id === mesaId ? { ...m, position } : m
      ),
      ultimaModificacion: new Date().toISOString(),
    }));
  };

  // Actualizar mesa
  const updateMesa = (mesaId: string, updates: Partial<Mesa>) => {
    setPlano(prev => ({
      ...prev,
      mesas: prev.mesas.map(m =>
        m.id === mesaId ? { ...m, ...updates } : m
      ),
      ultimaModificacion: new Date().toISOString(),
    }));
  };

  // Eliminar mesa
  const deleteMesa = (mesaId: string) => {
    setPlano(prev => ({
      ...prev,
      mesas: prev.mesas.filter(m => m.id !== mesaId),
      ultimaModificacion: new Date().toISOString(),
    }));
  };

  // Eliminar todas las mesas del área actual
  const deleteAllMesasInArea = () => {
    setPlano(prev => ({
      ...prev,
      mesas: prev.mesas.filter(m => m.areaId !== selectedAreaId),
      ultimaModificacion: new Date().toISOString(),
    }));
    setSelectedMesaId(null);
    setShowProperties(false);
  };

  // Crear nueva área
  const createArea = () => {
    setShowAreaDialog(true);
  };

  // Confirmar creación de área desde el diálogo
  const handleConfirmCreateArea = (nombre: string, tipo: AreaType, color: string) => {
    const newArea: Area = {
      id: `area-${Date.now()}`,
      nombre,
      tipo,
      color,
      activa: true,
    };

    setPlano(prev => ({
      ...prev,
      areas: [...prev.areas, newArea],
    }));
    setSelectedAreaId(newArea.id);
    setShowAreaDialog(false);
  };

  // Eliminar área
  const deleteArea = (areaId: string) => {
    if (plano.areas.length <= 1) {
      alert('Debe existir al menos un área');
      return;
    }

    const mesasEnArea = plano.mesas.filter(m => m.areaId === areaId);
    if (mesasEnArea.length > 0) {
      alert(`No puedes eliminar un área con ${mesasEnArea.length} mesas. Elimina o mueve las mesas primero.`);
      return;
    }

    setPlano(prev => ({
      ...prev,
      areas: prev.areas.filter(a => a.id !== areaId),
    }));

    // Seleccionar otra área
    const remainingArea = plano.areas.find(a => a.id !== areaId);
    if (remainingArea) {
      setSelectedAreaId(remainingArea.id);
    }
  };

  // Handlers de canvas
  const handleCanvasClick = () => {
    setSelectedMesaId(null);
    setShowProperties(false);
  };

  const handleMesaClick = (e: React.MouseEvent, mesa: Mesa) => {
    e.stopPropagation();
    setSelectedMesaId(mesa.id);
    setPropertiesPosition({
      x: e.clientX + 20,
      y: e.clientY - 100,
    });
    setShowProperties(true);
  };

  const handleMesaMouseDown = (e: React.MouseEvent, mesa: Mesa) => {
    e.stopPropagation();
    setSelectedMesaId(mesa.id);
    handleDragStart(e, mesa.id, mesa.position);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const templateData = e.dataTransfer.getData('template');
    if (!templateData) return;

    const template: MesaTemplate = JSON.parse(templateData);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const position = {
      x: e.clientX - rect.left - template.defaultSize.width / 2,
      y: e.clientY - rect.top - template.defaultSize.height / 2,
    };

    createMesa(template, position);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Guardar plano
  const handleSavePlano = async () => {
    setIsSaving(true);

    // Simular guardado (aquí iría la llamada al backend)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Guardar en localStorage por ahora
    localStorage.setItem('odin-plano-mesas', JSON.stringify(plano));

    setIsSaving(false);
    
    // Mostrar notificación
    alert('✅ Plano guardado exitosamente');
  };

  // Cargar plano desde localStorage al montar
  useEffect(() => {
    const savedPlano = localStorage.getItem('odin-plano-mesas');
    if (savedPlano) {
      try {
        const parsed = JSON.parse(savedPlano);
        setPlano(parsed);
        if (parsed.areas.length > 0) {
          setSelectedAreaId(parsed.areas[0].id);
        }
      } catch (error) {
        console.error('Error cargando plano:', error);
      }
    }
  }, []);

  const selectedMesa = plano.mesas.find(m => m.id === selectedMesaId);
  const mesasEnAreaActual = plano.mesas.filter(m => m.areaId === selectedAreaId);

  return (
    <div className="relative h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-purple-500/20 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
              <LucideIcons.LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Constructor de Plano de Mesas
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Organiza las mesas de tu restaurante visualmente
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Stats */}
            <div className="flex items-center space-x-4 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
              <div className="text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">Mesas</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {plano.mesas.length}
                </p>
              </div>
              <div className="w-px h-8 bg-slate-300 dark:bg-slate-700" />
              <div className="text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">En área actual</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {mesasEnAreaActual.length}
                </p>
              </div>
            </div>

            {/* Volver */}
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="border-slate-300 dark:border-purple-500/30"
            >
              <LucideIcons.ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative h-[calc(100vh-100px)] p-6">
        {/* Canvas */}
        <div className="h-full">
          <MesaCanvas
            mesas={mesasEnAreaActual}
            selectedMesaId={selectedMesaId}
            draggedMesaId={dragState.draggedId}
            canvasRef={canvasRef}
            gridSize={GRID_SIZE}
            snapToGrid={snapToGrid}
            onMesaMouseDown={handleMesaMouseDown}
            onMesaClick={handleMesaClick}
            onCanvasClick={handleCanvasClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMesaDelete={deleteMesa}
          />
        </div>
      </div>

      {/* Toolbar (tipos de mesa) */}
      <MesaToolbar 
        onSelectTemplate={(template) => createMesa(template)} 
        onDeleteAllMesas={deleteAllMesasInArea}
        mesasCount={mesasEnAreaActual.length}
      />

      {/* Sidebar (áreas) */}
      <MesaSidebar
        areas={plano.areas}
        selectedAreaId={selectedAreaId}
        onSelectArea={setSelectedAreaId}
        onCreateArea={createArea}
        onDeleteArea={deleteArea}
        snapToGrid={snapToGrid}
        onToggleSnap={() => setSnapToGrid(!snapToGrid)}
      />

      {/* Properties Panel */}
      {showProperties && selectedMesa && (
        <MesaProperties
          mesa={selectedMesa}
          position={propertiesPosition}
          onClose={() => setShowProperties(false)}
          onUpdate={updateMesa}
          onDelete={deleteMesa}
        />
      )}

      {/* Guardar Button (Fixed) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <Button
          onClick={handleSavePlano}
          disabled={isSaving}
          className="px-8 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-lg font-bold shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
              Guardando...
            </>
          ) : (
            <>
              <LucideIcons.Save className="w-5 h-5 mr-3" />
              GUARDAR PLANO DE MESAS
            </>
          )}
        </Button>
      </motion.div>

      {/* Area Dialog */}
      <AreaDialog
        isOpen={showAreaDialog}
        onClose={() => setShowAreaDialog(false)}
        onConfirm={handleConfirmCreateArea}
      />
    </div>
  );
}