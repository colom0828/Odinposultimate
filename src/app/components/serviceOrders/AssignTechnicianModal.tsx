'use client';

import * as LucideIcons from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { getCurrentUser } from '../../utils/auth';

interface AssignTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  technicians: Array<{ id: string; name: string }>;
  onAssign: (technicianId: string, technicianName: string) => void;
  currentOrder?: {
    orderNumber: string;
    customerName: string;
    equipmentInfo: string;
  };
}

export function AssignTechnicianModal({
  isOpen,
  onClose,
  technicians,
  onAssign,
  currentOrder,
}: AssignTechnicianModalProps) {
  const currentUser = getCurrentUser();

  const handleAssign = (technicianId: string, technicianName: string) => {
    onAssign(technicianId, technicianName);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[var(--odin-text-primary)] flex items-center">
            <LucideIcons.UserPlus className="w-5 h-5 mr-2 text-purple-400" />
            Asignar Técnico
          </DialogTitle>
        </DialogHeader>

        {currentOrder && (
          <div className="bg-[var(--odin-bg-primary)] border border-[var(--odin-border-accent)] rounded-lg p-4 mb-4">
            <p className="text-xs text-[var(--odin-text-secondary)] mb-1">Orden</p>
            <p className="font-mono font-bold text-purple-400 mb-2">{currentOrder.orderNumber}</p>
            <p className="text-[var(--odin-text-primary)] font-medium">{currentOrder.customerName}</p>
            <p className="text-[var(--odin-text-secondary)] text-sm">{currentOrder.equipmentInfo}</p>
          </div>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {technicians.length === 0 ? (
            <div className="text-center py-8">
              <LucideIcons.Users className="w-12 h-12 mx-auto text-[var(--odin-text-secondary)] opacity-30 mb-3" />
              <p className="text-[var(--odin-text-secondary)]">No hay técnicos disponibles</p>
            </div>
          ) : (
            technicians.map((tech) => (
              <button
                key={tech.id}
                onClick={() => handleAssign(tech.id, tech.name)}
                className="w-full bg-[var(--odin-bg-primary)] border border-[var(--odin-border-accent)] rounded-xl p-4 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-500/10 p-3 rounded-full group-hover:bg-purple-500/20 transition-all">
                      <LucideIcons.UserCheck className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[var(--odin-text-primary)] font-semibold group-hover:text-purple-400 transition-colors">
                        {tech.name}
                      </p>
                      <p className="text-xs text-[var(--odin-text-secondary)]">Técnico</p>
                    </div>
                  </div>
                  <LucideIcons.ChevronRight className="w-5 h-5 text-[var(--odin-text-secondary)] group-hover:text-purple-400 transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>

        <DialogFooter className="border-t border-[var(--odin-border-accent)] pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
          >
            <LucideIcons.X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
