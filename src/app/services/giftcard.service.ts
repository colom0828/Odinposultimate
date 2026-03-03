/**
 * ═══════════════════════════════════════════════════════════════
 * SERVICIO - GIFTCARDS / TARJETAS DE REGALO
 * ═══════════════════════════════════════════════════════════════
 */

import type {
  Giftcard,
  GiftcardMovement,
  CreateGiftcardPayload,
  RedeemGiftcardPayload,
  RechargeGiftcardPayload,
  VoidGiftcardPayload,
  GiftcardFilters,
  GiftcardKPIs,
  GiftcardStatus,
  ActivateGiftcardPayload, // ⭐ NUEVO
  DeactivateGiftcardPayload, // ⭐ NUEVO
  SuspendGiftcardPayload, // ⭐ NUEVO
} from '../types/giftcard.types';

// ⭐ NUEVO - Importar servicio Veriphone
import {
  activateGiftcardInPOS,
  deactivateGiftcardInPOS,
  syncGiftcardWithPOS,
} from './veriphone.service';

// ============================================================
// LocalStorage Keys
// ============================================================

const GIFTCARDS_KEY = 'odin-giftcards';
const MOVEMENTS_KEY = 'odin-giftcard-movements';

// ============================================================
// Helper Functions
// ============================================================

