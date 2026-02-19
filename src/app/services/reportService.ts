/**
 * ODIN POS - Servicio de Reportes
 * Datos MOCK - Preparado para API futura
 */

import { 
  ReportData, 
  ReportFilters, 
  ReportType,
  ExportRequest,
  ExportFormat 
} from '../types/reports.types';

// ============================================
// MOCK DATA - RESTAURANTE
// ============================================

function getMockRestaurantOrdersByStatus(filters: ReportFilters): ReportData {
  return {
    reportId: 'rest_orders_status',
    type: 'ORDERS_BY_STATUS',
    generatedAt: new Date().toISOString(),
    filters,
    kpis: [
      { id: 'total', label: 'Total Órdenes', value: 487, change: 12, trend: 'up', icon: 'ShoppingCart', color: 'blue' },
      { id: 'nuevas', label: 'Nuevas', value: 23, icon: 'Plus', color: 'green' },
      { id: 'preparando', label: 'En Preparación', value: 45, icon: 'ChefHat', color: 'orange' },
      { id: 'listas', label: 'Listas', value: 12, icon: 'CheckCircle', color: 'cyan' },
      { id: 'entregadas', label: 'Entregadas', value: 407, change: 8, trend: 'up', icon: 'PackageCheck', color: 'emerald' },
    ],
    tableData: {
      headers: [
        { key: 'hour', label: 'Hora', align: 'left' },
        { key: 'nuevas', label: 'Nuevas', align: 'center' },
        { key: 'preparando', label: 'Preparando', align: 'center' },
        { key: 'listas', label: 'Listas', align: 'center' },
        { key: 'entregadas', label: 'Entregadas', align: 'center' },
        { key: 'total', label: 'Total', align: 'right' },
      ],
      rows: [
        { id: '1', cells: { hour: '08:00-10:00', nuevas: 4, preparando: 8, listas: 2, entregadas: 45, total: 59 } },
        { id: '2', cells: { hour: '10:00-12:00', nuevas: 6, preparando: 12, listas: 3, entregadas: 78, total: 99 } },
        { id: '3', cells: { hour: '12:00-14:00', nuevas: 8, preparando: 15, listas: 4, entregadas: 134, total: 161 } },
        { id: '4', cells: { hour: '14:00-16:00', nuevas: 3, preparando: 6, listas: 2, entregadas: 87, total: 98 } },
        { id: '5', cells: { hour: '16:00-18:00', nuevas: 2, preparando: 4, listas: 1, entregadas: 63, total: 70 } },
      ],
      totalRows: 5,
    },
    chartData: {
      type: 'bar',
      labels: ['Nuevas', 'En Preparación', 'Listas', 'Entregadas'],
      datasets: [{
        label: 'Órdenes',
        data: [23, 45, 12, 407],
        backgroundColor: ['#3b82f6', '#f59e0b', '#06b6d4', '#10b981'],
      }],
    },
  };
}

