/**
 * ODIN POS - Tipos para Módulo de Mesas
 * Sistema de gestión de planos de restaurante
 */

// ========================================
// TIPOS DE MESA
// ========================================

export enum MesaShape {
  CUADRADA = 'cuadrada',
  REDONDA = 'redonda',
  RECTANGULAR = 'rectangular',
  GRANDE = 'grande',
}

export enum MesaStatus {
  LIBRE = 'libre',
  OCUPADA = 'ocupada',
  RESERVADA = 'reservada',
  PAGANDO = 'pagando',
}

export enum AreaType {
  SALON = 'salon',
  TERRAZA = 'terraza',
  VIP = 'vip',
  BAR = 'bar',
  EXTERIOR = 'exterior',
}

// ========================================
// INTERFACES
// ========================================

export interface Mesa {
  id: string;
  numero: number;
  shape: MesaShape;
  capacidad: number;
  status: MesaStatus;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  rotation: number; // en grados
  areaId: string;
}

export interface Area {
  id: string;
  nombre: string;
  tipo: AreaType;
  color: string;
  activa: boolean;
}

export interface PlanoRestaurante {
  id: string;
  nombre: string;
  mesas: Mesa[];
  areas: Area[];
  gridSize: number; // tamaño del grid en px
  canvasWidth: number;
  canvasHeight: number;
  ultimaModificacion: string;
}

// ========================================
// CONFIGURACIÓN DE TIPOS DE MESA
// ========================================

export interface MesaTemplate {
  shape: MesaShape;
  label: string;
  icon: string;
  defaultCapacidad: number;
  defaultSize: {
    width: number;
    height: number;
  };
  color: string;
}

export const MESA_TEMPLATES: MesaTemplate[] = [
  {
    shape: MesaShape.CUADRADA,
    label: 'Cuadrada (2-4)',
    icon: 'Square',
    defaultCapacidad: 4,
    defaultSize: { width: 80, height: 80 },
    color: 'from-blue-500 to-cyan-500',
  },
  {
    shape: MesaShape.REDONDA,
    label: 'Redonda (4)',
    icon: 'Circle',
    defaultCapacidad: 4,
    defaultSize: { width: 90, height: 90 },
    color: 'from-purple-500 to-pink-500',
  },
  {
    shape: MesaShape.RECTANGULAR,
    label: 'Rectangular (4-6)',
    icon: 'RectangleHorizontal',
    defaultCapacidad: 6,
    defaultSize: { width: 120, height: 80 },
    color: 'from-orange-500 to-red-500',
  },
  {
    shape: MesaShape.GRANDE,
    label: 'Grande (6-8)',
    icon: 'Octagon',
    defaultCapacidad: 8,
    defaultSize: { width: 140, height: 140 },
    color: 'from-green-500 to-emerald-500',
  },
];

// ========================================
// STATUS COLORS
// ========================================

export const MESA_STATUS_CONFIG = {
  [MesaStatus.LIBRE]: {
    label: 'Libre',
    color: 'bg-green-500/20 border-green-500/50 text-green-400',
    hoverColor: 'hover:bg-green-500/30',
    icon: 'CheckCircle',
  },
  [MesaStatus.OCUPADA]: {
    label: 'Ocupada',
    color: 'bg-red-500/20 border-red-500/50 text-red-400',
    hoverColor: 'hover:bg-red-500/30',
    icon: 'Users',
  },
  [MesaStatus.RESERVADA]: {
    label: 'Reservada',
    color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    hoverColor: 'hover:bg-yellow-500/30',
    icon: 'Clock',
  },
  [MesaStatus.PAGANDO]: {
    label: 'Pagando',
    color: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    hoverColor: 'hover:bg-blue-500/30',
    icon: 'CreditCard',
  },
};

// ========================================
// AREA COLORS
// ========================================

export const AREA_COLORS = [
  'bg-gradient-to-br from-blue-600 to-cyan-600',
  'bg-gradient-to-br from-purple-600 to-pink-600',
  'bg-gradient-to-br from-green-600 to-emerald-600',
  'bg-gradient-to-br from-orange-600 to-red-600',
  'bg-gradient-to-br from-yellow-600 to-amber-600',
  'bg-gradient-to-br from-indigo-600 to-purple-600',
  'bg-gradient-to-br from-teal-600 to-cyan-600',
  'bg-gradient-to-br from-rose-600 to-pink-600',
];