'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, Clock, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { formatCurrency } from '../../utils/formatters';

const todayTransactions = [
  { id: 1, time: '14:30', customer: 'María González', amount: 450, method: 'Tarjeta' },
  { id: 2, time: '14:18', customer: 'Carlos Ruiz', amount: 280, method: 'Efectivo' },
  { id: 3, time: '14:05', customer: 'Ana Martínez', amount: 890, method: 'Transferencia' },
  { id: 4, time: '13:45', customer: 'Luis Fernández', amount: 320, method: 'Tarjeta' },
  { id: 5, time: '12:30', customer: 'Sofia López', amount: 625, method: 'Efectivo' },
];

export default function CajaPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const totalCash = 8540;
  const totalCard = 3910;
  const totalTransfers = 2200;

  const handleToggleCaja = () => {
    if (isOpen) {
      if (confirm('¿Está seguro de que desea cerrar la caja? Se generará un reporte de cierre.')) {
        setIsOpen(false);
        alert('Caja cerrada correctamente. Reporte generado.');
      }
    } else {
      setIsOpen(true);
      alert('Caja abierta correctamente. Puede comenzar a registrar transacciones.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Caja Registradora</h1>
          <p className="text-slate-400">Control de caja y transacciones del día</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-purple-500/30 text-white hover:bg-purple-500/10 hover:border-purple-500/50 bg-slate-900/50"
            onClick={() => setShowHistory(!showHistory)}
          >
            <Clock className="w-4 h-4 mr-2" />
            Ver Historial
          </Button>
          <Button 
            className={`transition-all ${
              isOpen 
                ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-lg hover:shadow-red-500/50' 
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50'
            } text-white`}
            onClick={handleToggleCaja}
          >
            {isOpen ? 'Cerrar Caja' : 'Abrir Caja'}
          </Button>
        </div>
      </div>

      {/* Status card */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-xl ${
              isOpen 
                ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                : 'bg-gradient-to-br from-red-500 to-pink-500'
            } flex items-center justify-center`}>
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Caja {isOpen ? 'Abierta' : 'Cerrada'}</h3>
              <p className="text-slate-400">Turno actual: Administrador</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400 mb-1">Total en Caja</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              {formatCurrency(totalCash + totalCard + totalTransfers)}
            </p>
          </div>
        </div>
      </Card>

      {/* Payment methods stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-slate-900/50 to-green-900/20 border-green-500/20 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Efectivo</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalCash)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Banknote className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/50 to-blue-900/20 border-blue-500/20 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Tarjetas</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalCard)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Transferencias</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalTransfers)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Today's transactions */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
          Transacciones de Hoy
        </h3>
        <div className="space-y-3">
          {todayTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition-all">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-slate-400 font-mono">{transaction.time}</div>
                <div>
                  <p className="font-medium text-white">{transaction.customer}</p>
                  <p className="text-sm text-slate-400">{transaction.method}</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-white">{formatCurrency(transaction.amount)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}