function getMockRestaurantAverageTimes(filters: ReportFilters): ReportData {
  return {
    reportId: 'rest_avg_times',
    type: 'AVERAGE_TIMES',
    generatedAt: new Date().toISOString(),
    filters,
    kpis: [
      { id: 'prep', label: 'Tiempo Preparación', value: '18 min', change: -5, trend: 'down', icon: 'ChefHat', color: 'orange' },
      { id: 'delivery', label: 'Tiempo Entrega', value: '8 min', change: -2, trend: 'down', icon: 'Bike', color: 'blue' },
      { id: 'rotation', label: 'Rotación Mesa', value: '45 min', change: 3, trend: 'up', icon: 'Users', color: 'purple' },
      { id: 'total', label: 'Tiempo Total', value: '26 min', change: -7, trend: 'down', icon: 'Clock', color: 'green' },
    ],
    tableData: {
      headers: [
        { key: 'categoria', label: 'Categoría', align: 'left' },
        { key: 'ordenes', label: 'Órdenes', align: 'center' },
        { key: 'min', label: 'Mín (min)', align: 'right' },
        { key: 'max', label: 'Máx (min)', align: 'right' },
        { key: 'promedio', label: 'Promedio (min)', align: 'right' },
      ],
      rows: [
        { id: '1', cells: { categoria: 'Entradas', ordenes: 156, min: 8, max: 25, promedio: 12 } },
        { id: '2', cells: { categoria: 'Platos Fuertes', ordenes: 287, min: 15, max: 35, promedio: 22 } },
        { id: '3', cells: { categoria: 'Bebidas', ordenes: 423, min: 2, max: 8, promedio: 4 } },
        { id: '4', cells: { categoria: 'Postres', ordenes: 98, min: 10, max: 20, promedio: 14 } },
      ],
      totalRows: 4,
    },
    chartData: {
      type: 'line',
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Tiempo Prep (min)',
          data: [22, 20, 19, 18, 17, 16, 18],
          borderColor: '#f59e0b',
          backgroundColor: 'transparent',
          fill: false,
        },
        {
          label: 'Tiempo Entrega (min)',
          data: [10, 9, 9, 8, 8, 7, 8],
          borderColor: '#3b82f6',
          backgroundColor: 'transparent',
          fill: false,
        },
      ],
    },
  };
}

function getMockRestaurantTopProducts(filters: ReportFilters): ReportData {
  return {
    reportId: 'rest_top_products',
    type: 'TOP_PRODUCTS',
    generatedAt: new Date().toISOString(),
    filters,
    kpis: [
      { id: 'total_productos', label: 'Productos Únicos', value: 87, icon: 'Package', color: 'blue' },
      { id: 'total_vendidos', label: 'Total Vendidos', value: '2,845', change: 15, trend: 'up', icon: 'TrendingUp', color: 'green' },
      { id: 'categoria_top', label: 'Categoría Top', value: 'Bebidas', icon: 'Award', color: 'yellow' },
    ],
    tableData: {
      headers: [
        { key: 'rank', label: '#', align: 'center' },
        { key: 'producto', label: 'Producto', align: 'left' },
        { key: 'categoria', label: 'Categoría', align: 'left' },
        { key: 'cantidad', label: 'Cantidad', align: 'right' },
      ],
      rows: [
        { id: '1', cells: { rank: 1, producto: 'Coca Cola 500ml', categoria: 'Bebidas', cantidad: 234 } },
        { id: '2', cells: { rank: 2, producto: 'Hamburguesa Clásica', categoria: 'Platos Fuertes', cantidad: 198 } },
        { id: '3', cells: { rank: 3, producto: 'Papas Fritas', categoria: 'Entradas', cantidad: 187 } },
        { id: '4', cells: { rank: 4, producto: 'Agua Mineral', categoria: 'Bebidas', cantidad: 156 } },
        { id: '5', cells: { rank: 5, producto: 'Pizza Pepperoni', categoria: 'Platos Fuertes', cantidad: 145 } },
        { id: '6', cells: { rank: 6, producto: 'Ensalada César', categoria: 'Entradas', cantidad: 123 } },
        { id: '7', cells: { rank: 7, producto: 'Cerveza Artesanal', categoria: 'Bebidas', cantidad: 119 } },
        { id: '8', cells: { rank: 8, producto: 'Tiramisú', categoria: 'Postres', cantidad: 98 } },
        { id: '9', cells: { rank: 9, producto: 'Alitas BBQ', categoria: 'Entradas', cantidad: 92 } },
        { id: '10', cells: { rank: 10, producto: 'Jugo Natural', categoria: 'Bebidas', cantidad: 87 } },
      ],
      totalRows: 10,
    },
    chartData: {
      type: 'bar',
      labels: ['Coca Cola', 'Hamburguesa', 'Papas', 'Agua', 'Pizza', 'Ensalada', 'Cerveza', 'Tiramisú'],
      datasets: [{
        label: 'Cantidad Vendida',
        data: [234, 198, 187, 156, 145, 123, 119, 98],
        backgroundColor: '#10b981',
      }],
    },
  };
}

