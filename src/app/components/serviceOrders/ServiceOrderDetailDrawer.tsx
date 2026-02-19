'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import {
  ServiceOrder,
  ServiceOrderStatus,
  SERVICE_ORDER_STATUS_CONFIG,
  EQUIPMENT_TYPE_CONFIG,
  ApprovalStatus,
  PartStatus,
} from '../../types/serviceOrders.types';
import { getCurrentUser } from '../../utils/auth';
import { formatCurrency } from '../../utils/formatters';

interface ServiceOrderDetailDrawerProps {
  order: ServiceOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: ServiceOrderStatus) => void;
  onUpdateApproval: (orderId: string, status: ApprovalStatus, note: string) => void;
  onCompleteTask: (orderId: string, taskId: string) => void;
  onCloseOrder: (orderId: string) => void;
  onEdit: (order: ServiceOrder) => void;
}

export function ServiceOrderDetailDrawer({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateApproval,
  onCompleteTask,
  onCloseOrder,
  onEdit,
}: ServiceOrderDetailDrawerProps) {
  const currentUser = getCurrentUser();
  const canSeeCosts = currentUser?.rol !== 'supervisor';

  const [approvalNote, setApprovalNote] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  if (!order) return null;

  const equipmentConfig = EQUIPMENT_TYPE_CONFIG[order.equipment.type];
  const statusConfig = SERVICE_ORDER_STATUS_CONFIG[order.status];
  const StatusIcon = (LucideIcons as any)[statusConfig.icon] || LucideIcons.Circle;
  const EquipmentIcon = (LucideIcons as any)[equipmentConfig.icon] || LucideIcons.HardDrive;

  const completedTasks = order.tasks.filter(t => t.completed).length;
  const totalTasks = order.tasks.length;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-[var(--odin-bg-primary)] border-[var(--odin-border-accent)] overflow-hidden p-0">
        {/* Header fijo */}
        <SheetHeader className="p-6 border-b border-[var(--odin-border-accent)] bg-[var(--odin-bg-card)]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-2xl font-bold text-[var(--odin-text-primary)] mb-2">
                {order.orderNumber}
              </SheetTitle>
              <div className="flex items-center space-x-3">
                <Badge className={statusConfig.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig.label}
                </Badge>
                {order.priority === 'urgente' && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    <LucideIcons.AlertCircle className="w-3 h-3 mr-1" />
                    Urgente
                  </Badge>
                )}
                {order.isOverdue && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    <LucideIcons.AlertTriangle className="w-3 h-3 mr-1" />
                    Atrasado
                  </Badge>
                )}
              </div>
            </div>
            <Button
              onClick={() => onEdit(order)}
              variant="outline"
              size="sm"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 ml-4"
            >
              <LucideIcons.Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </SheetHeader>

        {/* Contenido con tabs */}
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-6">
            <Tabs defaultValue="resumen" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)]">
                <TabsTrigger value="resumen" className="text-xs">
                  <LucideIcons.FileText className="w-4 h-4 mr-1" />
                  Resumen
                </TabsTrigger>
                <TabsTrigger value="tareas" className="text-xs">
                  <LucideIcons.ListChecks className="w-4 h-4 mr-1" />
                  Tareas
                </TabsTrigger>
                <TabsTrigger value="repuestos" className="text-xs">
                  <LucideIcons.Package className="w-4 h-4 mr-1" />
                  Repuestos
                </TabsTrigger>
                <TabsTrigger value="aprobacion" className="text-xs">
                  <LucideIcons.CheckCircle className="w-4 h-4 mr-1" />
                  Aprobación
                </TabsTrigger>
                <TabsTrigger value="entrega" className="text-xs">
                  <LucideIcons.PackageCheck className="w-4 h-4 mr-1" />
                  Entrega
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: RESUMEN */}
              <TabsContent value="resumen" className="space-y-6 mt-6">
                {/* Timeline de estados */}
                <div className="bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
                  <h3 className="text-[var(--odin-text-primary)] font-bold mb-4 flex items-center">
                    <LucideIcons.History className="w-4 h-4 mr-2" />
                    Timeline de Estados
                  </h3>
                  <div className="space-y-3">
                    {[
                      ServiceOrderStatus.RECIBIDA,
                      ServiceOrderStatus.DIAGNOSTICO,
                      ServiceOrderStatus.APROBACION,
                      ServiceOrderStatus.REPARACION,
                      ServiceOrderStatus.LISTO,
                      ServiceOrderStatus.ENTREGADO,
                    ].map((status, index) => {
                      const config = SERVICE_ORDER_STATUS_CONFIG[status];
                      const Icon = (LucideIcons as any)[config.icon] || LucideIcons.Circle;
                      const isCurrent = order.status === status;
                      const isPast = Object.values(ServiceOrderStatus).indexOf(order.status) > index;
                      
                      return (
                        <div key={status} className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${isCurrent ? config.color : isPast ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-500'}`}>
                            {Icon && <Icon className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${isCurrent ? 'text-[var(--odin-text-primary)]' : isPast ? 'text-green-400' : 'text-[var(--odin-text-secondary)]'}`}>
                              {config.label}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-[var(--odin-text-secondary)]">Estado actual</p>
                            )}
                          </div>
                          {isPast && <LucideIcons.Check className="w-5 h-5 text-green-400" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cliente */}
                <div className="bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
                  <h3 className="text-[var(--odin-text-primary)] font-bold mb-3 flex items-center">
                    <LucideIcons.User className="w-4 h-4 mr-2" />
                    Cliente
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-[var(--odin-text-secondary)]">Nombre</p>
                      <p className="text-[var(--odin-text-primary)] font-medium">{order.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--odin-text-secondary)]">Teléfono</p>
                      <p className="text-[var(--odin-text-primary)]">{order.customer.phone}</p>
                    </div>
                    {order.customer.email && (
                      <div>
                        <p className="text-xs text-[var(--odin-text-secondary)]">Email</p>
                        <p className="text-[var(--odin-text-primary)]">{order.customer.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Equipo */}
                <div className="bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
                  <h3 className="text-[var(--odin-text-primary)] font-bold mb-3 flex items-center">
                    <EquipmentIcon className="w-4 h-4 mr-2" />
                    Equipo
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-[var(--odin-text-secondary)]">Tipo</p>
                      <p className="text-[var(--odin-text-primary)] font-medium">{equipmentConfig.label}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--odin-text-secondary)]">Marca y Modelo</p>
                      <p className="text-[var(--odin-text-primary)]">{order.equipment.brand} {order.equipment.model}</p>
                    </div>
                    {order.equipment.serial && (
                      <div>
                        <p className="text-xs text-[var(--odin-text-secondary)]">Serial</p>
                        <p className="text-[var(--odin-text-primary)] font-mono">{order.equipment.serial}</p>
                      </div>
                    )}
                    {order.equipment.accessories && (
                      <div>
                        <p className="text-xs text-[var(--odin-text-secondary)]">Accesorios Recibidos</p>
                        <p className="text-[var(--odin-text-primary)]">{order.equipment.accessories}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Problema y Diagnóstico */}
                <div className="bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
                  <h3 className="text-[var(--odin-text-primary)] font-bold mb-3 flex items-center">
                    <LucideIcons.AlertCircle className="w-4 h-4 mr-2" />
                    Problema Reportado
                  </h3>
                  <p className="text-[var(--odin-text-primary)] text-sm">{order.reportedIssue}</p>
                </div>

                {order.diagnosis && (
                  <div className="bg-[var(--odin-bg-card)] border border-purple-500/30 rounded-2xl p-4">
                    <h3 className="text-[var(--odin-text-primary)] font-bold mb-3 flex items-center">
                      <LucideIcons.Search className="w-4 h-4 mr-2" />
                      Diagnóstico
                    </h3>
                    <p className="text-[var(--odin-text-primary)] text-sm">{order.diagnosis}</p>
                  </div>
                )}

                {order.internalNotes && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
                    <h3 className="text-yellow-400 font-bold mb-3 flex items-center">
                      <LucideIcons.StickyNote className="w-4 h-4 mr-2" />
                      Notas Internas
                    </h3>
                    <p className="text-[var(--odin-text-primary)] text-sm">{order.internalNotes}</p>
                  </div>
                )}

                {/* Técnico asignado */}
                {order.assignedTechnician && (
                  <div className="bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
                    <h3 className="text-[var(--odin-text-primary)] font-bold mb-3 flex items-center">
                      <LucideIcons.UserCheck className="w-4 h-4 mr-2" />
                      Técnico Asignado
                    </h3>
                    <p className="text-[var(--odin-text-primary)] font-medium">{order.assignedTechnician.name}</p>
                  </div>
                )}

                {/* Fechas */}
                <div className="bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
                  <h3 className="text-[var(--odin-text-primary)] font-bold mb-3 flex items-center">
                    <LucideIcons.Calendar className="w-4 h-4 mr-2" />
                    Fechas
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-[var(--odin-text-secondary)]">Creada</p>
                      <p className="text-[var(--odin-text-primary)]">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    {order.expectedDelivery && (
                      <div>
                        <p className="text-xs text-[var(--odin-text-secondary)]">Entrega Estimada</p>
                        <p className="text-[var(--odin-text-primary)]">{new Date(order.expectedDelivery).toLocaleString()}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-[var(--odin-text-secondary)]">Antigüedad</p>
                      <p className="text-[var(--odin-text-primary)]">{order.daysOld} día{order.daysOld !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 2: TAREAS/PROCESO */}
              <TabsContent value="tareas" className="space-y-6 mt-6">
                {/* Progreso */}
                <div className="bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[var(--odin-text-primary)] font-bold flex items-center">
                      <LucideIcons.ListChecks className="w-4 h-4 mr-2" />
                      Progreso
                    </h3>
                    <span className="text-[var(--odin-text-primary)] font-bold">
                      {completedTasks}/{totalTasks}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Lista de tareas */}
                <div className="space-y-3">
                  {order.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`bg-[var(--odin-bg-card)] border rounded-2xl p-4 ${
                        task.completed ? 'border-green-500/30' : 'border-[var(--odin-border-accent)]'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => onCompleteTask(order.id, task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className={`text-[var(--odin-text-primary)] ${task.completed ? 'line-through opacity-60' : ''}`}>
                            {task.description}
                          </p>
                          {task.completed && task.completedBy && (
                            <p className="text-xs text-green-400 mt-1">
                              ✓ Completado por {task.completedBy}
                              {task.completedAt && ` - ${new Date(task.completedAt).toLocaleString()}`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {order.tasks.length === 0 && (
                    <div className="text-center py-8 text-[var(--odin-text-secondary)]">
                      <LucideIcons.ListChecks className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No hay tareas registradas</p>
                    </div>
                  )}
                </div>

                {/* Log de acciones */}
                <div className="bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
                  <h3 className="text-[var(--odin-text-primary)] font-bold mb-4 flex items-center">
                    <LucideIcons.Activity className="w-4 h-4 mr-2" />
                    Registro de Acciones
                  </h3>
                  <div className="space-y-3">
                    {order.log.map((entry) => (
                      <div key={entry.id} className="flex items-start space-x-3 pb-3 border-b border-[var(--odin-border-accent)] last:border-0">
                        <div className="bg-purple-500/10 p-2 rounded-full mt-0.5">
                          <LucideIcons.Circle className="w-3 h-3 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[var(--odin-text-primary)] text-sm font-medium">{entry.action}</p>
                          <p className="text-xs text-[var(--odin-text-secondary)]">
                            {entry.performedBy} - {new Date(entry.timestamp).toLocaleString()}
                          </p>
                          {entry.notes && (
                            <p className="text-xs text-[var(--odin-text-secondary)] mt-1 italic">{entry.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: REPUESTOS */}
              <TabsContent value="repuestos" className="space-y-6 mt-6">
                <div className="space-y-3">
                  {order.parts.map((part) => {
                    const statusColors = {
                      [PartStatus.DISPONIBLE]: 'bg-green-500/20 text-green-400 border-green-500/30',
                      [PartStatus.PENDIENTE]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                      [PartStatus.RECIBIDO]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                    };

                    return (
                      <div key={part.id} className="bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-[var(--odin-text-primary)] font-medium">{part.name}</p>
                            <p className="text-xs text-[var(--odin-text-secondary)]">Cantidad: {part.quantity}</p>
                          </div>
                          <Badge className={statusColors[part.status]}>
                            {part.status === PartStatus.DISPONIBLE && 'Disponible'}
                            {part.status === PartStatus.PENDIENTE && 'Pendiente'}
                            {part.status === PartStatus.RECIBIDO && 'Recibido'}
                          </Badge>
                        </div>

                        {canSeeCosts && part.cost && (
                          <div className="mt-2 pt-2 border-t border-[var(--odin-border-accent)]">
                            <p className="text-[var(--odin-text-primary)] font-bold">
                              Costo: {formatCurrency(part.cost)}
                            </p>
                          </div>
                        )}

                        {part.requestDate && (
                          <p className="text-xs text-[var(--odin-text-secondary)] mt-2">
                            Solicitado: {new Date(part.requestDate).toLocaleDateString()}
                          </p>
                        )}
                        {part.receivedDate && (
                          <p className="text-xs text-green-400 mt-1">
                            Recibido: {new Date(part.receivedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {order.parts.length === 0 && (
                    <div className="text-center py-8 text-[var(--odin-text-secondary)]">
                      <LucideIcons.Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No se han registrado repuestos</p>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
                  disabled
                >
                  <LucideIcons.Plus className="w-4 h-4 mr-2" />
                  Solicitar Repuesto (Mock)
                </Button>
              </TabsContent>

              {/* TAB 4: APROBACIÓN */}
              <TabsContent value="aprobacion" className="space-y-6 mt-6">
                <div className="bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
                  <h3 className="text-[var(--odin-text-primary)] font-bold mb-4 flex items-center">
                    <LucideIcons.CheckCircle className="w-4 h-4 mr-2" />
                    Estado de Aprobación
                  </h3>

                  {order.approval.status === ApprovalStatus.PENDIENTE && (
                    <div className="space-y-4">
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-lg px-4 py-2">
                        <LucideIcons.Clock className="w-5 h-5 mr-2" />
                        Pendiente de Aprobación
                      </Badge>

                      <div>
                        <label className="text-[var(--odin-text-primary)] text-sm mb-2 block">
                          Nota de Aprobación
                        </label>
                        <Textarea
                          value={approvalNote}
                          onChange={(e) => setApprovalNote(e.target.value)}
                          placeholder="Agregar nota sobre la aprobación..."
                          className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            onUpdateApproval(order.id, ApprovalStatus.APROBADO, approvalNote);
                            setApprovalNote('');
                          }}
                        >
                          <LucideIcons.Check className="w-4 h-4 mr-2" />
                          Marcar Aprobado
                        </Button>
                        <Button
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          onClick={() => {
                            onUpdateApproval(order.id, ApprovalStatus.RECHAZADO, approvalNote);
                            setApprovalNote('');
                          }}
                        >
                          <LucideIcons.X className="w-4 h-4 mr-2" />
                          Marcar Rechazado
                        </Button>
                      </div>
                    </div>
                  )}

                  {order.approval.status === ApprovalStatus.APROBADO && (
                    <div className="space-y-3">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-lg px-4 py-2">
                        <LucideIcons.CheckCircle className="w-5 h-5 mr-2" />
                        Aprobado
                      </Badge>
                      {order.approval.note && (
                        <p className="text-[var(--odin-text-primary)] text-sm">{order.approval.note}</p>
                      )}
                      {order.approval.approvedAt && (
                        <p className="text-xs text-[var(--odin-text-secondary)]">
                          Aprobado el {new Date(order.approval.approvedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {order.approval.status === ApprovalStatus.RECHAZADO && (
                    <div className="space-y-3">
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-lg px-4 py-2">
                        <LucideIcons.XCircle className="w-5 h-5 mr-2" />
                        Rechazado
                      </Badge>
                      {order.approval.note && (
                        <p className="text-[var(--odin-text-primary)] text-sm">{order.approval.note}</p>
                      )}
                    </div>
                  )}

                  {order.approval.status === ApprovalStatus.NO_REQUERIDO && (
                    <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 text-lg px-4 py-2">
                      <LucideIcons.Info className="w-5 h-5 mr-2" />
                      No Requiere Aprobación
                    </Badge>
                  )}
                </div>
              </TabsContent>

              {/* TAB 5: ENTREGA/CIERRE */}
              <TabsContent value="entrega" className="space-y-6 mt-6">
                <div className="bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-2xl p-4">
                  <h3 className="text-[var(--odin-text-primary)] font-bold mb-4 flex items-center">
                    <LucideIcons.ClipboardCheck className="w-4 h-4 mr-2" />
                    Checklist de Entrega
                  </h3>

                  <div className="space-y-3">
                    {[
                      { id: 'equipmentTested', label: 'Equipo probado y funcional' },
                      { id: 'customerSatisfied', label: 'Cliente satisfecho con el servicio' },
                      { id: 'paymentReceived', label: 'Pago recibido' },
                      { id: 'warrantyIssued', label: 'Garantía emitida' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-slate-900/30 rounded-lg">
                        <Checkbox
                          checked={order.deliveryChecklist?.[item.id as keyof typeof order.deliveryChecklist] || false}
                          disabled={order.status === ServiceOrderStatus.ENTREGADO}
                        />
                        <label className="text-[var(--odin-text-primary)] text-sm">{item.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[var(--odin-text-primary)] text-sm mb-2 block font-medium">
                    Notas de Entrega
                  </label>
                  <Textarea
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Agregar notas sobre la entrega..."
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
                    disabled={order.status === ServiceOrderStatus.ENTREGADO}
                  />
                </div>

                {order.status !== ServiceOrderStatus.ENTREGADO && (
                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg text-lg py-6"
                    onClick={() => onCloseOrder(order.id)}
                    disabled={order.status !== ServiceOrderStatus.LISTO}
                  >
                    <LucideIcons.PackageCheck className="w-5 h-5 mr-2" />
                    Cerrar Orden y Marcar como Entregado
                  </Button>
                )}

                {order.status === ServiceOrderStatus.ENTREGADO && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 text-center">
                    <LucideIcons.CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-green-400 font-bold text-lg">Orden Entregada</p>
                    {order.deliveredAt && (
                      <p className="text-[var(--odin-text-secondary)] text-sm mt-2">
                        {new Date(order.deliveredAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}