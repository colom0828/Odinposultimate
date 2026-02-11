'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Plus, TrendingUp, TrendingDown, Eye, Download, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { formatCurrency } from '../../utils/formatters';
import { useCashRegister } from '../../hooks/useCashRegister';
import { OpenCashRegisterModal } from '../../components/OpenCashRegisterModal';
import { CloseCashRegisterModal } from '../../components/CloseCashRegisterModal';
import { CashTransactionModal } from '../../components/CashTransactionModal';
import { CashMovementDetailsModal } from '../../components/CashMovementDetailsModal';
import { CashRegisterLogDetailsModal } from '../../components/CashRegisterLogDetailsModal';
import { CashMovement, CashRegisterLog } from '../../hooks/useCashRegister';

export default function CajaPage() {
  const { movements, logs, isLoading } = useCashRegister();
  
  // Estados - TODOS declarados primero antes de cualquier useEffect
  const [activeTab, setActiveTab] = useState<'movements' | 'logs'>('movements');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<CashMovement | null>(null);
  const [selectedLog, setSelectedLog] = useState<CashRegisterLog | null>(null);
  const [showMovementDetails, setShowMovementDetails] = useState(false);
  const [showLogDetails, setShowLogDetails] = useState(false);
  const [filteredMovements, setFilteredMovements] = useState(movements);
  const [filteredLogs, setFilteredLogs] = useState(logs);
  
  // Estados de paginación
  const [currentPageMovements, setCurrentPageMovements] = useState(1);
  const [currentPageLogs, setCurrentPageLogs] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // useEffects - DESPUÉS de todos los useState
  useEffect(() => {
    const filtered = movements.filter(m =>
      m.cashRegister.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovements(filtered);
  }, [movements, searchTerm]);

  useEffect(() => {
    const filtered = logs.filter(l =>
      l.cashRegister.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
  }, [logs, searchTerm]);

  // Escuchar actualizaciones
  useEffect(() => {
    const handleUpdate = () => {
      // Force re-render
    };
    window.addEventListener('cash-register-updated', handleUpdate);
    return () => window.removeEventListener('cash-register-updated', handleUpdate);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'Apertura':
        return 'text-green-400';
      case 'Cierre':
        return 'text-red-400';
      case 'Ingreso Efectivo':
        return 'text-blue-400';
      case 'Retiro Efectivo':
        return 'text-orange-400';
      default:
        return 'text-[var(--odin-text-secondary)]';
    }
  };

  // Paginación para Movimientos
  const totalPagesMovements = Math.ceil(filteredMovements.length / itemsPerPage);
  const startIndexMovements = (currentPageMovements - 1) * itemsPerPage;
  const endIndexMovements = startIndexMovements + itemsPerPage;
  const paginatedMovements = filteredMovements.slice(startIndexMovements, endIndexMovements);

  // Paginación para Logs
  const totalPagesLogs = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndexLogs = (currentPageLogs - 1) * itemsPerPage;
  const endIndexLogs = startIndexLogs + itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndexLogs, endIndexLogs);

  // Generar números de página
  const generatePageNumbers = (currentPage: number, totalPages: number) => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--odin-text-secondary)]">Cargando cajas...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-[var(--odin-text-primary)] mb-2">Caja Registradora</h1>
        <p className="text-[var(--odin-text-secondary)]">Gestión de cajas y movimientos de efectivo</p>
      </motion.div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setShowOpenModal(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Abrir Caja
        </Button>
        <Button
          onClick={() => setShowCloseModal(true)}
          className="bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-lg hover:shadow-red-500/50 text-white"
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Cerrar Caja
        </Button>
        <Button
          onClick={() => setShowDepositModal(true)}
          variant="outline"
          className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] hover:bg-green-500/10 hover:border-green-500/50 bg-[var(--odin-input-bg)]"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Ingreso Efectivo
        </Button>
        <Button
          onClick={() => setShowWithdrawalModal(true)}
          variant="outline"
          className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] hover:bg-orange-500/10 hover:border-orange-500/50 bg-[var(--odin-input-bg)]"
        >
          <TrendingDown className="w-4 h-4 mr-2" />
          Retiro Efectivo
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[var(--odin-border)]">
        <button
          onClick={() => setActiveTab('movements')}
          className={`px-4 py-2 font-medium transition-all relative ${
            activeTab === 'movements'
              ? 'text-purple-400'
              : 'text-[var(--odin-text-secondary)] hover:text-[var(--odin-text-primary)]'
          }`}
        >
          Apertura y Cierre - Movimientos de Caja
          {activeTab === 'movements' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 font-medium transition-all relative ${
            activeTab === 'logs'
              ? 'text-purple-400'
              : 'text-[var(--odin-text-secondary)] hover:text-[var(--odin-text-primary)]'
          }`}
        >
          Cash Register Logs
          {activeTab === 'logs' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'movements' && (
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-sm transition-colors duration-300 overflow-hidden">
          {/* Table header with actions */}
          <div className="p-4 border-b border-[var(--odin-border)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 bg-[var(--odin-input-bg)]"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Open/Close History
              </Button>
              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPageMovements(1);
                  }}
                  className="bg-[var(--odin-input-bg)] border border-[var(--odin-input-border)] text-[var(--odin-text-primary)] rounded px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-[var(--odin-text-secondary)]">entries per page</span>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--odin-text-secondary)]" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[var(--odin-input-bg)] border-[var(--odin-input-border)] text-[var(--odin-text-primary)] w-64"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--odin-input-bg)] border-b border-[var(--odin-border)]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">NO</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">CAJA REGISTRADORA</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">EMPLEADO</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">MONTO</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">FECHA</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">MOVIMIENTO</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">DESCRIPCIÓN</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--odin-border)]">
                {paginatedMovements.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-[var(--odin-text-secondary)]">
                        <DollarSign className="w-12 h-12 mb-3 opacity-50" />
                        <p className="text-lg font-medium">No hay movimientos registrados</p>
                        <p className="text-sm mt-1">Abre una caja para comenzar</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedMovements.map((movement, index) => (
                    <tr key={movement.id} className="hover:bg-[var(--odin-input-bg)] transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--odin-text-primary)]">{filteredMovements.length - (startIndexMovements + index)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-purple-400">{movement.cashRegister}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-blue-400">{movement.employee}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-[var(--odin-text-primary)]">
                          {formatCurrency(movement.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--odin-text-secondary)]">{formatDate(movement.date)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${getMovementTypeColor(movement.movementType)}`}>
                          {movement.movementType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--odin-text-secondary)]">{movement.description}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="p-2 rounded-lg bg-[var(--odin-input-bg)] border border-[var(--odin-border)] hover:bg-purple-500/10 hover:border-purple-500/50 transition-all"
                          onClick={() => {
                            setSelectedMovement(movement);
                            setShowMovementDetails(true);
                          }}
                        >
                          <Eye className="w-4 h-4 text-purple-400" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-[var(--odin-border)] flex items-center justify-between">
            <span className="text-sm text-[var(--odin-text-secondary)]">
              Mostrando de {startIndexMovements + 1} a {Math.min(endIndexMovements, filteredMovements.length)} de {filteredMovements.length} entradas
            </span>
            <div className="flex gap-2">
              {generatePageNumbers(currentPageMovements, totalPagesMovements).map(page => (
                <button
                  key={page}
                  className={`w-8 h-8 rounded ${
                    page === currentPageMovements
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white'
                      : 'bg-[var(--odin-input-bg)] border border-[var(--odin-border)] text-[var(--odin-text-primary)] hover:bg-purple-500/10'
                  }`}
                  onClick={() => {
                    if (typeof page === 'number') {
                      setCurrentPageMovements(page);
                    }
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'logs' && (
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-sm transition-colors duration-300 overflow-hidden">
          {/* Table header with actions */}
          <div className="p-4 border-b border-[var(--odin-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPageLogs(1);
                }}
                className="bg-[var(--odin-input-bg)] border border-[var(--odin-input-border)] text-[var(--odin-text-primary)] rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-[var(--odin-text-secondary)]">entries per page</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--odin-text-secondary)]" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[var(--odin-input-bg)] border-[var(--odin-input-border)] text-[var(--odin-text-primary)] w-64"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--odin-input-bg)] border-b border-[var(--odin-border)]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">NO</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">CASH REGISTER</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">DATE</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">INITIAL AMOUNT</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">FINAL AMOUNT</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">LAG REASON</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--odin-text-primary)]">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--odin-border)]">
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-[var(--odin-text-secondary)]">
                        <DollarSign className="w-12 h-12 mb-3 opacity-50" />
                        <p className="text-lg font-medium">No hay logs registrados</p>
                        <p className="text-sm mt-1">Los logs aparecerán cuando abras cajas</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log, index) => (
                    <tr key={log.id} className="hover:bg-[var(--odin-input-bg)] transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--odin-text-primary)]">{filteredLogs.length - (startIndexLogs + index)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-purple-400">{log.cashRegister}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--odin-text-secondary)]">{formatDate(log.date)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-green-400">
                          {formatCurrency(log.initialAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${log.isOpen ? 'text-blue-400' : 'text-red-400'}`}>
                          {formatCurrency(log.finalAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[var(--odin-text-secondary)]">{log.lastReason}</span>
                          {log.isOpen && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                              Abierta
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="p-2 rounded-lg bg-[var(--odin-input-bg)] border border-[var(--odin-border)] hover:bg-purple-500/10 hover:border-purple-500/50 transition-all"
                          onClick={() => {
                            setSelectedLog(log);
                            setShowLogDetails(true);
                          }}
                        >
                          <Eye className="w-4 h-4 text-purple-400" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-[var(--odin-border)] flex items-center justify-between">
            <span className="text-sm text-[var(--odin-text-secondary)]">
              Mostrando de {startIndexLogs + 1} a {Math.min(endIndexLogs, filteredLogs.length)} de {filteredLogs.length} entradas
            </span>
            <div className="flex gap-2">
              {generatePageNumbers(currentPageLogs, totalPagesLogs).map(page => (
                <button
                  key={page}
                  className={`w-8 h-8 rounded ${
                    page === currentPageLogs
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white'
                      : 'bg-[var(--odin-input-bg)] border border-[var(--odin-border)] text-[var(--odin-text-primary)] hover:bg-purple-500/10'
                  }`}
                  onClick={() => {
                    if (typeof page === 'number') {
                      setCurrentPageLogs(page);
                    }
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Modals */}
      <OpenCashRegisterModal isOpen={showOpenModal} onClose={() => setShowOpenModal(false)} />
      <CloseCashRegisterModal isOpen={showCloseModal} onClose={() => setShowCloseModal(false)} />
      <CashTransactionModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        type="Ingreso Efectivo"
      />
      <CashTransactionModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        type="Retiro Efectivo"
      />
      <CashMovementDetailsModal
        isOpen={showMovementDetails}
        onClose={() => setShowMovementDetails(false)}
        movement={selectedMovement}
      />
      <CashRegisterLogDetailsModal
        isOpen={showLogDetails}
        onClose={() => setShowLogDetails(false)}
        log={selectedLog}
      />
    </motion.div>
  );
}