function getMockRestaurantDailyRevenue(filters: ReportFilters): ReportData {
  return {
    reportId: 'rest_daily_revenue',
    type: 'DAILY_REVENUE',
    generatedAt: new Date().toISOString(),
    filters,
    kpis: [
      { id: 'total', label: 'Ingresos Totales', value: '$45,678', change: 12, trend: 'up', icon: 'DollarSign', color: 'green', isMoney: true },
      { id: 'promedio', label: 'Promedio Diario', value: '$6,525', icon: 'TrendingUp', color: 'blue', isMoney: true },
      { id: 'mejor_dia', label: 'Mejor Día', value: 'Sábado', icon: 'Award', color: 'yellow' },
      { id: 'ordenes', label: 'Órdenes Totales', value: 487, change: 8, trend: 'up', icon: 'ShoppingCart', color: 'purple' },
    ],
    tableData: {
      headers: [
        { key: 'dia', label: 'Día', align: 'left' },
        { key: 'ordenes', label: 'Órdenes', align: 'center' },
        { key: 'ingresos', label: 'Ingresos', align: 'right', isMoney: true },
        { key: 'ticket_promedio', label: 'Ticket Prom.', align: 'right', isMoney: true },
      ],
      rows: [
        { id: '1', cells: { dia: 'Lunes', ordenes: 45, ingresos: '$4,235', ticket_promedio: '$94' } },
        { id: '2', cells: { dia: 'Martes', ordenes: 52, ingresos: '$5,123', ticket_promedio: '$98' } },
        { id: '3', cells: { dia: 'Miércoles', ordenes: 67, ingresos: '$6,789', ticket_promedio: '$101' } },
        { id: '4', cells: { dia: 'Jueves', ordenes: 71, ingresos: '$7,234', ticket_promedio: '$102' } },
        { id: '5', cells: { dia: 'Viernes', ordenes: 89, ingresos: '$9,456', ticket_promedio: '$106' } },
        { id: '6', cells: { dia: 'Sábado', ordenes: 98, ingresos: '$10,987', ticket_promedio: '$112' } },
        { id: '7', cells: { dia: 'Domingo', ordenes: 65, ingresos: '$6,854', ticket_promedio: '$105' } },
      ],
      totalRows: 7,
    },
    chartData: {
      type: 'line',
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [{
        label: 'Ingresos ($)',
        data: [4235, 5123, 6789, 7234, 9456, 10987, 6854],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      }],
    },
  };
}

// ============================================
// NUEVOS REPORTES FUNCIONALES CON GRÁFICAS
// ============================================

