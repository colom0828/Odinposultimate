/**
 * ═══════════════════════════════════════════════════════════════
 * MOCK DATA - Datos de ejemplo para testing
 * ═══════════════════════════════════════════════════════════════
 */

import { PrintData } from '../types/print-templates.types';

export function getMockPrintData(): PrintData {
  return {
    business: {
      name: 'ODIN POS Restaurant',
      address: 'Av. Winston Churchill 123, Piantini, Santo Domingo',
      phone: '+1 809-555-1234',
      email: 'contacto@odinpos.com',
      taxId: 'RNC: 130-12345-6',
      logo: '',
    },
    customer: {
      name: 'Juan Pérez García',
      taxId: 'RNC: 402-1234567-8',
      address: 'Calle El Conde 456, Zona Colonial, Santo Domingo',
      phone: '+1 809-876-5432',
      email: 'juan.perez@example.com',
    },
    transaction: {
      id: 'txn-001',
      number: 'F-2025-0001',
      date: '25/02/2026',
      time: '14:35:00',
      type: 'sale',
    },
    items: [
      {
        id: '1',
        name: 'Hamburguesa Clásica',
        quantity: 2,
        unitPrice: 89.00,
        subtotal: 178.00,
        tax: 32.04, // 18% ITBIS
        discount: 0,
        notes: 'Sin cebolla',
      },
      {
        id: '2',
        name: 'Papas Fritas Grandes',
        quantity: 2,
        unitPrice: 45.00,
        subtotal: 90.00,
        tax: 16.20, // 18% ITBIS
        discount: 0,
      },
      {
        id: '3',
        name: 'Refresco Cola 600ml',
        quantity: 2,
        unitPrice: 25.00,
        subtotal: 50.00,
        tax: 9.00, // 18% ITBIS
        discount: 0,
      },
      {
        id: '4',
        name: 'Ensalada César',
        quantity: 1,
        unitPrice: 75.00,
        subtotal: 75.00,
        tax: 13.50, // 18% ITBIS
        discount: 7.50,
      },
    ],
    totals: {
      subtotal: 393.00,
      tax: 70.74, // ITBIS 18% para República Dominicana
      discount: 7.50,
      tip: 39.30, // Propina sugerida 10%
      shipping: 0,
      total: 495.54,
    },
    payment: {
      method: 'Efectivo',
      amountPaid: 500.00,
      change: 4.46,
      reference: '',
    },
    customText: {
      header: '',
      footer: '¡Gracias por su preferencia!\nSíguenos en @odinpos\nwww.odinpos.com',
    },
  };
}

export function getMockRestaurantData(): PrintData {
  return {
    business: {
      name: 'La Trattoria Italiana',
      address: 'Calle Gustavo Mejía Ricart 88, Naco, Santo Domingo',
      phone: '+1 809-555-5678',
      taxId: 'RNC: 130-89012-3',
    },
    transaction: {
      id: 'txn-rest-001',
      number: 'Mesa-15-001',
      date: '25/02/2026',
      time: '20:15:00',
      type: 'sale',
    },
    items: [
      {
        id: '1',
        name: 'Pizza Margarita',
        quantity: 1,
        unitPrice: 185.00,
        subtotal: 185.00,
      },
      {
        id: '2',
        name: 'Pasta Carbonara',
        quantity: 1,
        unitPrice: 165.00,
        subtotal: 165.00,
      },
      {
        id: '3',
        name: 'Vino Tinto Copa',
        quantity: 2,
        unitPrice: 75.00,
        subtotal: 150.00,
      },
      {
        id: '4',
        name: 'Tiramisú',
        quantity: 2,
        unitPrice: 65.00,
        subtotal: 130.00,
      },
    ],
    totals: {
      subtotal: 630.00,
      tax: 113.40, // ITBIS 18% para República Dominicana
      discount: 0,
      tip: 63.00, // Propina sugerida 10%
      total: 806.40,
    },
    payment: {
      method: 'Tarjeta de Crédito',
      amountPaid: 806.40,
      change: 0,
      reference: '****1234',
    },
    customText: {
      footer: 'Grazie mille!\nPropina sugerida: 15% = $109.62',
    },
  };
}

