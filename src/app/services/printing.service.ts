/**
 * ═══════════════════════════════════════════════════════════════
 * SERVICIO - IMPRESIÓN (Print Service)
 * ═══════════════════════════════════════════════════════════════
 */

import type { PrintTestResponse } from '../types/electronic-billing.types';

// ============================================================
// Print Template Types
// ============================================================

export type PrintTemplateType = 'ticket-80mm' | 'a4' | 'custom';

export interface PrintJob {
  printerId: string;
  printerName: string;
  template: PrintTemplateType;
  data: any;
  timestamp: string;
}

export interface ReceiptData {
  // Business info
  businessName: string;
  businessRNC: string;
  businessAddress: string;
  businessPhone: string;
  
  // Document info
  documentType: string;
  documentNumber: string; // NCF / e-CF
  date: string;
  cashRegister: string;
  cashier: string;
  
  // Customer info
  customerName?: string;
  customerRNC?: string;
  
  // Items
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  
  // Totals
  subtotal: number;
  itbis: number;
  propina?: number;
  discount?: number;
  total: number;
  
  // Payment
  paymentMethod: string;
  amountReceived?: number;
  change?: number;
  
  // Footer
  qrCode?: string;
  notes?: string;
}

// ============================================================
// Print Service
// ============================================================

export class PrintService {
  /**
   * Print receipt (ticket 80mm or A4)
   */
  static async printReceipt(
    printerId: string,
    printerName: string,
    data: ReceiptData,
    template: PrintTemplateType = 'ticket-80mm'
  ): Promise<PrintTestResponse> {
    try {
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate printer
      if (!printerId) {
        return {
          success: false,
          message: 'Impresora no especificada',
          error: 'printerId es requerido',
        };
      }

      // Generate print job
      const job: PrintJob = {
        printerId,
        printerName,
        template,
        data,
        timestamp: new Date().toISOString(),
      };

      // Mock print job ID
      const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Save to print queue (localStorage)
      this.savePrintJob(jobId, job);

      console.log('🖨️ Print Job Created:', job);

      // In production, this would send to actual printer via:
      // - USB/Serial driver
      // - Network printer (ESC/POS protocol)
      // - Cloud print service
      // - Windows Print Spooler API

      return {
        success: true,
        jobId,
        message: `Impresión enviada a ${printerName}`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Error al imprimir',
        error: error.message,
      };
    }
  }

  /**
   * Print test page
   */
  static async printTestPage(
    printerId: string,
    printerName: string
  ): Promise<PrintTestResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const testData: ReceiptData = {
        businessName: 'ODIN POS - Demo',
        businessRNC: '130-12345-6',
        businessAddress: 'Av. Winston Churchill 123, Piantini, Santo Domingo',
        businessPhone: '+1 809-555-1234',
        documentType: 'PRUEBA',
        documentNumber: 'TEST-00000001',
        date: new Date().toLocaleString('es-DO'),
        cashRegister: 'Caja de Prueba',
        cashier: 'Sistema',
        items: [
          {
            description: 'Item de prueba 1',
            quantity: 1,
            unitPrice: 100,
            total: 100,
          },
          {
            description: 'Item de prueba 2',
            quantity: 2,
            unitPrice: 50,
            total: 100,
          },
        ],
        subtotal: 200,
        itbis: 36,
        total: 236,
        paymentMethod: 'Efectivo',
        notes: '*** TICKET DE PRUEBA ***',
      };