function getMockRestaurantTableOccupation(filters: ReportFilters): ReportData {
  return {
    reportId: 'rest_table_occupation',
    type: 'TABLE_OCCUPATION',
    generatedAt: new Date().toISOString(),
    filters,
    kpis: [
      { id: 'ocupacion_promedio', label: 'Ocupación Promedio', value: '68%', change: 5, trend: 'up', icon: 'TrendingUp', color: 'green' },
      { id: 'rotacion_promedio', label: 'Rotación Promedio', value: '3.2x', change: 8, trend: 'up', icon: 'Repeat', color: 'blue' },
      { id: 'mesas_activas', label: 'Mesas Activas', value: 18, icon: 'Utensils', color: 'purple' },
      { id: 'tiempo_promedio', label: 'Tiempo Promedio', value: '45 min', change: -3, trend: 'down', icon: 'Clock', color: 'orange' },
    ],
    tableData: {
      headers: [
        { key: 'mesa', label: 'Mesa', align: 'left' },
        { key: 'capacidad', label: 'Capacidad', align: 'center' },
        { key: 'usos_hoy', label: 'Usos Hoy', align: 'center' },
        { key: 'ocupacion', label: 'Ocupación', align: 'center' },
        { key: 'tiempo_prom', label: 'Tiempo Prom.', align: 'right' },
      ],
      rows: [
        { id: '1', cells: { mesa: 'Mesa 1', capacidad: '4 personas', usos_hoy: 8, ocupacion: '89%', tiempo_prom: '42 min' } },
        { id: '2', cells: { mesa: 'Mesa 2', capacidad: '2 personas', usos_hoy: 12, ocupacion: '95%', tiempo_prom: '38 min' } },
        { id: '3', cells: { mesa: 'Mesa 3', capacidad: '6 personas', usos_hoy: 5, ocupacion: '72%', tiempo_prom: '68 min' } },
        { id: '4', cells: { mesa: 'Mesa 4', capacidad: '4 personas', usos_hoy: 7, ocupacion: '82%', tiempo_prom: '45 min' } },
        { id: '5', cells: { mesa: 'Mesa 5', capacidad: '2 personas', usos_hoy: 10, ocupacion: '91%', tiempo_prom: '35 min' } },
        { id: '6', cells: { mesa: 'Mesa 6', capacidad: '8 personas', usos_hoy: 3, ocupacion: '58%', tiempo_prom: '85 min' } },
        { id: '7', cells: { mesa: 'Mesa 7', capacidad: '4 personas', usos_hoy: 6, ocupacion: '75%', tiempo_prom: '48 min' } },
        { id: '8', cells: { mesa: 'Mesa 8', capacidad: '2 personas', usos_hoy: 9, ocupacion: '88%', tiempo_prom: '40 min' } },
      ],
      totalRows: 8,
    },
    chartData: {
      type: 'bar',
      labels: ['Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5', 'Mesa 6', 'Mesa 7', 'Mesa 8'],
      datasets: [
        {
          label: 'Usos Hoy',
          data: [8, 12, 5, 7, 10, 3, 6, 9],
          backgroundColor: '#3b82f6',
        },
        {
          label: 'Ocupación (%)',
          data: [89, 95, 72, 82, 91, 58, 75, 88],
          backgroundColor: '#10b981',
        },
      ],
    },
  };
}

function getMockRestaurantKitchenEfficiency(filters: ReportFilters): ReportData {
  return {
    reportId: 'rest_kitchen_efficiency',
    type: 'KITCHEN_EFFICIENCY',
    generatedAt: new Date().toISOString(),
    filters,
    kpis: [
      { id: 'ordenes_completadas', label: 'Órdenes Completadas', value: 245, change: 12, trend: 'up', icon: 'CheckCircle', color: 'green' },
      { id: 'tiempo_promedio', label: 'Tiempo Promedio', value: '18 min', change: -8, trend: 'down', icon: 'Clock', color: 'blue' },
      { id: 'ordenes_retrasadas', label: 'Órdenes Retrasadas', value: 8, change: -25, trend: 'down', icon: 'AlertCircle', color: 'red' },
      { id: 'eficiencia', label: 'Eficiencia', value: '94%', change: 6, trend: 'up', icon: 'TrendingUp', color: 'emerald' },
    ],
    tableData: {
      headers: [
        { key: 'turno', label: 'Turno', align: 'left' },
        { key: 'ordenes', label: 'Órdenes', align: 'center' },
        { key: 'completadas', label: 'Completadas', align: 'center' },
        { key: 'retrasadas', label: 'Retrasadas', align: 'center' },
        { key: 'tiempo_prom', label: 'Tiempo Prom.', align: 'right' },
        { key: 'eficiencia', label: 'Eficiencia', align: 'right' },
      ],
      rows: [
        { id: '1', cells: { turno: 'Mañana (08:00-14:00)', ordenes: 89, completadas: 85, retrasadas: 4, tiempo_prom: '16 min', eficiencia: '96%' } },
        { id: '2', cells: { turno: 'Tarde (14:00-20:00)', ordenes: 134, completadas: 128, retrasadas: 6, tiempo_prom: '19 min', eficiencia: '95%' } },
        { id: '3', cells: { turno: 'Noche (20:00-23:00)', ordenes: 67, completadas: 62, retrasadas: 5, tiempo_prom: '21 min', eficiencia: '93%' } },
      ],
      totalRows: 3,
    },
    chartData: {
      type: 'line',
      labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
      datasets: [
        {
          label: 'Órdenes por Hora',
          data: [12, 18, 28, 35, 42, 38, 28, 15],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
        },
        {
          label: 'Tiempo Promedio (min)',
          data: [15, 16, 19, 22, 18, 17, 20, 19],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
        },
      ],
    },
  };
}