export function getMockKitchenOrderData(): PrintData {
  return {
    business: {
      name: 'COCINA',
    },
    transaction: {
      id: 'kitchen-001',
      number: 'MESA-8',
      date: '25/02/2026',
      time: '21:30:00',
      type: 'sale',
    },
    items: [
      {
        id: '1',
        name: 'Tacos al Pastor',
        quantity: 3,
        unitPrice: 15.00,
        subtotal: 45.00,
        notes: '🌶️ PICANTE - Sin cilantro',
      },
      {
        id: '2',
        name: 'Quesadilla de Champiñones',
        quantity: 2,
        unitPrice: 45.00,
        subtotal: 90.00,
        notes: 'Extra queso',
      },
      {
        id: '3',
        name: 'Guacamole con Totopos',
        quantity: 1,
        unitPrice: 65.00,
        subtotal: 65.00,
      },
    ],
    totals: {
      subtotal: 200.00,
      tax: 0,
      discount: 0,
      total: 200.00,
    },
    customText: {
      header: '⚡ ORDEN URGENTE',
      footer: 'Mesero: Carlos | Cliente: Mesa 8',
    },
  };
}

export function getMockSpaData(): PrintData {
  return {
    business: {
      name: 'Zen Spa & Wellness',
      address: 'Av. Abraham Lincoln 250, Piantini, Santo Domingo',
      phone: '+1 809-999-8888',
      taxId: 'RNC: 130-78090-1',
    },
    customer: {
      name: 'María González',
      phone: '+1 809-111-2222',
    },
    transaction: {
      id: 'spa-001',
      number: 'SPA-2026-0045',
      date: '25/02/2026',
      time: '16:00:00',
      type: 'sale',
    },
    items: [
      {
        id: '1',
        name: 'Masaje Sueco 60 min',
        quantity: 1,
        unitPrice: 850.00,
        subtotal: 850.00,
      },
      {
        id: '2',
        name: 'Facial Hidratante',
        quantity: 1,
        unitPrice: 650.00,
        subtotal: 650.00,
      },
      {
        id: '3',
        name: 'Manicure & Pedicure',
        quantity: 1,
        unitPrice: 450.00,
        subtotal: 450.00,
      },
    ],
    totals: {
      subtotal: 1950.00,
      tax: 351.00, // ITBIS 18% para República Dominicana
      discount: 195.00, // 10% descuento
      tip: 195.00, // Propina sugerida 10%
      total: 2301.00,
    },
    payment: {
      method: 'Tarjeta de Débito',
      amountPaid: 2301.00,
      change: 0,
      reference: '****5678',
    },
    customText: {
      footer: 'Próxima cita: 15/03/2026 a las 15:00\n¡Namaste! 🧘‍♀️',
    },
  };
}

export function getMockHardwareStoreData(): PrintData {
  return {
    business: {
      name: 'Ferretería El Martillo',
      address: 'Av. Lope de Vega 789, Ensanche Naco, Santo Domingo',
      phone: '+1 809-777-6666',
      taxId: 'RNC: 130-95031-5',
    },
    customer: {
      name: 'Constructora ABC SRL',
      taxId: 'RNC: 130-12051-5',
    },
    transaction: {
      id: 'hw-001',
      number: 'FAC-2026-0234',
      date: '25/02/2026',
      time: '10:45:00',
      type: 'sale',
    },
    items: [
      {
        id: '1',
        name: 'Taladro Inalámbrico 20V',
        quantity: 2,
        unitPrice: 1250.00,
        subtotal: 2500.00,
      },
      {
        id: '2',
        name: 'Juego de Brocas 50 pzas',
        quantity: 3,
        unitPrice: 280.00,
        subtotal: 840.00,
      },
      {
        id: '3',
        name: 'Extensión Eléctrica 10m',
        quantity: 5,
        unitPrice: 185.00,
        subtotal: 925.00,
      },
      {
        id: '4',
        name: 'Cinta Métrica 5m',
        quantity: 10,
        unitPrice: 45.00,
        subtotal: 450.00,
      },
      {
        id: '5',
        name: 'Nivel de Burbuja 60cm',
        quantity: 4,
        unitPrice: 125.00,
        subtotal: 500.00,
      },
    ],
    totals: {
      subtotal: 5215.00,
      tax: 938.70, // ITBIS 18% para República Dominicana
      discount: 261.00, // 5% descuento por volumen
      tip: 521.50, // Propina sugerida 10%
      total: 6414.20,
    },
    payment: {
      method: 'Transferencia Bancaria',
      amountPaid: 6414.20,
      change: 0,
      reference: 'SPEI-20260225-1045',
    },
    customText: {
      footer: 'Garantía de 12 meses en herramientas eléctricas\nPolítica de devolución: 30 días',
    },
  };
}