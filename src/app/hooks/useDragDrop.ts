/**
 * ODIN POS - Hook para Drag & Drop de Mesas
 * Implementación nativa sin librerías externas
 */

import { useState, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DragState {
  isDragging: boolean;
  draggedId: string | null;
  offset: Position;
  currentPosition: Position;
}

interface UseDragDropOptions {
  snapToGrid?: boolean;
  gridSize?: number;
  bounds?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  onDragStart?: (id: string) => void;
  onDrag?: (id: string, position: Position) => void;
  onDragEnd?: (id: string, position: Position) => void;
}

export function useDragDrop(options: UseDragDropOptions = {}) {
  const {
    snapToGrid = false,
    gridSize = 20,
    bounds,
    onDragStart,
    onDrag,
    onDragEnd,
  } = options;

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedId: null,
    offset: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
  });

  const dragRef = useRef<HTMLDivElement | null>(null);

  // Snap a la cuadrícula
  const snapPosition = useCallback(
    (position: Position): Position => {
      if (!snapToGrid) return position;
      
      return {
        x: Math.round(position.x / gridSize) * gridSize,
        y: Math.round(position.y / gridSize) * gridSize,
      };
    },
    [snapToGrid, gridSize]
  );

  // Aplicar límites
  const applyBounds = useCallback(
    (position: Position, elementWidth = 0, elementHeight = 0): Position => {
      if (!bounds) return position;

      return {
        x: Math.max(bounds.minX, Math.min(position.x, bounds.maxX - elementWidth)),
        y: Math.max(bounds.minY, Math.min(position.y, bounds.maxY - elementHeight)),
      };
    },
    [bounds]
  );

  // Iniciar drag
  const handleDragStart = useCallback(
    (e: React.MouseEvent, id: string, initialPosition: Position) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const offset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      setDragState({
        isDragging: true,
        draggedId: id,
        offset,
        currentPosition: initialPosition,
      });

      onDragStart?.(id);
    },
    [onDragStart]
  );

  // Mover elemento
  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.draggedId) return;

      const containerRect = dragRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      let newPosition = {
        x: e.clientX - containerRect.left - dragState.offset.x,
        y: e.clientY - containerRect.top - dragState.offset.y,
      };

      // Aplicar bounds
      newPosition = applyBounds(newPosition);

      // Aplicar snap
      newPosition = snapPosition(newPosition);

      setDragState(prev => ({
        ...prev,
        currentPosition: newPosition,
      }));

      onDrag?.(dragState.draggedId, newPosition);
    },
    [dragState, applyBounds, snapPosition, onDrag]
  );

  // Finalizar drag
  const handleDragEnd = useCallback(() => {
    if (!dragState.isDragging || !dragState.draggedId) return;

    onDragEnd?.(dragState.draggedId, dragState.currentPosition);

    setDragState({
      isDragging: false,
      draggedId: null,
      offset: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 },
    });
  }, [dragState, onDragEnd]);

  // Drag desde toolbar (nueva mesa)
  const handleDropFromToolbar = useCallback(
    (e: React.DragEvent, onCreate: (position: Position) => void) => {
      e.preventDefault();

      const containerRect = dragRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      let position = {
        x: e.clientX - containerRect.left - 40, // Centro de la mesa
        y: e.clientY - containerRect.top - 40,
      };

      position = applyBounds(position);
      position = snapPosition(position);

      onCreate(position);
    },
    [applyBounds, snapPosition]
  );

  return {
    dragState,
    dragRef,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDropFromToolbar,
  };
}