function generateGiftcardCode(): string {
  const prefix = 'GC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

function getGiftcardsFromStorage(): Giftcard[] {
  const data = localStorage.getItem(GIFTCARDS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveGiftcardsToStorage(giftcards: Giftcard[]): void {
  localStorage.setItem(GIFTCARDS_KEY, JSON.stringify(giftcards));
}

function getMovementsFromStorage(): GiftcardMovement[] {
  const data = localStorage.getItem(MOVEMENTS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveMovementsToStorage(movements: GiftcardMovement[]): void {
  localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
}

function updateGiftcardStatus(giftcard: Giftcard): GiftcardStatus {
  // Check if voided
  if (giftcard.status === 'VOIDED') {
    return 'VOIDED';
  }
  
  // Check if expired
  if (giftcard.expiresAt) {
    const expiryDate = new Date(giftcard.expiresAt);
    if (expiryDate < new Date()) {
      return 'EXPIRED';
    }
  }
  
  // Check if depleted
  if (giftcard.balance <= 0) {
    return 'DEPLETED';
  }
  
  return 'ACTIVE';
}

// ============================================================
// CRUD Operations
// ============================================================

/**
 * Listar todas las giftcards con filtros opcionales
 */
export async function listGiftcards(filters?: GiftcardFilters): Promise<Giftcard[]> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  
  let giftcards = getGiftcardsFromStorage();
  
  // Actualizar estados automáticamente
  giftcards = giftcards.map(gc => ({
    ...gc,
    status: updateGiftcardStatus(gc),
  }));
  
  saveGiftcardsToStorage(giftcards);
  
  // Aplicar filtros
  if (filters) {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      giftcards = giftcards.filter(gc =>
        gc.code.toLowerCase().includes(searchLower) ||
        gc.beneficiaryName.toLowerCase().includes(searchLower) ||
        gc.beneficiaryPhone?.includes(filters.search!) ||
        gc.beneficiaryEmail?.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.status) {
      giftcards = giftcards.filter(gc => gc.status === filters.status);
    }
    
    if (filters.type) {
      giftcards = giftcards.filter(gc => gc.type === filters.type);
    }
    
    if (filters.dateFrom) {
      giftcards = giftcards.filter(gc => gc.createdAt >= filters.dateFrom!);
    }
    
    if (filters.dateTo) {
      giftcards = giftcards.filter(gc => gc.createdAt <= filters.dateTo!);
    }
  }
  
  // Ordenar por fecha de creación descendente
  return giftcards.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Crear una nueva giftcard
 */
export async function createGiftcard(payload: CreateGiftcardPayload, userId: string = 'user-001'): Promise<Giftcard> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const code = generateGiftcardCode();
  const now = new Date().toISOString();
  
  const giftcard: Giftcard = {
    id: `gc-${Date.now()}`,
    code,
    beneficiaryName: payload.beneficiaryName,
    beneficiaryPhone: payload.beneficiaryPhone,
    beneficiaryEmail: payload.beneficiaryEmail,
    type: payload.type,
    status: 'ACTIVE',
    initialAmount: payload.initialAmount,
    balance: payload.initialAmount,
    currency: payload.currency,
    expiresAt: payload.expiresAt,
    message: payload.message,
    packageId: payload.packageId,
    packageName: payload.packageName,
    activationStatus: payload.type === 'DIGITAL' ? 'ACTIVATED' : 'PENDING_ACTIVATION', // ⭐ Digital auto-activa, Física requiere POS
    createdAt: now,
    createdBy: userId,
    updatedAt: now,
  };
  
  const giftcards = getGiftcardsFromStorage();
  giftcards.push(giftcard);
  saveGiftcardsToStorage(giftcards);
  
  // Crear movimiento de venta inicial
  const movement: GiftcardMovement = {
    id: `mov-${Date.now()}`,
    giftcardId: giftcard.id,
    type: 'SALE',
    amount: payload.initialAmount,
    balanceBefore: 0,
    balanceAfter: payload.initialAmount,
    reference: payload.sellNow ? `SALE-${Date.now()}` : undefined,
    referenceType: 'SALE',
    createdAt: now,
    createdBy: userId,
    notes: payload.sellNow ? 'Venta en caja' : 'Registro administrativo',
  };
  
  const movements = getMovementsFromStorage();
  movements.push(movement);
  saveMovementsToStorage(movements);
  
  return giftcard;
}

/**
 * Obtener giftcard por código
 */
export async function getGiftcardByCode(code: string): Promise<Giftcard | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const giftcards = getGiftcardsFromStorage();
  const giftcard = giftcards.find(gc => gc.code === code);
  
  if (!giftcard) return null;
  
  // Actualizar estado
  giftcard.status = updateGiftcardStatus(giftcard);
  
  return giftcard;
}

/**
 * Obtener giftcard por ID
 */
export async function getGiftcardById(id: string): Promise<Giftcard | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const giftcards = getGiftcardsFromStorage();
  const giftcard = giftcards.find(gc => gc.id === id);
  
  if (!giftcard) return null;
  
  giftcard.status = updateGiftcardStatus(giftcard);
  
  return giftcard;
}

/**
 * Redimir giftcard (aplicar descuento)
 */
export async function redeemGiftcard(
  payload: RedeemGiftcardPayload,
  userId: string = 'user-001'
): Promise<{ success: boolean; message: string; giftcard?: Giftcard }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const giftcards = getGiftcardsFromStorage();
  const giftcard = giftcards.find(gc => gc.code === payload.code);
  
  if (!giftcard) {
    return { success: false, message: 'Código de giftcard inválido' };
  }
  
  // Validaciones
  const currentStatus = updateGiftcardStatus(giftcard);
  
  if (currentStatus === 'VOIDED') {
    return { success: false, message: 'Esta giftcard ha sido anulada' };
  }
  
  if (currentStatus === 'EXPIRED') {
    return { success: false, message: 'Esta giftcard ha expirado' };
  }
  
  if (currentStatus === 'DEPLETED') {
    return { success: false, message: 'Esta giftcard no tiene saldo disponible' };
  }
  
  if (payload.amount > giftcard.balance) {
    return { success: false, message: `Saldo insuficiente. Disponible: ${giftcard.balance}` };
  }
  
  if (payload.amount <= 0) {
    return { success: false, message: 'El monto debe ser mayor a 0' };
  }
  
  // Aplicar redención
  const balanceBefore = giftcard.balance;
  giftcard.balance -= payload.amount;
  giftcard.status = updateGiftcardStatus(giftcard);
  giftcard.updatedAt = new Date().toISOString();
  
  saveGiftcardsToStorage(giftcards);
  
  // Registrar movimiento
  const movement: GiftcardMovement = {
    id: `mov-${Date.now()}`,
    giftcardId: giftcard.id,
    type: 'REDEEM',
    amount: -payload.amount,
    balanceBefore,
    balanceAfter: giftcard.balance,
    reference: payload.reference,
    referenceType: payload.referenceType,
    createdAt: new Date().toISOString(),
    createdBy: userId,
    notes: payload.notes,
  };
  
  const movements = getMovementsFromStorage();
  movements.push(movement);
  saveMovementsToStorage(movements);
  
  return {
    success: true,
    message: `Redención exitosa. Saldo restante: ${giftcard.balance}`,
    giftcard,
  };
}

/**
 * Recargar giftcard
 */
export async function rechargeGiftcard(
  payload: RechargeGiftcardPayload,
  userId: string = 'user-001'
): Promise<{ success: boolean; message: string; giftcard?: Giftcard }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const giftcards = getGiftcardsFromStorage();
  const giftcard = giftcards.find(gc => gc.code === payload.code);
  
  if (!giftcard) {
    return { success: false, message: 'Código de giftcard inválido' };
  }
  
  if (giftcard.status === 'VOIDED') {
    return { success: false, message: 'No se puede recargar una giftcard anulada' };
  }
  
  if (payload.amount <= 0) {
    return { success: false, message: 'El monto debe ser mayor a 0' };
  }
  
  // Aplicar recarga
  const balanceBefore = giftcard.balance;
  giftcard.balance += payload.amount;
  giftcard.status = 'ACTIVE'; // Reactivar si estaba agotada
  giftcard.updatedAt = new Date().toISOString();
  
  saveGiftcardsToStorage(giftcards);
  
  // Registrar movimiento
  const movement: GiftcardMovement = {
    id: `mov-${Date.now()}`,
    giftcardId: giftcard.id,
    type: 'RECHARGE',
    amount: payload.amount,
    balanceBefore,
    balanceAfter: giftcard.balance,
    reference: payload.mode === 'SALE' ? `SALE-${Date.now()}` : undefined,
    referenceType: 'SALE',
    createdAt: new Date().toISOString(),
    createdBy: userId,
    notes: payload.reason || (payload.mode === 'SALE' ? 'Recarga por venta en caja' : 'Ajuste administrativo'),
  };
  
  const movements = getMovementsFromStorage();
  movements.push(movement);
  saveMovementsToStorage(movements);
  
  return {
    success: true,
    message: `Recarga exitosa. Nuevo saldo: ${giftcard.balance}`,
    giftcard,
  };
}

