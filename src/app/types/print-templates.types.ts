/**
 * ═══════════════════════════════════════════════════════════════
 * EDITOR DE PLANTILLAS DE IMPRESIÓN - TIPOS TYPESCRIPT
 * ═══════════════════════════════════════════════════════════════
 * Sistema para editar facturas, tickets y comandas sin tocar código
 */

// ============================================================
// ENUMS Y CONSTANTES
// ============================================================

export type PrintTemplateType = 'invoice' | 'ticket' | 'kitchen_order' | 'bar_order' | 'delivery_receipt';
export type BlockType = 
  | 'header' 
  | 'business_info' 
  | 'customer_info' 
  | 'items' 
  | 'subtotals' 
  | 'totals' 
  | 'payment_info' 
  | 'footer' 
  | 'custom_text'
  | 'separator'
  | 'qr_code'
  | 'barcode'
  | 'image';

export type AlignmentType = 'left' | 'center' | 'right';
export type FontSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type FontWeightType = 'normal' | 'bold';

// ============================================================
// CONFIGURACIÓN DE BLOQUE
// ============================================================

export interface BlockConfig {
  id: string;
  type: BlockType;
  label: string;
  order: number;
  visible: boolean;
  required: boolean; // No se puede eliminar si es true
  
  // Estilos
  alignment: AlignmentType;
  fontSize: FontSizeType;
  fontWeight: FontWeightType;
  paddingTop: number;
  paddingBottom: number;
  
  // Contenido específico por tipo de bloque
  content?: {
    // Para custom_text
    text?: string;
    
    // Para header
    showLogo?: boolean;
    showBusinessName?: boolean;
    
    // Para items
    showImages?: boolean;
    showPrices?: boolean;
    showQuantity?: boolean;
    showSubtotal?: boolean;
    
    // Para totals
    showSubtotal?: boolean;
    showTax?: boolean;
    showDiscount?: boolean;
    showTip?: boolean;
    showTotal?: boolean;
    
    // Para QR/Barcode
    data?: string;
    size?: number;
    
    // Para image
    imageUrl?: string;
    height?: number;
  };
}

// ============================================================
// PLANTILLA
// ============================================================

export interface PrintTemplate {
  id: string;
  name: string;
  description?: string;
  type: PrintTemplateType;
  
  // Configuración general
  paperWidth: number; // en mm (58mm, 80mm típicos para térmicas)
  paperType: 'thermal' | 'a4' | 'letter';
  
  // Bloques ordenados
  blocks: BlockConfig[];
  
  // Metadata
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// ============================================================
// OVERRIDE POR CLIENTE
// ============================================================

export interface ClientTemplateOverride {
  id: string;
  clientId: string;
  clientName: string;
  templateId: string; // Referencia a la plantilla base
  
  // Solo se guardan las diferencias
  overrides: {
    blockId: string;
    changes: Partial<BlockConfig>;
  }[];
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// DATOS PARA RENDERIZADO
// ============================================================

export interface PrintData {
  // Información del negocio
  business: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    taxId?: string;
    logo?: string;
  };
  
  // Información del cliente
  customer?: {
    name: string;
    taxId?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  
  // Información de la transacción
  transaction: {
    id: string;
    number: string; // Número de factura/ticket
    date: string;
    time: string;
    type: 'sale' | 'refund';
  };
  
  // Items (SIEMPRE REQUERIDO)
  items: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    tax?: number;
    discount?: number;
    notes?: string;
    image?: string;
  }[];
  
  // Totales (SIEMPRE REQUERIDO)
  totals: {
    subtotal: number;
    tax: number;
    discount: number;
    tip?: number; // Propina (sugerida 10%)
    shipping?: number;
    total: number;
  };
  
  // Información de pago
  payment?: {
    method: string;
    amountPaid: number;
    change: number;
    reference?: string;
  };
  
  // Texto personalizado
  customText?: {
    header?: string;
    footer?: string;
  };
}

// ============================================================
// DTOs PARA API (Backend ASP.NET Core)
// ============================================================

export interface CreateTemplateDto {
  name: string;
  description?: string;
  type: PrintTemplateType;
  paperWidth: number;
  paperType: 'thermal' | 'a4' | 'letter';
  blocks: BlockConfig[];
}

export interface UpdateTemplateDto extends Partial<CreateTemplateDto> {
  id: string;
}

export interface CreateOverrideDto {
  clientId: string;
  templateId: string;
  overrides: {
    blockId: string;
    changes: Partial<BlockConfig>;
  }[];
}

export interface RenderTemplateRequest {
  templateId: string;
  clientId?: string; // Si se proporciona, aplica overrides
  data: PrintData;
  format: 'html' | 'pdf' | 'raw'; // raw = ESC/POS commands
}

export interface RenderTemplateResponse {
  content: string; // HTML, PDF base64, o ESC/POS commands
  format: 'html' | 'pdf' | 'raw';
  width: number;
  height?: number;
}

// ============================================================
// UTILIDADES
// ============================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface TemplateValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}