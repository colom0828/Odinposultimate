/**
 * ═══════════════════════════════════════════════════════════════
 * PRINT TEMPLATE EDITOR - PÁGINA PRINCIPAL
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from 'react';
import { Plus, Save, Eye, Copy, Trash2, Download, AlertCircle } from 'lucide-react';
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
import { TemplateEditor } from '../../components/print-templates/TemplateEditor';
import { TemplatePreview } from '../../components/print-templates/TemplatePreview';
import { PrintTemplate, PrintData } from '../../types/print-templates.types';
import {
  getAllTemplates,
  getTemplateById,
  saveTemplate,
  createTemplate,
  deleteTemplate,
  duplicateTemplate,
  validateTemplate,
} from '../../services/print-templates.service';
import { getMockPrintData } from '../../utils/print-mock-data';

export default function PrintTemplatesPage() {
  const [templates, setTemplates] = useState<PrintTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PrintTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<PrintData>(getMockPrintData());
  const [loadError, setLoadError] = useState<string | null>(null);

  // Cargar plantillas al montar
  useEffect(() => {
    loadTemplates();
  }, []);

  const handleResetToDefault = async () => {
    if (!confirm('¿Estás seguro de que quieres resetear todas las plantillas? Esto eliminará todas las plantillas personalizadas y creará una nueva plantilla por defecto.')) {
      return;
    }
    
    try {
      // Limpiar localStorage
      localStorage.removeItem('odin-print-templates');
      
      toast.success('Plantillas reseteadas correctamente');
      
      // Recargar plantillas
      await loadTemplates();
    } catch (error) {
      console.error('Error resetting templates:', error);
      toast.error('Error al resetear las plantillas');
    }
  };

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      console.log('🔄 Cargando plantillas...');
      const data = await getAllTemplates();
      console.log('✅ Plantillas cargadas:', data);
      setTemplates(data);
      
      // Seleccionar la primera plantilla por defecto
      if (data.length > 0 && !selectedTemplate) {
        setSelectedTemplate(data[0]);
      }
    } catch (error) {
      console.error('❌ Error loading templates:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setLoadError(errorMessage);
      toast.error('Error al cargar las plantillas: ' + errorMessage);
    } finally {
      setIsLoading(false);
      console.log('🏁 Carga finalizada');
    }
  };

  const handleSelectTemplate = async (id: string) => {
    try {
      const template = await getTemplateById(id);
      setSelectedTemplate(template);
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Error al cargar la plantilla');
    }
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      setIsSaving(true);
      
      // Validar antes de guardar
      const validation = validateTemplate(selectedTemplate);
      if (!validation.isValid) {
        toast.error(`Validación fallida: ${validation.errors[0].message}`);
        return;
      }

      // Mostrar warnings si existen
      if (validation.warnings.length > 0) {
        validation.warnings.forEach(warning => toast.warning(warning));
      }

      await saveTemplate(selectedTemplate);
      await loadTemplates();
      toast.success('Plantilla guardada exitosamente');
    } catch (error: any) {
      console.error('Error saving template:', error);
      toast.error(error.message || 'Error al guardar la plantilla');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicateTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      const newName = `${selectedTemplate.name} (Copia)`;
      const duplicated = await duplicateTemplate(selectedTemplate.id, newName);
      await loadTemplates();
      setSelectedTemplate(duplicated);
      toast.success('Plantilla duplicada exitosamente');
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Error al duplicar la plantilla');
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;
    
    if (!confirm('¿Estás seguro de eliminar esta plantilla? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await deleteTemplate(selectedTemplate.id);
      await loadTemplates();
      setSelectedTemplate(null);
      toast.success('Plantilla eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Error al eliminar la plantilla');
    }
  };

  const handleCreateNew = async () => {
    try {
      const newTemplate = await createTemplate({
        name: 'Nueva Plantilla',
        description: '',
        type: 'ticket',
        paperWidth: 80,
        paperType: 'thermal',
        blocks: []
      });
      await loadTemplates();
      setSelectedTemplate(newTemplate);
      toast.success('Plantilla creada exitosamente');
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Error al crear la plantilla');
    }
  };

  const handleUpdateTemplate = (updated: PrintTemplate) => {
    setSelectedTemplate(updated);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando plantillas...</p>
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
            Editor de Plantillas de Impresión
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Personaliza facturas, tickets y comandas sin tocar código
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleResetToDefault} 
            variant="outline"
            className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Resetear Plantillas
          </Button>
          <Button onClick={handleCreateNew} className="bg-gradient-to-r from-purple-600 to-pink-600">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Plantilla
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Selector de plantilla */}
          <div className="md:col-span-2">
            <Label>Plantilla Activa</Label>
            <Select
              value={selectedTemplate?.id}
              onValueChange={handleSelectTemplate}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una plantilla" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} {template.isDefault && '(Por defecto)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Acciones */}
          <div className="md:col-span-2 flex items-end gap-2">
            <Button
              onClick={handleSaveTemplate}
              disabled={!selectedTemplate || isSaving}
              variant="default"
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button
              onClick={handleDuplicateTemplate}
              disabled={!selectedTemplate}
              variant="outline"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDeleteTemplate}
              disabled={!selectedTemplate || selectedTemplate.isDefault}
              variant="outline"
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Info de plantilla seleccionada */}
        {selectedTemplate && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={selectedTemplate.name}
                  onChange={(e) => handleUpdateTemplate({
                    ...selectedTemplate,
                    name: e.target.value
                  })}
                  placeholder="Nombre de la plantilla"
                />
              </div>
              <div>
                <Label>Tipo</Label>
                <Select
                  value={selectedTemplate.type}
                  onValueChange={(value) => handleUpdateTemplate({
                    ...selectedTemplate,
                    type: value as any
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ticket">Ticket</SelectItem>
                    <SelectItem value="invoice">Factura</SelectItem>
                    <SelectItem value="kitchen_order">Comanda Cocina</SelectItem>
                    <SelectItem value="bar_order">Comanda Bar</SelectItem>
                    <SelectItem value="delivery_receipt">Comprobante Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ancho de Papel (mm)</Label>
                <Select
                  value={selectedTemplate.paperWidth.toString()}
                  onValueChange={(value) => handleUpdateTemplate({
                    ...selectedTemplate,
                    paperWidth: parseInt(value)
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="58">58mm (Térmico pequeño)</SelectItem>
                    <SelectItem value="80">80mm (Térmico estándar)</SelectItem>
                    <SelectItem value="110">110mm (Térmico grande)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Warning para bloques requeridos */}
      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-500/30 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-orange-900 dark:text-orange-100">
              Bloques Obligatorios
            </h3>
            <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
              Los bloques <strong>Items</strong> y <strong>Totales</strong> son obligatorios y no se pueden eliminar.
              Puedes ocultarlos o cambiar su orden, pero deben existir en la plantilla.
            </p>
          </div>
        </div>
      </div>

      {/* Editor y Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Configuración de Bloques
          </h2>
          {selectedTemplate ? (
            <TemplateEditor
              template={selectedTemplate}
              onChange={handleUpdateTemplate}
            />
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Selecciona o crea una plantilla para comenzar
              </p>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Vista Previa
          </h2>
          {selectedTemplate ? (
            <TemplatePreview
              template={selectedTemplate}
              data={previewData}
            />
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                La vista previa aparecerá aquí
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}