/**
 * Anular giftcard
 */
export async function voidGiftcard(
  payload: VoidGiftcardPayload,
  userId: string = 'user-001'
): Promise<{ success: boolean; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const giftcards = getGiftcardsFromStorage();
  const giftcard = giftcards.find(gc => gc.code === payload.code);
  
  if (!giftcard) {
    return { success: false, message: 'Código de giftcard inválido' };
  }
  
  if (giftcard.status === 'VOIDED') {
    return { success: false, message: 'Esta giftcard ya está anulada' };
  }
  
  const balanceBefore = giftcard.balance;
  giftcard.status = 'VOIDED';
  giftcard.balance = 0;
  giftcard.updatedAt = new Date().toISOString();
  
  saveGiftcardsToStorage(giftcards);
  
  // Registrar movimiento
  const movement: GiftcardMovement = {
    id: `mov-${Date.now()}`,
    giftcardId: giftcard.id,
    type: 'VOID',
    amount: -balanceBefore,
    balanceBefore,
    balanceAfter: 0,
    reason: payload.reason,
    createdAt: new Date().toISOString(),
    createdBy: userId,
    notes: payload.reason,
  };
  
  const movements = getMovementsFromStorage();
  movements.push(movement);
  saveMovementsToStorage(movements);
  
  return { success: true, message: 'Giftcard anulada exitosamente' };
}

/**
 * Listar movimientos de una giftcard
 */
