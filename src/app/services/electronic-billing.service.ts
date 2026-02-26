/**
 * ═══════════════════════════════════════════════════════════════
 * SERVICIO - FACTURACIÓN ELECTRÓNICA DOMINICANA (DGII / e-CF RD)
 * ═══════════════════════════════════════════════════════════════
 */

import type {
  ElectronicBillingConfig,
  ElectronicBillingSequence,
  ElectronicBillingLog,
  InvoiceData,
  IssueInvoiceResponse,
  TestConnectionResponse,
  DocumentType,
  BillingStatus,
} from '../types/electronic-billing.types';

// ============================================================
// LocalStorage Keys
// ============================================================

const CONFIGS_KEY = 'odin-ebilling-configs';
const SEQUENCES_KEY = 'odin-ebilling-sequences';
const LOGS_KEY = 'odin-ebilling-logs';

// ============================================================
// Provider Adapter - Digifact (Mock Implementation)
// ============================================================

class DigifactAdapter {
  private config: ElectronicBillingConfig;

  constructor(config: ElectronicBillingConfig) {
    this.config = config;
  }

  /**
   * Test connection to Digifact API
   */
  async testConnection(): Promise<TestConnectionResponse> {
    try {
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validate credentials
      if (!this.config.username || !this.config.passwordEncrypted) {
        return {
          success: false,
          message: 'Credenciales incompletas',
          error: 'Username o password no proporcionados',
        };
      }

      // Validate RNC
      if (!this.config.rnc) {
        return {
          success: false,
          message: 'RNC no configurado',
          error: 'El RNC es requerido para conectar con Digifact',
        };
      }

      // Mock success
      return {
        success: true,
        message: `Conexión exitosa con Digifact (${this.config.environment})`,
        provider: 'Digifact',
        environment: this.config.environment,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Error al conectar con Digifact',
        error: error.message,
      };
    }
  }

  /**
   * Issue invoice (emit e-CF)
   */
  async issueInvoice(
    invoiceData: InvoiceData,
    sequence: ElectronicBillingSequence
  ): Promise<IssueInvoiceResponse> {
    try {
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Validations
      if (!invoiceData.customer.name) {
        return {
          success: false,
          error: 'Nombre del cliente es requerido',
        };
      }

      if (invoiceData.items.length === 0) {
        return {
          success: false,
          error: 'Debe incluir al menos un item',
        };
      }

      // Generate NCF/e-CF number
      const documentNumber = this.generateNCF(sequence);

      // Mock QR code (URL)
      const qrCode = `https://dgii.gov.do/ecf/verify/${documentNumber}`;

      // Mock PDF URL
      const pdfUrl = `https://api.digifact.do/pdf/${documentNumber}`;

      // Mock success response
      return {
        success: true,
        documentNumber,
        documentType: sequence.documentType,
        qrCode,
        pdfUrl,
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'Error al emitir comprobante',
        errorDetails: error.message,
      };
    }
  }

  /**
   * Cancel/void invoice
   */
  async cancelInvoice(documentNumber: string): Promise<IssueInvoiceResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      return {
        success: true,
        documentNumber,
        documentType: 'NOTA_CREDITO',
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'Error al anular comprobante',
        errorDetails: error.message,
      };
    }
  }

  /**
   * Generate NCF number
   */
  private generateNCF(sequence: ElectronicBillingSequence): string {
    const prefix = sequence.prefix || 'B02';
    const paddedNumber = String(sequence.currentNumber).padStart(8, '0');
    return `${prefix}${paddedNumber}`;
  }
}

// ============================================================
// Electronic Billing Service
// ============================================================

