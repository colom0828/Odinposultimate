/**
 * ═══════════════════════════════════════════════════════════════
 * PRINT TEMPLATES API SERVICE
 * ═══════════════════════════════════════════════════════════════
 * Simula endpoints de ASP.NET Core usando localStorage
 * En producción, reemplazar con llamadas HTTP reales
 */

import {
  PrintTemplate,
  ClientTemplateOverride,
  CreateTemplateDto,
  UpdateTemplateDto,
  CreateOverrideDto,
  RenderTemplateRequest,
  RenderTemplateResponse,
  PrintData,
  BlockConfig,
  TemplateValidationResult,
  ValidationError,
} from '../types/print-templates.types';

const STORAGE_KEY_TEMPLATES = 'odin-print-templates';
const STORAGE_KEY_OVERRIDES = 'odin-template-overrides';

// ============================================================
// VALIDACIÓN
// ============================================================

export function validateTemplate(template: PrintTemplate): TemplateValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  // Validar que existe al menos un bloque de items
  const hasItemsBlock = template.blocks.some(b => b.type === 'items');
  if (!hasItemsBlock) {
    errors.push({
      field: 'blocks',
      message: 'La plantilla debe tener al menos un bloque de tipo "items"'
    });
  }

  // Validar que existe al menos un bloque de totales
  const hasTotalsBlock = template.blocks.some(b => b.type === 'totals');
  if (!hasTotalsBlock) {
    errors.push({
      field: 'blocks',
      message: 'La plantilla debe tener al menos un bloque de tipo "totals"'
    });
  }

  // Validar que no hay bloques duplicados críticos
  const itemsBlocks = template.blocks.filter(b => b.type === 'items');
  if (itemsBlocks.length > 1) {
    warnings.push('Hay múltiples bloques de items. Solo se renderizará el primero.');
  }

  // Validar orden de bloques
  const orders = template.blocks.map(b => b.order);
  const hasDuplicateOrders = orders.length !== new Set(orders).size;
  if (hasDuplicateOrders) {
    warnings.push('Hay bloques con el mismo orden. Se reordenarán automáticamente.');
  }

  // Validar nombre
  if (!template.name || template.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'El nombre de la plantilla es obligatorio'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validatePrintData(data: PrintData): TemplateValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  // Validar items
  if (!data.items || data.items.length === 0) {
    errors.push({
      field: 'items',
      message: 'Debe haber al menos un item para imprimir'
    });
  }

  // Validar totales
  if (!data.totals) {
    errors.push({
      field: 'totals',
      message: 'Los totales son obligatorios'
    });
  } else {
    // Verificar que el total coincida con la suma de items
    const calculatedTotal = data.items.reduce((sum, item) => sum + item.subtotal, 0);
    const difference = Math.abs(calculatedTotal - data.totals.subtotal);
    
    if (difference > 0.01) { // Tolerancia de 1 centavo por redondeo
      warnings.push(`El subtotal calculado ($${calculatedTotal.toFixed(2)}) no coincide con el subtotal informado ($${data.totals.subtotal.toFixed(2)})`);
    }
  }

  // Validar business info
  if (!data.business || !data.business.name) {
    errors.push({
      field: 'business.name',
      message: 'El nombre del negocio es obligatorio'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// ============================================================
// CRUD TEMPLATES
// ============================================================

export async function getAllTemplates(): Promise<PrintTemplate[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const stored = localStorage.getItem(STORAGE_KEY_TEMPLATES);
  if (!stored) {
    // Crear plantilla por defecto SIN llamar a saveTemplate para evitar recursión
    const defaultTemplate = createDefaultTemplate();
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify([defaultTemplate]));
    return [defaultTemplate];
  }
  
  return JSON.parse(stored);
}

export async function getTemplateById(id: string): Promise<PrintTemplate | null> {
  const templates = await getAllTemplates();
  return templates.find(t => t.id === id) || null;
}

export async function getTemplatesByType(type: string): Promise<PrintTemplate[]> {
  const templates = await getAllTemplates();
  return templates.filter(t => t.type === type && t.isActive);
}

export async function saveTemplate(template: PrintTemplate): Promise<PrintTemplate> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Validar antes de guardar
  const validation = validateTemplate(template);
  if (!validation.isValid) {
    throw new Error(`Validación fallida: ${validation.errors.map(e => e.message).join(', ')}`);
  }
  
  const templates = await getAllTemplates();
  const existingIndex = templates.findIndex(t => t.id === template.id);
  
  if (existingIndex >= 0) {
    templates[existingIndex] = {
      ...template,
      updatedAt: new Date().toISOString()
    };
  } else {
    templates.push({
      ...template,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(templates));
  return template;
}

export async function createTemplate(dto: CreateTemplateDto): Promise<PrintTemplate> {
  const newTemplate: PrintTemplate = {
    id: `template-${Date.now()}`,
    ...dto,
    isDefault: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user-id' // En producción, obtener del contexto
  };
  
  return await saveTemplate(newTemplate);
}

export async function updateTemplate(dto: UpdateTemplateDto): Promise<PrintTemplate> {
  const existing = await getTemplateById(dto.id);
  if (!existing) {
    throw new Error('Plantilla no encontrada');
  }
  
  const updated: PrintTemplate = {
    ...existing,
    ...dto,
    updatedAt: new Date().toISOString()
  };
  
  return await saveTemplate(updated);
}

export async function deleteTemplate(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const templates = await getAllTemplates();
  const filtered = templates.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(filtered));
}

export async function duplicateTemplate(id: string, newName: string): Promise<PrintTemplate> {
  const original = await getTemplateById(id);
  if (!original) {
    throw new Error('Plantilla no encontrada');
  }
  
  const duplicate: PrintTemplate = {
    ...original,
    id: `template-${Date.now()}`,
    name: newName,
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return await saveTemplate(duplicate);
}

// ============================================================
// CRUD OVERRIDES
// ============================================================

export async function getAllOverrides(): Promise<ClientTemplateOverride[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const stored = localStorage.getItem(STORAGE_KEY_OVERRIDES);
  return stored ? JSON.parse(stored) : [];
}

export async function getOverrideByClientAndTemplate(
  clientId: string,
  templateId: string
): Promise<ClientTemplateOverride | null> {
  const overrides = await getAllOverrides();
  return overrides.find(o => o.clientId === clientId && o.templateId === templateId) || null;
}

export async function createOverride(dto: CreateOverrideDto): Promise<ClientTemplateOverride> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const overrides = await getAllOverrides();
  
  // Verificar si ya existe
  const existingIndex = overrides.findIndex(
    o => o.clientId === dto.clientId && o.templateId === dto.templateId
  );
  
  const newOverride: ClientTemplateOverride = {
    id: `override-${Date.now()}`,
    ...dto,
    clientName: 'Cliente Demo', // En producción, obtener de la BD
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (existingIndex >= 0) {
    overrides[existingIndex] = newOverride;
  } else {
    overrides.push(newOverride);
  }
  
  localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(overrides));
  return newOverride;
}

export async function deleteOverride(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const overrides = await getAllOverrides();
  const filtered = overrides.filter(o => o.id !== id);
  localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(filtered));
}

// ============================================================
// APLICAR OVERRIDES
// ============================================================

export function applyOverrides(
  template: PrintTemplate,
  override: ClientTemplateOverride
): PrintTemplate {
  const clonedTemplate = JSON.parse(JSON.stringify(template));
  
  override.overrides.forEach(({ blockId, changes }) => {
    const blockIndex = clonedTemplate.blocks.findIndex((b: BlockConfig) => b.id === blockId);
    if (blockIndex >= 0) {
      clonedTemplate.blocks[blockIndex] = {
        ...clonedTemplate.blocks[blockIndex],
        ...changes
      };
    }
  });
  
  return clonedTemplate;
}

// ============================================================
// RENDER
// ============================================================

export async function renderTemplate(
  request: RenderTemplateRequest
): Promise<RenderTemplateResponse> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener plantilla
  let template = await getTemplateById(request.templateId);
  if (!template) {
    throw new Error('Plantilla no encontrada');
  }
  
  // Aplicar overrides si hay clientId
  if (request.clientId) {
    const override = await getOverrideByClientAndTemplate(request.clientId, request.templateId);
    if (override) {
      template = applyOverrides(template, override);
    }
  }
  
  // Validar datos
  const validation = validatePrintData(request.data);
  if (!validation.isValid) {
    throw new Error(`Datos inválidos: ${validation.errors.map(e => e.message).join(', ')}`);
  }
  
  // Generar HTML
  const html = generateHTML(template, request.data);
  
  return {
    content: html,
    format: 'html',
    width: template.paperWidth
  };
}

// ============================================================
// GENERADOR DE HTML
// ============================================================

function generateHTML(template: PrintTemplate, data: PrintData): string {
  const blocks = template.blocks
    .filter(b => b.visible)
    .sort((a, b) => a.order - b.order);
  
  let html = `
    <div class="print-template" style="width: ${template.paperWidth}mm; font-family: monospace; padding: 4mm;">
  `;
  
  blocks.forEach(block => {
    html += generateBlockHTML(block, data);
  });
  
  html += '</div>';
  return html;
}

function generateBlockHTML(block: BlockConfig, data: PrintData): string {
  const style = `
    text-align: ${block.alignment};
    font-size: ${getFontSizeCSS(block.fontSize)};
    font-weight: ${block.fontWeight};
    padding-top: ${block.paddingTop}mm;
    padding-bottom: ${block.paddingBottom}mm;
  `;
  
  let content = '';
  
  switch (block.type) {
    case 'header':
      content = generateHeaderBlock(block, data);
      break;
    case 'business_info':
      content = generateBusinessInfoBlock(block, data);
      break;
    case 'customer_info':
      content = generateCustomerInfoBlock(data);
      break;
    case 'items':
      content = generateItemsBlock(block, data);
      break;
    case 'totals':
      content = generateTotalsBlock(block, data);
      break;
    case 'payment_info':
      content = generatePaymentInfoBlock(data);
      break;
    case 'separator':
      content = '<hr style="border-top: 1px dashed #000;">';
      break;
    case 'footer':
      content = generateFooterBlock(data);
      break;
    case 'custom_text':
      content = block.content?.text || '';
      break;
    default:
      content = '';
  }
  
  return `<div style="${style}">${content}</div>`;
}

function generateHeaderBlock(block: BlockConfig, data: PrintData): string {
  let html = '';
  if (block.content?.showBusinessName) {
    html += `<strong>${data.business.name}</strong><br>`;
  }
  return html;
}

function generateBusinessInfoBlock(block: BlockConfig, data: PrintData): string {
  // Usar los datos configurables del bloque, o usar defaults
  const businessName = block.content?.businessName || data.business.name || 'Demo República Dominicana';
  const businessRNC = block.content?.businessRNC || data.business.taxId || 'null';
  const businessNCF = block.content?.businessNCF || 'B0200000188';
  
  return `
    <div style="text-align: center; font-size: 9pt; line-height: 1.4;">
      ${businessName}<br>
      RNC: ${businessRNC}<br>
    </div>
    <div style="border-bottom: 1px dashed #000; margin: 8px 0;"></div>
    <div style="text-align: center; font-weight: bold; font-size: 10pt; margin: 8px 0;">
      Factura de Consumo
    </div>
    <div style="text-align: center; font-size: 9pt; margin-bottom: 8px;">
      NCF: ${businessNCF}
    </div>
    <div style="border-bottom: 1px dashed #000; margin: 8px 0;"></div>
  `;
}

function generateCustomerInfoBlock(data: PrintData): string {
  const now = new Date();
  const orderNumber = data.orderNumber || '2-3-2838-20853';
  const orderDate = data.orderDate || now.toISOString().split('T')[0];
  const orderTime = data.orderTime || now.toTimeString().split(' ')[0].substring(0, 8);
  
  return `
    <div style="font-size: 9pt; line-height: 1.5;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="text-align: left;">Número Orden:</td>
          <td style="text-align: right;">${orderNumber}</td>
        </tr>
        <tr>
          <td style="text-align: left;">Fecha Orden:</td>
          <td style="text-align: right;">${orderDate} ${orderTime}</td>
        </tr>
        <tr>
          <td style="text-align: left;">Cajero:</td>
          <td style="text-align: right;">${data.cashier || 'daimy garcias'}</td>
        </tr>
        <tr>
          <td style="text-align: left;">Tipo:</td>
          <td style="text-align: right;">Consumidor Final</td>
        </tr>
        <tr>
          <td style="text-align: left;">Nombre y Apellido:</td>
          <td style="text-align: right;">${data.customer?.name || 'Cliente Contado'}</td>
        </tr>
      </table>
    </div>
    <div style="border-bottom: 1px dashed #000; margin: 8px 0;"></div>
  `;
}

function generateItemsBlock(block: BlockConfig, data: PrintData): string {
  let html = `
    <div style="font-size: 9pt; font-weight: bold; margin-bottom: 4px; border-bottom: 1px dashed #000; padding-bottom: 4px;">
      <table style="width: 100%;">
        <tr>
          <td style="text-align: left;">DESCRIPCION</td>
          <td style="text-align: right;">PRECIO</td>
        </tr>
      </table>
    </div>
  `;
  
  html += '<table style="width: 100%; border-collapse: collapse; font-size: 9pt; margin-top: 4px;">';
  
  data.items.forEach(item => {
    html += `
      <tr style="line-height: 1.4;">
        <td style="text-align: left;">${item.name}</td>
        <td style="text-align: right;">${item.quantity}.0x$${(item.subtotal / item.quantity).toFixed(2)}</td>
      </tr>
      <tr style="line-height: 1.4;">
        <td style="text-align: left;"></td>
        <td style="text-align: right;">1x$${item.subtotal.toFixed(2)}</td>
      </tr>
    `;
  });
  
  html += '</table>';
  html += '<div style="border-bottom: 1px dashed #000; margin: 8px 0;"></div>';
  return html;
}

function generateTotalsBlock(block: BlockConfig, data: PrintData): string {
  let html = '<table style="width: 100%;">';
  
  if (block.content?.showSubtotal) {
    html += `<tr><td>Subtotal:</td><td style="text-align: right;">$${data.totals.subtotal.toFixed(2)}</td></tr>`;
  }
  if (block.content?.showTax && data.totals.tax > 0) {
    html += `<tr><td>ITBIS (18%):</td><td style="text-align: right;">$${data.totals.tax.toFixed(2)}</td></tr>`;
  }
  if (block.content?.showDiscount && data.totals.discount > 0) {
    html += `<tr><td>Descuento:</td><td style="text-align: right;">-$${data.totals.discount.toFixed(2)}</td></tr>`;
  }
  if (block.content?.showTip && data.totals.tip && data.totals.tip > 0) {
    html += `<tr><td>10% de Ley:</td><td style="text-align: right;">$${data.totals.tip.toFixed(2)}</td></tr>`;
  }
  if (block.content?.showTotal) {
    html += `<tr><td><strong>TOTAL:</strong></td><td style="text-align: right;"><strong>$${data.totals.total.toFixed(2)}</strong></td></tr>`;
  }
  
  html += '</table>';
  return html;
}

function generatePaymentInfoBlock(data: PrintData): string {
  if (!data.payment) return '';
  
  return `
    <div style="border-bottom: 1px dashed #000; margin: 8px 0;\"></div>
    <div style="font-size: 9pt; margin: 8px 0;">
      <table style="width: 100%;">
        <tr>
          <td style="text-align: left;">${data.payment.method || 'Tarjeta de Débito'}:</td>
          <td style="text-align: right;">$${data.payment.amountPaid.toFixed(2)}</td>
        </tr>
      </table>
    </div>
    <div style="border-bottom: 1px dashed #000; margin: 12px 0;\"></div>
  `;
}

function generateFooterBlock(data: PrintData): string {
  return `
    <div style="text-align: center; font-size: 8pt; margin-top: 16px;">
      ${data.customText?.footer || 'Powered By invu_pos (2.11.7)'}
    </div>
  `;
}

function getFontSizeCSS(size: string): string {
  const sizes = {
    xs: '8pt',
    sm: '10pt',
    md: '12pt',
    lg: '14pt',
    xl: '16pt'
  };
  return sizes[size as keyof typeof sizes] || '10pt';
}

// ============================================================
// PLANTILLA POR DEFECTO
// ============================================================

function createDefaultTemplate(): PrintTemplate {
  return {
    id: 'template-default',
    name: 'Ticket Térmico Estándar',
    description: 'Plantilla por defecto para tickets de venta',
    type: 'ticket',
    paperWidth: 80,
    paperType: 'thermal',
    isDefault: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    blocks: [
      {
        id: 'block-header',
        type: 'header',
        label: 'Encabezado',
        order: 0,
        visible: true,
        required: true,
        alignment: 'center',
        fontSize: 'lg',
        fontWeight: 'bold',
        paddingTop: 2,
        paddingBottom: 2,
        content: { showLogo: true, showBusinessName: true }
      },
      {
        id: 'block-business',
        type: 'business_info',
        label: 'Información del Negocio',
        order: 1,
        visible: true,
        required: false,
        alignment: 'center',
        fontSize: 'sm',
        fontWeight: 'normal',
        paddingTop: 1,
        paddingBottom: 2
      },
      {
        id: 'block-sep-1',
        type: 'separator',
        label: 'Separador',
        order: 2,
        visible: true,
        required: false,
        alignment: 'center',
        fontSize: 'sm',
        fontWeight: 'normal',
        paddingTop: 1,
        paddingBottom: 1
      },
      {
        id: 'block-customer',
        type: 'customer_info',
        label: 'Información del Cliente',
        order: 3,
        visible: true,
        required: false,
        alignment: 'left',
        fontSize: 'sm',
        fontWeight: 'normal',
        paddingTop: 1,
        paddingBottom: 1
      },
      {
        id: 'block-sep-2',
        type: 'separator',
        label: 'Separador',
        order: 4,
        visible: true,
        required: false,
        alignment: 'center',
        fontSize: 'sm',
        fontWeight: 'normal',
        paddingTop: 1,
        paddingBottom: 1
      },
      {
        id: 'block-items',
        type: 'items',
        label: 'Productos/Servicios',
        order: 5,
        visible: true,
        required: true,
        alignment: 'left',
        fontSize: 'sm',
        fontWeight: 'normal',
        paddingTop: 1,
        paddingBottom: 1,
        content: {
          showImages: false,
          showPrices: true,
          showQuantity: true,
          showSubtotal: true
        }
      },
      {
        id: 'block-sep-3',
        type: 'separator',
        label: 'Separador',
        order: 6,
        visible: true,
        required: false,
        alignment: 'center',
        fontSize: 'sm',
        fontWeight: 'normal',
        paddingTop: 1,
        paddingBottom: 1
      },
      {
        id: 'block-totals',
        type: 'totals',
        label: 'Totales',
        order: 7,
        visible: true,
        required: true,
        alignment: 'right',
        fontSize: 'md',
        fontWeight: 'bold',
        paddingTop: 1,
        paddingBottom: 2,
        content: {
          showSubtotal: true,
          showTax: true,
          showDiscount: true,
          showTip: true,
          showTotal: true
        }
      },
      {
        id: 'block-payment',
        type: 'payment_info',
        label: 'Información de Pago',
        order: 8,
        visible: true,
        required: false,
        alignment: 'left',
        fontSize: 'sm',
        fontWeight: 'normal',
        paddingTop: 1,
        paddingBottom: 2
      },
      {
        id: 'block-sep-4',
        type: 'separator',
        label: 'Separador',
        order: 9,
        visible: true,
        required: false,
        alignment: 'center',
        fontSize: 'sm',
        fontWeight: 'normal',
        paddingTop: 1,
        paddingBottom: 1
      },
      {
        id: 'block-footer',
        type: 'footer',
        label: 'Pie de Página',
        order: 10,
        visible: true,
        required: false,
        alignment: 'center',
        fontSize: 'xs',
        fontWeight: 'normal',
        paddingTop: 2,
        paddingBottom: 2
      }
    ]
  };
}