export async function listMovements(giftcardId: string): Promise<GiftcardMovement[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const movements = getMovementsFromStorage();
  return movements
    .filter(m => m.giftcardId === giftcardId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Obtener KPIs
 */
export async function getGiftcardKPIs(): Promise<GiftcardKPIs> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const giftcards = getGiftcardsFromStorage().map(gc => ({
    ...gc,
    status: updateGiftcardStatus(gc),
  }));
  
  const movements = getMovementsFromStorage();
  
  // Calcular mes actual
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  
  const soldThisMonth = movements.filter(
    m => m.type === 'SALE' && m.createdAt >= startOfMonth
  ).length;
  
  const redeemedThisMonth = movements.filter(
    m => m.type === 'REDEEM' && m.createdAt >= startOfMonth
  ).reduce((sum, m) => sum + Math.abs(m.amount), 0);
  
  const rechargedThisMonth = movements.filter(
    m => m.type === 'RECHARGE' && m.createdAt >= startOfMonth
  ).reduce((sum, m) => sum + m.amount, 0);
  
  const totalPendingBalance = giftcards
    .filter(gc => gc.status === 'ACTIVE' || gc.status === 'EXPIRED')
    .reduce((sum, gc) => sum + gc.balance, 0);
  
  const activeCount = giftcards.filter(gc => gc.status === 'ACTIVE').length;
  const expiredCount = giftcards.filter(gc => gc.status === 'EXPIRED').length;
  const voidedCount = giftcards.filter(gc => gc.status === 'VOIDED').length;
  
  return {
    totalPendingBalance,
    soldThisMonth,
    redeemedThisMonth,
    rechargedThisMonth,
    activeCount,
    expiredCount,
    voidedCount,
  };
}

/**
 * Inicializar datos mock (opcional)
 */
export async function initializeMockData(): Promise<void> {
  const existing = getGiftcardsFromStorage();
  
  if (existing.length > 0) {
    return; // Ya hay datos
  }
  
  const mockGiftcards: Giftcard[] = [
    {
      id: 'gc-001',
      code: 'GC2024ABC123',
      beneficiaryName: 'María González',
      beneficiaryPhone: '+1 809-555-1111',
      beneficiaryEmail: 'maria@example.com',
      type: 'DIGITAL',
      status: 'ACTIVE',
      initialAmount: 5000,
      balance: 3500,
      currency: 'DOP',
      message: '¡Feliz cumpleaños María!',
      activationStatus: 'ACTIVATED', // ⭐ NUEVO
      activatedAt: '2026-02-15T10:00:00Z',
      activatedBy: 'admin',
      posTerminalId: 'VERIPHONE-001',
      createdAt: '2026-02-15T10:00:00Z',
      createdBy: 'admin',
      updatedAt: '2026-02-20T14:30:00Z',
    },
    {
      id: 'gc-002',
      code: 'GC2024XYZ789',
      beneficiaryName: 'Juan Pérez',
      beneficiaryPhone: '+1 809-555-2222',
      type: 'PHYSICAL',
      status: 'ACTIVE',
      initialAmount: 10000,
      balance: 10000,
      currency: 'DOP',
      expiresAt: '2026-12-31T23:59:59Z',
      activationStatus: 'PENDING_ACTIVATION', // ⭐ NUEVO - Pendiente de activar en POS
      createdAt: '2026-03-01T09:00:00Z',
      createdBy: 'admin',
      updatedAt: '2026-03-01T09:00:00Z',
    },
    {
      id: 'gc-003',
      code: 'GC2024DEF456',
      beneficiaryName: 'Ana Martínez',
      beneficiaryEmail: 'ana@example.com',
      type: 'DIGITAL',
      status: 'DEPLETED',
      initialAmount: 2000,
      balance: 0,
      currency: 'DOP',
      activationStatus: 'ACTIVATED', // ⭐ NUEVO
      activatedAt: '2026-01-10T12:00:00Z',
      activatedBy: 'admin',
      posTerminalId: 'VERIPHONE-001',
      createdAt: '2026-01-10T12:00:00Z',
      createdBy: 'admin',
      updatedAt: '2026-02-25T16:45:00Z',
    },
  ];
  
  saveGiftcardsToStorage(mockGiftcards);
}

// ⭐ NUEVO - Activar giftcard en POS
export async function activateGiftcard(
  payload: ActivateGiftcardPayload
): Promise<{ success: boolean; message: string; giftcard?: Giftcard }> {
  try {
    const giftcards = getGiftcardsFromStorage();
    const giftcard = giftcards.find(gc => gc.code === payload.code);
    
    if (!giftcard) {
      return { success: false, message: 'Código de giftcard inválido' };
    }
    
    if (giftcard.activationStatus === 'ACTIVATED') {
      return { success: false, message: 'Esta giftcard ya está activada en POS' };
    }
    
    // Activar en POS Veriphone
    const posResult = await activateGiftcardInPOS(payload.code, payload.posTerminalId);
    
    if (!posResult.success) {
      return { success: false, message: posResult.message };
    }
    
    // Actualizar estado local
    giftcard.activationStatus = 'ACTIVATED';
    giftcard.activatedAt = new Date().toISOString();
    giftcard.activatedBy = payload.userId;
    giftcard.posTerminalId = payload.posTerminalId;
    giftcard.posTransactionId = posResult.response?.transactionId;
    giftcard.lastPosSync = new Date().toISOString();
    giftcard.updatedAt = new Date().toISOString();
    
    saveGiftcardsToStorage(giftcards);
    
    return {
      success: true,
      message: `Giftcard activada exitosamente en terminal ${payload.posTerminalId}`,
      giftcard,
    };
  } catch (error) {
    console.error('Error activating giftcard:', error);
    return {
      success: false,
      message: 'Error al activar la giftcard en POS',
    };
  }
}

// ⭐ NUEVO - Desactivar giftcard en POS
export async function deactivateGiftcard(
  payload: DeactivateGiftcardPayload
): Promise<{ success: boolean; message: string; giftcard?: Giftcard }> {
  try {
    const giftcards = getGiftcardsFromStorage();
    const giftcard = giftcards.find(gc => gc.code === payload.code);
    
    if (!giftcard) {
      return { success: false, message: 'Código de giftcard inválido' };
    }
    
    if (giftcard.activationStatus === 'DEACTIVATED') {
      return { success: false, message: 'Esta giftcard ya está desactivada' };
    }
    
    // Desactivar en POS Veriphone
    const posResult = await deactivateGiftcardInPOS(
      payload.code,
      giftcard.posTerminalId || 'VERIPHONE-001'
    );
    
    if (!posResult.success) {
      return { success: false, message: posResult.message };
    }
    
    // Actualizar estado local
    giftcard.activationStatus = 'DEACTIVATED';
    giftcard.lastPosSync = new Date().toISOString();
    giftcard.updatedAt = new Date().toISOString();
    
    saveGiftcardsToStorage(giftcards);
    
    return {
      success: true,
      message: 'Giftcard desactivada exitosamente en POS',
      giftcard,
    };
  } catch (error) {
    console.error('Error deactivating giftcard:', error);
    return {
      success: false,
      message: 'Error al desactivar la giftcard en POS',
    };
  }
}

// ⭐ NUEVO - Suspender giftcard
export async function suspendGiftcard(
  payload: SuspendGiftcardPayload
): Promise<{ success: boolean; message: string; giftcard?: Giftcard }> {
  try {
    const giftcards = getGiftcardsFromStorage();
    const giftcard = giftcards.find(gc => gc.code === payload.code);
    
    if (!giftcard) {
      return { success: false, message: 'Código de giftcard inválido' };
    }
    
    if (giftcard.activationStatus === 'SUSPENDED') {
      return { success: false, message: 'Esta giftcard ya está suspendida' };
    }
    
    // Actualizar estado local
    giftcard.activationStatus = 'SUSPENDED';
    giftcard.lastPosSync = new Date().toISOString();
    giftcard.updatedAt = new Date().toISOString();
    
    saveGiftcardsToStorage(giftcards);
    
    return {
      success: true,
      message: 'Giftcard suspendida exitosamente',
      giftcard,
    };
  } catch (error) {
    console.error('Error suspending giftcard:', error);
    return {
      success: false,
      message: 'Error al suspender la giftcard',
    };
  }
}