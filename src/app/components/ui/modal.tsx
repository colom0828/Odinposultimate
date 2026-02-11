import { X } from 'lucide-react';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--odin-border)]">
          <h2 className="text-2xl font-bold text-[var(--odin-text-primary)]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-[var(--odin-text-secondary)] hover:text-[var(--odin-text-primary)] hover:bg-purple-500/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-[var(--odin-border)] bg-[var(--odin-input-bg)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}