export class ElectronicBillingService {
  /**
   * Get all configs
   */
  static getConfigs(): ElectronicBillingConfig[] {
    const data = localStorage.getItem(CONFIGS_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Get config by ID
   */
  static getConfigById(id: string): ElectronicBillingConfig | null {
    const configs = this.getConfigs();
    return configs.find(c => c.id === id) || null;
  }

  /**
   * Get config by cash register ID
   */
  static getConfigByCashRegisterId(cashRegisterId: string): ElectronicBillingConfig | null {
    const configs = this.getConfigs();
    return configs.find(c => c.cashRegisterId === cashRegisterId && c.isActive) || null;
  }

  /**
   * Save config
   */
  static saveConfig(config: ElectronicBillingConfig): void {
    const configs = this.getConfigs();
    const index = configs.findIndex(c => c.id === config.id);
    
    if (index >= 0) {
      configs[index] = config;
    } else {
      configs.push(config);
    }
    
    localStorage.setItem(CONFIGS_KEY, JSON.stringify(configs));
  }

  /**
   * Delete config
   */
  static deleteConfig(id: string): void {
    const configs = this.getConfigs();
    const filtered = configs.filter(c => c.id !== id);
    localStorage.setItem(CONFIGS_KEY, JSON.stringify(filtered));
  }

  /**
   * Get sequences by config ID
   */
  static getSequences(configId: string): ElectronicBillingSequence[] {
    const data = localStorage.getItem(SEQUENCES_KEY);
    const allSequences: ElectronicBillingSequence[] = data ? JSON.parse(data) : [];
    return allSequences.filter(s => s.configId === configId);
  }

  /**
   * Get sequence by document type
   */
  static getSequenceByType(
    configId: string,
    documentType: DocumentType
  ): ElectronicBillingSequence | null {
    const sequences = this.getSequences(configId);
    return sequences.find(s => s.documentType === documentType && s.active) || null;
  }

  /**
   * Save sequence
   */
  static saveSequence(sequence: ElectronicBillingSequence): void {
    const data = localStorage.getItem(SEQUENCES_KEY);
    const sequences: ElectronicBillingSequence[] = data ? JSON.parse(data) : [];
    
    const index = sequences.findIndex(s => s.id === sequence.id);
    
    if (index >= 0) {
      sequences[index] = sequence;
    } else {
      sequences.push(sequence);
    }
    
    localStorage.setItem(SEQUENCES_KEY, JSON.stringify(sequences));
  }

  /**
   * Increment sequence (thread-safe)
   */
  static incrementSequence(sequenceId: string): number {
    const data = localStorage.getItem(SEQUENCES_KEY);
    const sequences: ElectronicBillingSequence[] = data ? JSON.parse(data) : [];
    
    const index = sequences.findIndex(s => s.id === sequenceId);
    
    if (index === -1) {
      throw new Error('Secuencia no encontrada');
    }
    
    const sequence = sequences[index];
    
    if (sequence.currentNumber >= sequence.endNumber) {
      throw new Error('Secuencia agotada - contacte administrador');
    }
    
    sequence.currentNumber++;
    sequence.updatedAt = new Date().toISOString();
    
    sequences[index] = sequence;
    localStorage.setItem(SEQUENCES_KEY, JSON.stringify(sequences));
    
    return sequence.currentNumber;
  }

  /**
   * Save log
   */
  static saveLog(log: ElectronicBillingLog): void {
    const data = localStorage.getItem(LOGS_KEY);
    const logs: ElectronicBillingLog[] = data ? JSON.parse(data) : [];
    logs.unshift(log); // Add at beginning
    
    // Keep only last 1000 logs
    const trimmed = logs.slice(0, 1000);
    
    localStorage.setItem(LOGS_KEY, JSON.stringify(trimmed));
  }

  /**
   * Get logs
   */
  static getLogs(configId?: string): ElectronicBillingLog[] {
    const data = localStorage.getItem(LOGS_KEY);
    const logs: ElectronicBillingLog[] = data ? JSON.parse(data) : [];
    
    if (configId) {
      return logs.filter(l => l.configId === configId);
    }
    
    return logs;
  }

  /**
   * Test connection
   */
  static async testConnection(config: ElectronicBillingConfig): Promise<TestConnectionResponse> {
    const adapter = new DigifactAdapter(config);
    return adapter.testConnection();
  }

  /**
   * Issue invoice
   */
  static async issueInvoice(
    config: ElectronicBillingConfig,
    invoiceData: InvoiceData,
    orderId?: string
  ): Promise<IssueInvoiceResponse> {
    try {
      // Determine document type
      const documentType = this.determineDocumentType(invoiceData);
      
      // Get sequence
      const sequence = this.getSequenceByType(config.id, documentType);
      
      if (!sequence) {
        return {
          success: false,
          error: `No hay secuencia activa para tipo ${documentType}`,
        };
      }

      // Increment sequence
      this.incrementSequence(sequence.id);

      // Create adapter
      const adapter = new DigifactAdapter(config);

      // Issue invoice
      const response = await adapter.issueInvoice(invoiceData, sequence);

      // Save log
      const log: ElectronicBillingLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        configId: config.id,
        orderId,
        cashRegisterId: config.cashRegisterId,
        documentType,
        documentNumber: response.documentNumber || '',
        requestPayload: invoiceData,
        responsePayload: response,
        status: response.success ? 'ISSUED' : 'FAILED',
        errorMessage: response.error,
        createdAt: new Date().toISOString(),
      };

      this.saveLog(log);

      return response;
    } catch (error: any) {
      // Save error log
      const errorLog: ElectronicBillingLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        configId: config.id,
        orderId,
        cashRegisterId: config.cashRegisterId,
        documentType: 'CONSUMO',
        documentNumber: '',
        requestPayload: invoiceData,
        responsePayload: null,
        status: 'FAILED',
        errorMessage: error.message,
        createdAt: new Date().toISOString(),
      };

      this.saveLog(errorLog);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Determine document type based on customer info
   */
  private static determineDocumentType(invoiceData: InvoiceData): DocumentType {
    // Override if specified
    if (invoiceData.documentType) {
      return invoiceData.documentType;
    }

    const { customer } = invoiceData;

    // Consumidor final
    if (!customer.rnc || customer.identificationType === 'CONSUMIDOR_FINAL') {
      return 'CONSUMO';
    }

    // Cliente con RNC
    if (customer.rnc) {
      // Check if government (RNC starts with 4)
      if (customer.rnc.startsWith('4')) {
        return 'GUBERNAMENTAL';
      }
      
      return 'CREDITO_FISCAL';
    }

    // Default
    return 'CONSUMO';
  }

  /**
   * Initialize default sequences for a config
   */
  static initializeDefaultSequences(configId: string): void {
    const defaultSequences: Omit<ElectronicBillingSequence, 'id'>[] = [
      {
        configId,
        documentType: 'CONSUMO',
        prefix: 'B02',
        currentNumber: 1,
        startNumber: 1,
        endNumber: 100000,
        active: true,
        updatedAt: new Date().toISOString(),
      },
      {
        configId,
        documentType: 'CREDITO_FISCAL',
        prefix: 'B01',
        currentNumber: 1,
        startNumber: 1,
        endNumber: 100000,
        active: true,
        updatedAt: new Date().toISOString(),
      },
      {
        configId,
        documentType: 'GUBERNAMENTAL',
        prefix: 'B15',
        currentNumber: 1,
        startNumber: 1,
        endNumber: 100000,
        active: true,
        updatedAt: new Date().toISOString(),
      },
      {
        configId,
        documentType: 'NOTA_CREDITO',
        prefix: 'B04',
        currentNumber: 1,
        startNumber: 1,
        endNumber: 100000,
        active: true,
        updatedAt: new Date().toISOString(),
      },
    ];

    defaultSequences.forEach(seq => {
      const sequence: ElectronicBillingSequence = {
        ...seq,
        id: `seq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      this.saveSequence(sequence);
    });
  }
}