function getMockRestaurantDeliveryPerformance(filters: ReportFilters): ReportData {
  return {
    reportId: 'rest_delivery_performance',
    type: 'DELIVERY_PERFORMANCE',
    generatedAt: new Date().toISOString(),
    filters,
    kpis: [
      { id: 'entregas_totales', label: 'Entregas Totales', value: 156, change: 18, trend: 'up', icon: 'PackageCheck', color: 'green' },
      { id: 'en_ruta', label: 'En Ruta', value: 12, icon: 'Bike', color: 'blue' },
      { id: 'tiempo_promedio', label: 'Tiempo Promedio', value: '28 min', change: -5, trend: 'down', icon: 'Clock', color: 'orange' },
      { id: 'entregas_retrasadas', label: 'Retrasadas', value: 6, change: -33, trend: 'down', icon: 'AlertTriangle', color: 'red' },
    ],
    tableData: {
      headers: [
        { key: 'repartidor', label: 'Repartidor', align: 'left' },
        { key: 'entregas', label: 'Entregas', align: 'center' },
        { key: 'en_ruta', label: 'En Ruta', align: 'center' },
        { key: 'completadas', label: 'Completadas', align: 'center' },
        { key: 'retrasadas', label: 'Retrasadas', align: 'center' },
        { key: 'tiempo_prom', label: 'Tiempo Prom.', align: 'right' },
        { key: 'calificacion', label: 'Calificación', align: 'right' },
      ],
      rows: [
        { id: '1', cells: { repartidor: 'Carlos Méndez', entregas: 45, en_ruta: 3, completadas: 42, retrasadas: 2, tiempo_prom: '25 min', calificacion: '4.8 ⭐' } },
        { id: '2', cells: { repartidor: 'Ana Torres', entregas: 38, en_ruta: 2, completadas: 36, retrasadas: 1, tiempo_prom: '27 min', calificacion: '4.9 ⭐' } },
        { id: '3', cells: { repartidor: 'Luis Ramírez', entregas: 42, en_ruta: 4, completadas: 38, retrasadas: 2, tiempo_prom: '29 min', calificacion: '4.7 ⭐' } },
        { id: '4', cells: { repartidor: 'María Sánchez', entregas: 31, en_ruta: 3, completadas: 28, retrasadas: 1, tiempo_prom: '26 min', calificacion: '4.9 ⭐' } },
      ],
      totalRows: 4,
    },
    chartData: {
      type: 'bar',
      labels: ['Carlos M.', 'Ana T.', 'Luis R.', 'María S.'],
      datasets: [
        {
          label: 'Completadas',
          data: [42, 36, 38, 28],
          backgroundColor: '#10b981',
        },
        {
          label: 'Retrasadas',
          data: [2, 1, 2, 1],
          backgroundColor: '#ef4444',
        },
        {
          label: 'En Ruta',
          data: [3, 2, 4, 3],
          backgroundColor: '#3b82f6',
        },
      ],
    },
  };
}

// ============================================
// MOCK DATA - SPA
// ============================================

