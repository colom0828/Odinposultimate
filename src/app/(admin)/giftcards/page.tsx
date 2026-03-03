/**
 * ═══════════════════════════════════════════════════════════════
 * GIFTCARDS / TARJETAS DE REGALO - PÁGINA PRINCIPAL
 * ═══════════════════════════════════════════════════════════════
 */

'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, RefreshCw, Ban, Printer, Mail, Send } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner';
import { useConfig } from '../../contexts/ConfigContext'; // ⭐ CORREGIDO
import type { Giftcard, GiftcardFilters, GiftcardKPIs } from '../../types/giftcard.types';
import {
  listGiftcards,
  getGiftcardKPIs,
  initializeMockData,
} from '../../services/giftcard.service';
import { GiftcardCreateModal } from '../../components/giftcards/GiftcardCreateModal';
import { GiftcardRedeemModal } from '../../components/giftcards/GiftcardRedeemModal';
import { GiftcardRechargeModal } from '../../components/giftcards/GiftcardRechargeModal';
import { GiftcardDetailModal } from '../../components/giftcards/GiftcardDetailModal';
import { GiftcardVoidModal } from '../../components/giftcards/GiftcardVoidModal';

export default function GiftcardsPage() {
  const { config } = useConfig(); // ⭐ CORREGIDO
  const [giftcards, setGiftcards] = useState<Giftcard[]>([]);
  const [kpis, setKpis] = useState<GiftcardKPIs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<GiftcardFilters>({});
  
  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [selectedGiftcard, setSelectedGiftcard] = useState<Giftcard | null>(null);

  // Cargar datos
  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await initializeMockData(); // Inicializar mock data si no existe
      const [giftcardsData, kpisData] = await Promise.all([
        listGiftcards(filters),
        getGiftcardKPIs(),
      ]);
      setGiftcards(giftcardsData);
      setKpis(kpisData);
    } catch (error) {
      console.error('Error loading giftcards:', error);
      toast.error('Error al cargar las giftcards');
    } finally {
      setIsLoading(false);
    }
  };

  // Labels dinámicos por tipo de negocio
  const getModuleLabel = () => {
    if (!config) return 'Giftcards';
    
    switch (config.businessType) {
      case 'restaurant':
      case 'bar':
      case 'cafe':
      case 'fast_food':
        return 'Giftcards';
      case 'spa':
        return 'Tarjetas de Regalo';
      case 'hardware':
      case 'retail':
      case 'wholesale':
        return 'Giftcard / Crédito';
      default:
        return 'Giftcards';
    }
  };

  const getStatusBadge = (status: Giftcard['status']) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      DEPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      EXPIRED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      VOIDED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    
    const labels = {
      ACTIVE: 'Activa',
      DEPLETED: 'Agotada',
      EXPIRED: 'Expirada',
      VOIDED: 'Anulada',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeBadge = (type: Giftcard['type']) => {
    const styles = {
      DIGITAL: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      PHYSICAL: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    
    const labels = {
      DIGITAL: 'Digital',
      PHYSICAL: 'Física',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewDetail = (giftcard: Giftcard) => {
    setSelectedGiftcard(giftcard);
    setShowDetailModal(true);
  };

  const handleRedeem = (giftcard: Giftcard) => {
    setSelectedGiftcard(giftcard);
    setShowRedeemModal(true);
  };

  const handleRecharge = (giftcard: Giftcard) => {
    setSelectedGiftcard(giftcard);
    setShowRechargeModal(true);
  };

  const handleVoid = (giftcard: Giftcard) => {
    setSelectedGiftcard(giftcard);
    setShowVoidModal(true);
  };

  if (isLoading && !kpis) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {getModuleLabel()}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gestiona tarjetas de regalo, saldo y redenciones
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear Giftcard
        </Button>
      </div>

      {/* KPIs */}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Saldo Pendiente</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {formatCurrency(kpis.totalPendingBalance)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Liability total</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Vendidas (Mes)</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {kpis.soldThisMonth}
                </p>
                <p className="text-xs text-green-600 mt-1">↑ Este mes</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Redimidas (Mes)</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {formatCurrency(kpis.redeemedThisMonth)}
                </p>
                <p className="text-xs text-blue-600 mt-1">Este mes</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Recargas (Mes)</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {formatCurrency(kpis.rechargedThisMonth)}
                </p>
                <p className="text-xs text-orange-600 mt-1">Este mes</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Código, cliente, teléfono..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label>Estado</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value === 'all' ? undefined : value as any })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ACTIVE">Activas</SelectItem>
                <SelectItem value="DEPLETED">Agotadas</SelectItem>
                <SelectItem value="EXPIRED">Expiradas</SelectItem>
                <SelectItem value="VOIDED">Anuladas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tipo</Label>
            <Select
              value={filters.type || 'all'}
              onValueChange={(value) =>
                setFilters({ ...filters, type: value === 'all' ? undefined : value as any })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="DIGITAL">Digital</SelectItem>
                <SelectItem value="PHYSICAL">Física</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={loadData} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Beneficiario
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Saldo
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Inicial
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Expira
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {giftcards.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No hay giftcards para mostrar
                  </td>
                </tr>
              ) : (
                giftcards.map((giftcard) => (
                  <tr key={giftcard.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                        {giftcard.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {giftcard.beneficiaryName}
                        </p>
                        {giftcard.beneficiaryPhone && (
                          <p className="text-xs text-slate-500">{giftcard.beneficiaryPhone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">{getTypeBadge(giftcard.type)}</td>
                    <td className="px-4 py-3">{getStatusBadge(giftcard.status)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(giftcard.balance)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                      {formatCurrency(giftcard.initialAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {giftcard.expiresAt ? formatDate(giftcard.expiresAt) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetail(giftcard)}
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {giftcard.status === 'ACTIVE' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRecharge(giftcard)}
                              title="Recargar"
                            >
                              <RefreshCw className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleVoid(giftcard)}
                              title="Anular"
                            >
                              <Ban className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {showCreateModal && (
        <GiftcardCreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            loadData();
            setShowCreateModal(false);
          }}
        />
      )}

      {showRedeemModal && selectedGiftcard && (
        <GiftcardRedeemModal
          isOpen={showRedeemModal}
          giftcard={selectedGiftcard}
          onClose={() => {
            setShowRedeemModal(false);
            setSelectedGiftcard(null);
          }}
          onSuccess={() => {
            loadData();
            setShowRedeemModal(false);
            setSelectedGiftcard(null);
          }}
        />
      )}

      {showRechargeModal && selectedGiftcard && (
        <GiftcardRechargeModal
          isOpen={showRechargeModal}
          giftcard={selectedGiftcard}
          onClose={() => {
            setShowRechargeModal(false);
            setSelectedGiftcard(null);
          }}
          onSuccess={() => {
            loadData();
            setShowRechargeModal(false);
            setSelectedGiftcard(null);
          }}
        />
      )}

      {showDetailModal && selectedGiftcard && (
        <GiftcardDetailModal
          isOpen={showDetailModal}
          giftcard={selectedGiftcard}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedGiftcard(null);
          }}
          onReload={loadData}
        />
      )}

      {showVoidModal && selectedGiftcard && (
        <GiftcardVoidModal
          isOpen={showVoidModal}
          giftcard={selectedGiftcard}
          onClose={() => {
            setShowVoidModal(false);
            setSelectedGiftcard(null);
          }}
          onSuccess={() => {
            loadData();
            setShowVoidModal(false);
            setSelectedGiftcard(null);
          }}
        />
      )}
    </div>
  );
}