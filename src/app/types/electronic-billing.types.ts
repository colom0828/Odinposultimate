/**
 * ═══════════════════════════════════════════════════════════════
 * TIPOS - FACTURACIÓN ELECTRÓNICA DOMINICANA (DGII / e-CF RD)
 * ═══════════════════════════════════════════════════════════════
 */

// ============================================================
// Enums
// ============================================================

export type BillingProvider = 'digifact' | 'other';
export type BillingEnvironment = 'sandbox' | 'production';
export type TaxpayerType = 'persona-fisica' | 'persona-juridica';
export type DocumentType = 
  | 'CONSUMO'
  | 'CREDITO_FISCAL'
  | 'GUBERNAMENTAL'
  | 'NOTA_CREDITO'
  | 'NOTA_DEBITO'
  | 'REGIMENES_ESPECIALES';

export type BillingStatus = 
  | 'PENDING'
  | 'ISSUED'
  | 'FAILED'
  | 'CANCELLED'
  | 'VOIDED';

export type PrintStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

// ============================================================
// Electronic Billing Configuration (por Caja)
// ============================================================

export interface ElectronicBillingConfig {
  id: string;
  cashRegisterId: string;
  cashRegisterName: string;
  printerId: string;
  printerName: string;
  
  // Provider info
  provider: BillingProvider;
  environment: BillingEnvironment;
  
  // Taxpayer info
  rnc: string;
  dv?: string; // Dígito Verificador
  taxpayerType: TaxpayerType;
  legalName: string;
  
  // Location info
  branchCode: string;
  locationCode: string;
  
  // Credentials
  username: string;
  passwordEncrypted: string; // En localStorage será plain, en producción encriptado
  
  // Settings
  settings: BillingSettings;
  
  // Status
  isActive: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface BillingSettings {
  production: boolean;
  simplifiedTicket: boolean;
  printTaxReceipt: boolean;
  autoIssue: boolean; // Emitir automáticamente al cerrar venta
  autoPrint: boolean; // Imprimir automáticamente
  templateType: 'ticket-80mm' | 'a4' | 'custom';
  regimenEspecial?: string;
}

// ============================================================
// Electronic Billing Sequences (rangos por tipo de documento)
// ============================================================

export interface ElectronicBillingSequence {
  id: string;
  configId: string;
  documentType: DocumentType;
  
  // Sequence info
  prefix?: string; // Ej: "B02" para consumo
  series?: string;
  currentNumber: number;
  startNumber: number;
  endNumber: number;
  
  // Status
  active: boolean;
  
  // Timestamps
  updatedAt: string;
}

// ============================================================
// Electronic Billing Logs
// ============================================================

export interface ElectronicBillingLog {
  id: string;
  configId: string;
  orderId?: string;
  cashRegisterId: string;
  
  // Document info
  documentType: DocumentType;
  documentNumber: string; // NCF / e-CF completo
  
  // Request/Response
  requestPayload: any;
  responsePayload: any;
  
  // Status
  status: BillingStatus;
  errorMessage?: string;
  
  // Timestamps
  createdAt: string;
}

// ============================================================
// Invoice Data (datos para emitir)
// ============================================================

export interface InvoiceData {
  // Cliente
  customer: {
    name: string;
    rnc?: string;
    identificationType?: 'RNC' | 'CEDULA' | 'PASAPORTE' | 'CONSUMIDOR_FINAL';
    identificationNumber?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  
  // Items
  items: InvoiceItem[];
  
  // Totals
  subtotal: number;
  discount: number;
  itbis: number; // 18% en RD
  propina?: number; // 10% ley opcional
  total: number;
  
  // Payment
  paymentMethod: string;
  
  // Document type override (si no, se calcula automáticamente)
  documentType?: DocumentType;
  
  // Metadata
  notes?: string;
  referenceNumber?: string; // Para notas de crédito
}

export interface InvoiceItem {
  code: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  itbis: number;
  total: number;
  itbisRate?: number; // 18, 16, 0, exento
}

// ============================================================
// Response Types
// ============================================================

export interface IssueInvoiceResponse {
  success: boolean;
  documentNumber?: string; // NCF / e-CF
  documentType?: DocumentType;
  qrCode?: string;
  pdfUrl?: string;
  xmlUrl?: string;
  error?: string;
  errorDetails?: any;
}

export interface TestConnectionResponse {
  success: boolean;
  message: string;
  provider?: string;
  environment?: string;
  error?: string;
}

export interface PrintTestResponse {
  success: boolean;
  jobId?: string;
  message: string;
  error?: string;
}

// ============================================================
// Form Data Types
// ============================================================

export interface ElectronicBillingFormData {
  // Config básica
  provider: BillingProvider;
  environment: BillingEnvironment;
  
  // Secuencias
  facturaConsumo: string;
  notaCredito: string;
  comprobanteCredito: string;
  comprobanteGubernamental: string;
  branchCode: string;
  
  // Taxpayer
  rnc: string;
  dv?: string;
  taxpayerType: TaxpayerType;
  legalName: string;
  
  // Location
  locationCode: string;
  
  // Credentials
  username: string;
  password: string;
  
  // Settings
  regimenEspecial?: string;
  production: boolean;
  simplifiedTicket: boolean;
  printTaxReceipt: boolean;
  autoIssue: boolean;
  autoPrint: boolean;
  
  // Asociaciones
  cashRegisterId: string;
  printerId: string;
}