function getMockSpaAppointmentsByStatus(filters: ReportFilters): ReportData {
  return {
    reportId: 'spa_appointments_status',
    type: 'APPOINTMENTS_BY_STATUS',
    generatedAt: new Date().toISOString(),
    filters,
    kpis: [
      { id: 'total', label: 'Total Citas', value: 234, change: 18, trend: 'up', icon: 'Calendar', color: 'blue' },
      { id: 'confirmadas', label: 'Confirmadas', value: 45, icon: 'CheckCircle', color: 'green' },
      { id: 'en_proceso', label: 'En Proceso', value: 12, icon: 'Clock', color: 'orange' },
      { id: 'completadas', label: 'Completadas', value: 167, change: 15, trend: 'up', icon: 'CheckCheck', color: 'emerald' },
      { id: 'canceladas', label: 'Canceladas', value: 10, change: -2, trend: 'down', icon: 'XCircle', color: 'red' },
    ],
    tableData: {
      headers: [
        { key: 'servicio', label: 'Servicio', align: 'left' },
        { key: 'confirmadas', label: 'Confirmadas', align: 'center' },
        { key: 'completadas', label: 'Completadas', align: 'center' },
        { key: 'canceladas', label: 'Canceladas', align: 'center' },
        { key: 'tasa_completado', label: 'Tasa Éxito', align: 'right' },
      ],
      rows: [
        { id: '1', cells: { servicio: 'Masaje Relajante', confirmadas: 12, completadas: 45, canceladas: 2, tasa_completado: '95%' } },
        { id: '2', cells: { servicio: 'Facial Profundo', confirmadas: 8, completadas: 32, canceladas: 1, tasa_completado: '97%' } },
        { id: '3', cells: { servicio: 'Manicure/Pedicure', confirmadas: 15, completadas: 56, canceladas: 4, tasa_completado: '93%' } },
        { id: '4', cells: { servicio: 'Depilación', confirmadas: 6, completadas: 21, canceladas: 2, tasa_completado: '91%' } },
        { id: '5', cells: { servicio: 'Tratamiento Capilar', confirmadas: 4, completadas: 13, canceladas: 1, tasa_completado: '93%' } },
      ],
      totalRows: 5,
    },
    chartData: {
      type: 'pie',
      labels: ['Completadas', 'Confirmadas', 'En Proceso', 'Canceladas'],
      datasets: [{
        label: 'Citas',
        data: [167, 45, 12, 10],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
      }],
    },
  };
}

function getMockSpaTopServices(filters: ReportFilters): ReportData {
  return {
    reportId: 'spa_top_services',
    type: 'TOP_SERVICES',
    generatedAt: new Date().toISOString(),
    filters,
    kpis: [
      { id: 'servicios_unicos', label: 'Servicios Ofrecidos', value: 24, icon: 'Sparkles', color: 'pink' },
      { id: 'total_citas', label: 'Total Citas', value: 234, change: 18, trend: 'up', icon: 'Calendar', color: 'blue' },
      { id: 'servicio_top', label: 'Servicio Top', value: 'Manicure', icon: 'Award', color: 'yellow' },
    ],
    tableData: {
      headers: [
        { key: 'rank', label: '#', align: 'center' },
        { key: 'servicio', label: 'Servicio', align: 'left' },
        { key: 'duracion', label: 'Duración', align: 'center' },
        { key: 'citas', label: 'Citas', align: 'right' },
      ],
      rows: [
        { id: '1', cells: { rank: 1, servicio: 'Manicure Clásico', duracion: '45 min', citas: 56 } },
        { id: '2', cells: { rank: 2, servicio: 'Masaje Relajante', duracion: '60 min', citas: 45 } },
        { id: '3', cells: { rank: 3, servicio: 'Facial Hidratante', duracion: '50 min', citas: 32 } },
        { id: '4', cells: { rank: 4, servicio: 'Pedicure Spa', duracion: '60 min', citas: 28 } },
        { id: '5', cells: { rank: 5, servicio: 'Depilación Completa', duracion: '90 min', citas: 21 } },
        { id: '6', cells: { rank: 6, servicio: 'Tratamiento Capilar', duracion: '45 min', citas: 18 } },
        { id: '7', cells: { rank: 7, servicio: 'Masaje Deportivo', duracion: '75 min', citas: 15 } },
        { id: '8', cells: { rank: 8, servicio: 'Extensiones de Pestañas', duracion: '120 min', citas: 12 } },
      ],
      totalRows: 8,
    },
    chartData: {
      type: 'bar',
      labels: ['Manicure', 'Masaje', 'Facial', 'Pedicure', 'Depilación', 'Capilar'],
      datasets: [{
        label: 'Citas',
        data: [56, 45, 32, 28, 21, 18],
        backgroundColor: '#ec4899',
      }],
    },
  };
}

// ============================================
// SALES BY CATEGORY (RESTAURANT, RETAIL, HARDWARE)
// ============================================

