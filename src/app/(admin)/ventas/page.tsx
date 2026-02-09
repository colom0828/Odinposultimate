'use client';

import { useState } from 'react';
import { Plus, Search, Eye, Download, Filter, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const mockSales = [
  { 
    id: '001', 
    customer: 'María González', 
    date: '2025-02-09 14:30', 
    items: 3, 
    total: 450, 
    payment: 'Tarjeta', 
    status: 'completed',
    cashier: 'Admin'
  },
  { 
    id: '002', 
    customer: 'Carlos Ruiz', 
    date: '2025-02-09 14:18', 
    items: 2, 
    total: 280, 
    payment: 'Efectivo', 
    status: 'completed',
    cashier: 'Admin'
  },
  { 
    id: '003', 
    customer: 'Ana Martínez', 
    date: '2025-02-09 14:05', 
    items: 5, 
    total: 890, 
    payment: 'Transferencia', 
    status: 'pending',
    cashier: 'Usuario1'
  },
  { 
    id: '004', 
    customer: 'Luis Fernández', 
    date: '2025-02-09 13:45', 
    items: 1, 
    total: 320, 
    payment: 'Tarjeta', 
    status: 'completed',
    cashier: 'Admin'
  },
  { 
    id: '005', 
    customer: 'Sofia López', 
    date: '2025-02-09 12:30', 
    items: 4, 
    total: 625, 
    payment: 'Efectivo', 
    status: 'completed',
    cashier: 'Usuario2'
  },
  { 
    id: '006', 
    customer: 'Diego Ramírez', 
    date: '2025-02-09 11:15', 
    items: 2, 
    total: 180, 
    payment: 'Tarjeta', 
    status: 'refunded',
    cashier: 'Admin'
  },
];

export default function VentasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sales] = useState(mockSales);

  const filteredSales = sales.filter(sale =>
    sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSales = sales.reduce((sum, sale) => sum + (sale.status === 'completed' ? sale.total : 0), 0);
  const completedSales = sales.filter(s => s.status === 'completed').length;
  const pendingSales = sales.filter(s => s.status === 'pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'refunded':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'pending':
        return 'Pendiente';
      case 'refunded':
        return 'Reembolsada';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ventas</h1>
          <p className="text-slate-400">Gestión y registro de ventas</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/30">
          <Plus className="w-5 h-5 mr-2" />
          Nueva Venta
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Total Hoy</p>
          <p className="text-2xl font-bold text-white">${totalSales.toLocaleString()}</p>
        </Card>
        <Card className="bg-slate-900 border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Ventas Completadas</p>
          <p className="text-2xl font-bold text-green-400">{completedSales}</p>
        </Card>
        <Card className="bg-slate-900 border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Ventas Pendientes</p>
          <p className="text-2xl font-bold text-yellow-400">{pendingSales}</p>
        </Card>
        <Card className="bg-slate-900 border-slate-700/50 p-4">
          <p className="text-sm text-slate-400 mb-1">Total Transacciones</p>
          <p className="text-2xl font-bold text-white">{sales.length}</p>
        </Card>
      </div>

      {/* Search and filters */}
      <Card className="bg-slate-900 border-slate-700/50 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar por ID de venta o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
            <Calendar className="w-4 h-4 mr-2" />
            Fecha
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </Card>

      {/* Sales table */}
      <Card className="bg-slate-900 border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left p-4 text-sm font-semibold text-slate-300">ID Venta</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-300">Cliente</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-300">Fecha y Hora</th>
                <th className="text-center p-4 text-sm font-semibold text-slate-300">Items</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-300">Pago</th>
                <th className="text-right p-4 text-sm font-semibold text-slate-300">Total</th>
                <th className="text-center p-4 text-sm font-semibold text-slate-300">Estado</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-300">Cajero</th>
                <th className="text-center p-4 text-sm font-semibold text-slate-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-medium text-indigo-400">#{sale.id}</span>
                  </td>
                  <td className="p-4 text-white font-medium">{sale.customer}</td>
                  <td className="p-4 text-slate-400">{sale.date}</td>
                  <td className="p-4 text-center text-slate-300">{sale.items}</td>
                  <td className="p-4 text-slate-300">{sale.payment}</td>
                  <td className="p-4 text-right font-semibold text-white">${sale.total}</td>
                  <td className="p-4 text-center">
                    <Badge className={getStatusColor(sale.status)}>
                      {getStatusText(sale.status)}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-400">{sale.cashier}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-700/50 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Mostrando {filteredSales.length} de {sales.length} ventas
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              Siguiente
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}