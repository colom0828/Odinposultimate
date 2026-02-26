/**
 * ═══════════════════════════════════════════════════════════════
 * TEMPLATE EDITOR - Editor con Drag & Drop
 * ═══════════════════════════════════════════════════════════════
 */

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { BlockConfigPanel } from './BlockConfigPanel';
import { SortableBlockItem } from './SortableBlockItem';
import { PrintTemplate, BlockConfig, BlockType } from '../../types/print-templates.types';

interface TemplateEditorProps {
  template: PrintTemplate;
  onChange: (template: PrintTemplate) => void;
}

export function TemplateEditor({ template, onChange }: TemplateEditorProps) {
  const [selectedBlock, setSelectedBlock] = useState<BlockConfig | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = template.blocks.findIndex((b) => b.id === active.id);
      const newIndex = template.blocks.findIndex((b) => b.id === over.id);

      const reorderedBlocks = arrayMove(template.blocks, oldIndex, newIndex);
      
      // Actualizar el orden de cada bloque
      const updatedBlocks = reorderedBlocks.map((block, index) => ({
        ...block,
        order: index
      }));

      onChange({
        ...template,
        blocks: updatedBlocks
      });
    }
  };

  const handleBlockUpdate = (updatedBlock: BlockConfig) => {
    const updatedBlocks = template.blocks.map(block =>
      block.id === updatedBlock.id ? updatedBlock : block
    );
    onChange({
      ...template,
      blocks: updatedBlocks
    });
    setSelectedBlock(updatedBlock);
  };

  const handleBlockDelete = (blockId: string) => {
    const block = template.blocks.find(b => b.id === blockId);
    if (block?.required) {
      alert('No puedes eliminar un bloque obligatorio. Puedes ocultarlo en su lugar.');
      return;
    }

    const updatedBlocks = template.blocks
      .filter(b => b.id !== blockId)
      .map((block, index) => ({
        ...block,
        order: index
      }));
    
    onChange({
      ...template,
      blocks: updatedBlocks
    });
    
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  };

  const handleAddBlock = (type: BlockType) => {
    const newBlock: BlockConfig = {
      id: `block-${Date.now()}`,
      type,
      label: getBlockLabel(type),
      order: template.blocks.length,
      visible: true,
      required: false,
      alignment: 'left',
      fontSize: 'sm',
      fontWeight: 'normal',
      paddingTop: 1,
      paddingBottom: 1,
      content: getDefaultContent(type)
    };

    onChange({
      ...template,
      blocks: [...template.blocks, newBlock]
    });
  };

  return (
    <div className="space-y-4">
      {/* Lista de bloques con drag & drop */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Bloques ({template.blocks.length})
          </h3>
          <AddBlockMenu onAdd={handleAddBlock} />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={template.blocks.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {template.blocks.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No hay bloques. Agrega uno para comenzar.
                </div>
              ) : (
                template.blocks
                  .sort((a, b) => a.order - b.order)
                  .map((block) => (
                    <SortableBlockItem
                      key={block.id}
                      block={block}
                      isSelected={selectedBlock?.id === block.id}
                      onClick={() => setSelectedBlock(block)}
                      onDelete={() => handleBlockDelete(block.id)}
                    />
                  ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Panel de configuración del bloque seleccionado */}
      {selectedBlock && (
        <BlockConfigPanel
          block={selectedBlock}
          onChange={handleBlockUpdate}
        />
      )}
    </div>
  );
}

// ============================================================
// Add Block Menu
// ============================================================

interface AddBlockMenuProps {
  onAdd: (type: BlockType) => void;
}

function AddBlockMenu({ onAdd }: AddBlockMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const blockTypes: { type: BlockType; label: string; icon: string }[] = [
    { type: 'header', label: 'Encabezado', icon: '📋' },
    { type: 'business_info', label: 'Info Negocio', icon: '🏢' },
    { type: 'customer_info', label: 'Info Cliente', icon: '👤' },
    { type: 'items', label: 'Items', icon: '📦' },
    { type: 'subtotals', label: 'Subtotales', icon: '🧮' },
    { type: 'totals', label: 'Totales', icon: '💰' },
    { type: 'payment_info', label: 'Info Pago', icon: '💳' },
    { type: 'footer', label: 'Pie de Página', icon: '📄' },
    { type: 'custom_text', label: 'Texto Personalizado', icon: '📝' },
    { type: 'separator', label: 'Separador', icon: '➖' },
    { type: 'qr_code', label: 'Código QR', icon: '📱' },
    { type: 'barcode', label: 'Código de Barras', icon: '📊' },
    { type: 'image', label: 'Imagen', icon: '🖼️' },
  ];

  return (
    <div className="relative">
      <Button
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-600 to-purple-600"
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar Bloque
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 max-h-96 overflow-y-auto">
            <div className="p-2">
              {blockTypes.map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => {
                    onAdd(type);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <span className="text-2xl mr-3">{icon}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// Helpers
// ============================================================

function getBlockLabel(type: BlockType): string {
  const labels: Record<BlockType, string> = {
    header: 'Encabezado',
    business_info: 'Información del Negocio',
    customer_info: 'Información del Cliente',
    items: 'Productos/Servicios',
    subtotals: 'Subtotales',
    totals: 'Totales',
    payment_info: 'Información de Pago',
    footer: 'Pie de Página',
    custom_text: 'Texto Personalizado',
    separator: 'Separador',
    qr_code: 'Código QR',
    barcode: 'Código de Barras',
    image: 'Imagen',
  };
  return labels[type];
}

function getDefaultContent(type: BlockType): BlockConfig['content'] {
  switch (type) {
    case 'header':
      return { showLogo: true, showBusinessName: true };
    case 'items':
      return {
        showImages: false,
        showPrices: true,
        showQuantity: true,
        showSubtotal: true,
      };
    case 'totals':
      return {
        showSubtotal: true,
        showTax: true,
        showDiscount: true,
        showTotal: true,
      };
    case 'custom_text':
      return { text: 'Escribe tu texto aquí' };
    case 'qr_code':
      return { data: 'https://example.com', size: 100 };
    case 'barcode':
      return { data: '123456789', size: 50 };
    case 'image':
      return { imageUrl: '', height: 50 };
    default:
      return {};
  }
}