function getMockSalesByCategory(filters: ReportFilters): ReportData {
  return {
    reportId: 'sales_by_category',
    type: 'SALES_BY_CATEGORY',
    generatedAt: new Date().toISOString(),
    filters,
    kpis: [
      { id: 'total_sales', label: 'Ventas Totales', value: '$123,456', change: 15, trend: 'up', icon: 'DollarSign', color: 'green', isMoney: true },
      { id: 'total_units', label: 'Unidades Vendidas', value: 1500, change: 10, trend: 'up', icon: 'Package', color: 'blue' },
      { id: 'best_category', label: 'Categoría Top', value: 'Electrónica', icon: 'Award', color: 'yellow' },
    ],
    tableData: {
      headers: [
        { key: 'category', label: 'Categoría', align: 'left' },
        { key: 'sales', label: 'Ventas', align: 'right', isMoney: true },
        { key: 'units', label: 'Unidades', align: 'right' },
        { key: 'percentage', label: 'Porcentaje', align: 'right' },
      ],
      rows: [
        { id: '1', cells: { category: 'Electrónica', sales: '$50,000', units: 500, percentage: '40%' } },
        { id: '2', cells: { category: 'Ropa', sales: '$30,000', units: 300, percentage: '24%' } },
        { id: '3', cells: { category: 'Hogar', sales: '$20,000', units: 200, percentage: '16%' } },
        { id: '4', cells: { category: 'Jardín', sales: '$10,000', units: 100, percentage: '8%' } },
        { id: '5', cells: { category: 'Deportes', sales: '$5,000', units: 50, percentage: '4%' } },
      ],
      totalRows: 5,
    },
    chartData: {
      type: 'bar',
      labels: ['Electrónica', 'Ropa', 'Hogar', 'Jardín', 'Deportes'],
      datasets: [{
        label: 'Ventas ($)',
        data: [50000, 30000, 20000, 10000, 5000],
        backgroundColor: ['#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'],
      }],
    },
  };
}

// ============================================
// SERVICIO PRINCIPAL
// ============================================

export class ReportService {
  /**
   * Obtiene datos de un reporte
   * TODO: Reemplazar con llamada a API
   */
  static async getReportData(reportType: ReportType, filters: ReportFilters): Promise<ReportData> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 800));

    // Routing según tipo de reporte
    switch (reportType) {
      // RESTAURANTE
      case 'ORDERS_BY_STATUS':
        return getMockRestaurantOrdersByStatus(filters);
      case 'AVERAGE_TIMES':
        return getMockRestaurantAverageTimes(filters);
      case 'TOP_PRODUCTS':
        return getMockRestaurantTopProducts(filters);
      case 'DAILY_REVENUE':
        return getMockRestaurantDailyRevenue(filters);
      case 'TABLE_OCCUPATION':
        return getMockRestaurantTableOccupation(filters);
      case 'KITCHEN_EFFICIENCY':
        return getMockRestaurantKitchenEfficiency(filters);
      case 'DELIVERY_PERFORMANCE':
        return getMockRestaurantDeliveryPerformance(filters);

      // SPA
      case 'APPOINTMENTS_BY_STATUS':
        return getMockSpaAppointmentsByStatus(filters);
      case 'TOP_SERVICES':
        return getMockSpaTopServices(filters);

      // SALES BY CATEGORY (RESTAURANT, RETAIL, HARDWARE)
      case 'SALES_BY_CATEGORY':
        return getMockSalesByCategory(filters);

      default:
        throw new Error(`Reporte no implementado: ${reportType}`);
    }
  }

  /**
   * Exporta un reporte (MOCK)
   * TODO: Implementar generación real de PDF/Excel
   */
  static async exportReport(request: ExportRequest): Promise<void> {
    // Simular delay de generación
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('📄 Exportando reporte:', {
      reportId: request.reportId,
      format: request.format,
      filters: request.filters,
    });

    // En producción, aquí se generaría el archivo y se descargaría
    alert(`✅ Reporte exportado en formato ${request.format}`);
  }
}