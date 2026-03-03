/**
 * ═══════════════════════════════════════════════════════════════
 * TIPOS - GIFTCARDS / TARJETAS DE REGALO
 * ═══════════════════════════════════════════════════════════════
 */

// ============================================================
// Enums
// ============================================================

export type GiftcardStatus = 'ACTIVE' | 'DEPLETED' | 'EXPIRED' | 'VOIDED';
export type GiftcardType = 'DIGITAL' | 'PHYSICAL';
export type GiftcardMovementType = 'SALE' | 'REDEEM' | 'RECHARGE' | 'VOID' | 'ADJUST';

// ⭐ NUEVO - Estados de activación POS
export type GiftcardActivationStatus = 
  | 'PENDING_ACTIVATION'   // Creada pero no activada en POS
  | 'ACTIVATED'            // Activada y lista para usar
  | 'SUSPENDED'            // Suspendida temporalmente
  | 'DEACTIVATED';         // Desactivada permanentemente

// ============================================================
// Giftcard
// ============================================================

export interface Giftcard {
  id: string;
  code: string;
  beneficiaryName: string;
  beneficiaryPhone?: string;
  beneficiaryEmail?: string;
  type: GiftcardType;
  status: GiftcardStatus;
  initialAmount: number;
  balance: number;
  currency: string;
  expiresAt?: string; // ISO date string
  message?: string; // Mensaje personalizado
  
  // ⭐ NUEVO - Activación POS
  activationStatus: GiftcardActivationStatus;
  activatedAt?: string; // Fecha de activación en POS
  activatedBy?: string; // Usuario que activó
  posTerminalId?: string; // ID del terminal POS Veriphone
  posTransactionId?: string; // ID de transacción en POS
  lastPosSync?: string; // Última sincronización con POS
  
  // Metadata
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  
  // Para variaciones por tipo de negocio
  packageId?: string; // Para Spa: paquete de servicios
  packageName?: string;
}

// ============================================================
// Giftcard Movement (Historial)
// ============================================================

export interface GiftcardMovement {
  id: string;
  giftcardId: string;
  type: GiftcardMovementType;
  amount: number; // Positivo para SALE/RECHARGE, negativo para REDEEM
  balanceBefore: number;
  balanceAfter: number;
  
  // Referencias
  reference?: string; // ID de ticket/factura/orden
  referenceType?: 'SALE' | 'ORDER' | 'APPOINTMENT' | 'TABLE' | 'DELIVERY';
  reason?: string; // Para VOID o ADJUST
  
  // Metadata
  createdAt: string;
  createdBy: string;
  notes?: string;
}

// ============================================================
// DTOs para formularios
// ============================================================

export interface CreateGiftcardPayload {
  initialAmount: number;
  currency: string;
  expiresAt?: string;
  type: GiftcardType;
  beneficiaryName: string;
  beneficiaryPhone?: string;
  beneficiaryEmail?: string;
  message?: string;
  
  // Opciones de venta
  sellNow: boolean; // true = genera venta en caja
  
  // Para Spa
  packageId?: string;
  packageName?: string;
}

export interface RedeemGiftcardPayload {
  code: string;
  amount: number;
  referenceType?: 'SALE' | 'ORDER' | 'APPOINTMENT' | 'TABLE' | 'DELIVERY';
  reference?: string;
  notes?: string;
}

export interface RechargeGiftcardPayload {
  code: string;
  amount: number;
  mode: 'SALE' | 'ADJUST'; // SALE = venta en caja, ADJUST = ajuste administrativo
  reason?: string;
}

export interface VoidGiftcardPayload {
  code: string;
  reason: string;
}

// ⭐ NUEVO - Payloads para activación POS
export interface ActivateGiftcardPayload {
  code: string;
  posTerminalId: string;
  userId: string;
}

export interface DeactivateGiftcardPayload {
  code: string;
  reason: string;
  userId: string;
}

export interface SuspendGiftcardPayload {
  code: string;
  reason: string;
  userId: string;
}

// ============================================================
// Filtros
// ============================================================

export interface GiftcardFilters {
  search?: string; // Buscar por código/cliente/teléfono
  status?: GiftcardStatus;
  type?: GiftcardType;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================================
// KPIs
// ============================================================

export interface GiftcardKPIs {
  totalPendingBalance: number; // Liability - saldo total pendiente
  soldThisMonth: number;
  redeemedThisMonth: number;
  rechargedThisMonth: number;
  activeCount: number;
  expiredCount: number;
  voidedCount: number;
}

// ============================================================
// Para variaciones por tipo de negocio
// ============================================================

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  value: number;
  services: string[]; // IDs de servicios incluidos
}

// ============================================================
// Contexto de redención por tipo de negocio
// ============================================================

export type RedemptionContext = 
  | { type: 'RESTAURANT'; tableId?: string; orderType?: 'DINE_IN' | 'TAKEOUT' | 'DELIVERY' }
  | { type: 'SPA'; appointmentId?: string; serviceIds?: string[] }
  | { type: 'RETAIL'; invoiceId?: string; allowRefund?: boolean };

// ============================================================
// ⭐ NUEVO - Integración Veriphone POS
// ============================================================

export interface VeriphonePOSConfig {
  terminalId: string;
  merchantId: string;
  apiEndpoint: string;
  apiKey: string;
  enabled: boolean;
}

export interface VeriphonePOSRequest {
  terminalId: string;
  transactionType: 'ACTIVATE' | 'DEACTIVATE' | 'BALANCE_INQUIRY' | 'RELOAD';
  cardNumber: string; // Código de giftcard
  amount?: number;
  reference?: string;
}

export interface VeriphonePOSResponse {
  success: boolean;
  transactionId: string;
  responseCode: string;
  responseMessage: string;
  timestamp: string;
  cardNumber?: string;
  balance?: number;
  activationStatus?: GiftcardActivationStatus;
}

export interface POSTerminal {
  id: string;
  name: string;
  model: 'VERIPHONE' | 'OTHER';
  serialNumber: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  lastSync?: string;
  location?: string;
}