      return this.printReceipt(printerId, printerName, testData, 'ticket-80mm');
    } catch (error: any) {
      return {
        success: false,
        message: 'Error al imprimir página de prueba',
        error: error.message,
      };
    }
  }

  /**
   * Generate ticket HTML (for preview or printing)
   */
  static generateTicketHTML(data: ReceiptData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Courier New', monospace;
            width: 80mm;
            margin: 0;
            padding: 10px;
            font-size: 12px;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .separator { border-top: 1px dashed #000; margin: 8px 0; }
          .item-row {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 14px;
            margin-top: 8px;
          }
        </style>
      </head>
      <body>
        <div class="center bold">${data.businessName}</div>
        <div class="center">RNC: ${data.businessRNC}</div>
        <div class="center">${data.businessAddress}</div>
        <div class="center">Tel: ${data.businessPhone}</div>
        
        <div class="separator"></div>
        
        <div class="center bold">${data.documentType}</div>
        <div class="center">NCF: ${data.documentNumber}</div>
        <div class="center">${data.date}</div>
        <div>Caja: ${data.cashRegister}</div>
        <div>Cajero: ${data.cashier}</div>
        
        ${data.customerName ? `
          <div class="separator"></div>
          <div>Cliente: ${data.customerName}</div>
          ${data.customerRNC ? `<div>RNC: ${data.customerRNC}</div>` : ''}
        ` : ''}
        
        <div class="separator"></div>
        
        ${data.items.map(item => `
          <div class="item-row">
            <div>${item.description}</div>
          </div>
          <div class="item-row">
            <div>${item.quantity} x RD$ ${item.unitPrice.toFixed(2)}</div>
            <div>RD$ ${item.total.toFixed(2)}</div>
          </div>
        `).join('')}
        
        <div class="separator"></div>
        
        <div class="item-row">
          <div>Subtotal:</div>
          <div>RD$ ${data.subtotal.toFixed(2)}</div>
        </div>
        
        <div class="item-row">
          <div>ITBIS (18%):</div>
          <div>RD$ ${data.itbis.toFixed(2)}</div>
        </div>
        
        ${data.propina ? `
          <div class="item-row">
            <div>10% de Ley:</div>
            <div>RD$ ${data.propina.toFixed(2)}</div>
          </div>
        ` : ''}
        
        ${data.discount ? `
          <div class="item-row">
            <div>Descuento:</div>
            <div>-RD$ ${data.discount.toFixed(2)}</div>
          </div>
        ` : ''}
        
        <div class="total-row">
          <div>TOTAL:</div>
          <div>RD$ ${data.total.toFixed(2)}</div>
        </div>
        
        <div class="separator"></div>
        
        <div class="item-row">
          <div>Método de pago:</div>
          <div>${data.paymentMethod}</div>
        </div>
        
        ${data.amountReceived ? `
          <div class="item-row">
            <div>Recibido:</div>
            <div>RD$ ${data.amountReceived.toFixed(2)}</div>
          </div>
          <div class="item-row">
            <div>Cambio:</div>
            <div>RD$ ${(data.change || 0).toFixed(2)}</div>
          </div>
        ` : ''}
        
        ${data.qrCode ? `
          <div class="separator"></div>
          <div class="center">
            <div>Verificar en:</div>
            <div style="font-size: 10px;">${data.qrCode}</div>
          </div>
        ` : ''}
        
        ${data.notes ? `
          <div class="separator"></div>
          <div class="center">${data.notes}</div>
        ` : ''}
        
        <div class="separator"></div>
        <div class="center">¡Gracias por su compra!</div>
      </body>
      </html>
    `;
  }

  /**
   * Save print job to queue
   */
  private static savePrintJob(jobId: string, job: PrintJob): void {
    const key = `odin-print-queue`;
    const data = localStorage.getItem(key);
    const queue: Record<string, PrintJob> = data ? JSON.parse(data) : {};
    
    queue[jobId] = job;
    
    // Keep only last 100 jobs
    const entries = Object.entries(queue);
    if (entries.length > 100) {
      const trimmed = Object.fromEntries(entries.slice(-100));
      localStorage.setItem(key, JSON.stringify(trimmed));
    } else {
      localStorage.setItem(key, JSON.stringify(queue));
    }
  }

  /**
   * Get print queue
   */
  static getPrintQueue(): PrintJob[] {
    const key = `odin-print-queue`;
    const data = localStorage.getItem(key);
    const queue: Record<string, PrintJob> = data ? JSON.parse(data) : {};
    return Object.values(queue);
  }
}
