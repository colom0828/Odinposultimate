/**
 * ═══════════════════════════════════════════════════════════════
 * BLOCK CONFIG PANEL - Panel de configuración de bloques
 * ═══════════════════════════════════════════════════════════════
 */

import { Settings } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { BlockConfig, AlignmentType, FontSizeType, FontWeightType } from '../../types/print-templates.types';
import { Textarea } from '../ui/textarea';

interface BlockConfigPanelProps {
  block: BlockConfig;
  onChange: (block: BlockConfig) => void;
}

export function BlockConfigPanel({ block, onChange }: BlockConfigPanelProps) {
  const updateBlock = (updates: Partial<BlockConfig>) => {
    onChange({ ...block, ...updates });
  };

  const updateContent = (updates: Partial<BlockConfig['content']>) => {
    onChange({
      ...block,
      content: { ...block.content, ...updates }
    });
  };

  const updateBlockContent = (key: keyof BlockConfig['content'], value: any) => {
    updateContent({ [key]: value });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Configuración: {block.label}
        </h3>
      </div>

      <div className="space-y-6">
        {/* Configuración General */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            General
          </h4>

          {/* Label */}
          <div>
            <Label htmlFor="label">Etiqueta</Label>
            <Input
              id="label"
              value={block.label}
              onChange={(e) => updateBlock({ label: e.target.value })}
              placeholder="Nombre del bloque"
            />
          </div>

          {/* Visible */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="visible">Visible</Label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Mostrar u ocultar este bloque
              </p>
            </div>
            <Switch
              id="visible"
              checked={block.visible}
              onCheckedChange={(checked) => updateBlock({ visible: checked })}
            />
          </div>
        </div>

        {/* Estilos */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Estilos
          </h4>

          {/* Alignment */}
          <div>
            <Label htmlFor="alignment">Alineación</Label>
            <Select
              value={block.alignment}
              onValueChange={(value) => updateBlock({ alignment: value as AlignmentType })}
            >
              <SelectTrigger id="alignment">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">⬅️ Izquierda</SelectItem>
                <SelectItem value="center">➡️ Centro</SelectItem>
                <SelectItem value="right">➡️ Derecha</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div>
            <Label htmlFor="fontSize">Tamaño de Fuente</Label>
            <Select
              value={block.fontSize}
              onValueChange={(value) => updateBlock({ fontSize: value as FontSizeType })}
            >
              <SelectTrigger id="fontSize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">XS - Extra pequeño</SelectItem>
                <SelectItem value="sm">SM - Pequeño</SelectItem>
                <SelectItem value="md">MD - Medio</SelectItem>
                <SelectItem value="lg">LG - Grande</SelectItem>
                <SelectItem value="xl">XL - Extra grande</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Font Weight */}
          <div>
            <Label htmlFor="fontWeight">Peso de Fuente</Label>
            <Select
              value={block.fontWeight}
              onValueChange={(value) => updateBlock({ fontWeight: value as FontWeightType })}
            >
              <SelectTrigger id="fontWeight">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Negrita</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Padding Top */}
          <div>
            <Label htmlFor="paddingTop">Espaciado Superior: {block.paddingTop}mm</Label>
            <Slider
              id="paddingTop"
              min={0}
              max={10}
              step={1}
              value={[block.paddingTop]}
              onValueChange={([value]) => updateBlock({ paddingTop: value })}
              className="mt-2"
            />
          </div>

          {/* Padding Bottom */}
          <div>
            <Label htmlFor="paddingBottom">Espaciado Inferior: {block.paddingBottom}mm</Label>
            <Slider
              id="paddingBottom"
              min={0}
              max={10}
              step={1}
              value={[block.paddingBottom]}
              onValueChange={([value]) => updateBlock({ paddingBottom: value })}
              className="mt-2"
            />
          </div>
        </div>

        {/* Configuración Específica del Bloque */}
        {renderBlockSpecificConfig()}
      </div>
    </div>
  );

  // ============================================================
  // Configuración específica por tipo de bloque
  // ============================================================

  function renderBlockSpecificConfig() {
    switch (block.type) {
      case 'header':
        return (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Opciones de Encabezado
            </h4>
            <div className="flex items-center justify-between">
              <Label>Mostrar Logo</Label>
              <Switch
                checked={block.content?.showLogo ?? true}
                onCheckedChange={(checked) => updateContent({ showLogo: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Mostrar Nombre del Negocio</Label>
              <Switch
                checked={block.content?.showBusinessName ?? true}
                onCheckedChange={(checked) => updateContent({ showBusinessName: checked })}
              />
            </div>
          </div>
        );

      case 'business_info':
        return (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Información del Negocio
            </h4>
            <div>
              <Label htmlFor="businessName">Nombre del Negocio</Label>
              <Input
                id="businessName"
                value={block.content?.businessName ?? 'Demo República Dominicana'}
                onChange={(e) => updateContent({ businessName: e.target.value })}
                placeholder="Nombre del negocio"
              />
            </div>
            <div>
              <Label htmlFor="businessAddress">Dirección</Label>
              <Textarea
                id="businessAddress"
                value={block.content?.businessAddress ?? 'Av. Winston Churchill 123, Piantini, Santo Domingo'}
                onChange={(e) => updateContent({ businessAddress: e.target.value })}
                placeholder="Dirección completa"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="businessPhone">Teléfono</Label>
              <Input
                id="businessPhone"
                value={block.content?.businessPhone ?? '+1 809-555-1234'}
                onChange={(e) => updateContent({ businessPhone: e.target.value })}
                placeholder="+1 809-555-1234"
              />
            </div>
            <div>
              <Label htmlFor="businessEmail">Email</Label>
              <Input
                id="businessEmail"
                type="email"
                value={block.content?.businessEmail ?? 'contacto@odinpos.com'}
                onChange={(e) => updateContent({ businessEmail: e.target.value })}
                placeholder="contacto@ejemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="businessRNC">RNC (Registro Nacional del Contribuyente)</Label>
              <Input
                id="businessRNC"
                value={block.content?.businessRNC ?? '130-12345-6'}
                onChange={(e) => updateContent({ businessRNC: e.target.value })}
                placeholder="130-12345-6"
              />
            </div>
            <div>
              <Label htmlFor="businessNCF">NCF (Número de Comprobante Fiscal)</Label>
              <Input
                id="businessNCF"
                value={block.content?.businessNCF ?? 'B0200000188'}
                onChange={(e) => updateContent({ businessNCF: e.target.value })}
                placeholder="B0200000188"
              />
            </div>
          </div>
        );

      case 'items':
        return (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Opciones de Items
            </h4>
            <div className="flex items-center justify-between">
              <Label>Mostrar Imágenes</Label>
              <Switch
                checked={block.content?.showImages ?? false}
                onCheckedChange={(checked) => updateContent({ showImages: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Mostrar Precios Unitarios</Label>
              <Switch
                checked={block.content?.showPrices ?? true}
                onCheckedChange={(checked) => updateContent({ showPrices: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Mostrar Cantidad</Label>
              <Switch
                checked={block.content?.showQuantity ?? true}
                onCheckedChange={(checked) => updateContent({ showQuantity: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Mostrar Subtotal</Label>
              <Switch
                checked={block.content?.showSubtotal ?? true}
                onCheckedChange={(checked) => updateContent({ showSubtotal: checked })}
              />
            </div>
          </div>
        );

      case 'totals':
        return (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Opciones de Totales
            </h4>
            <div className="flex items-center justify-between">
              <Label>Mostrar Subtotal</Label>
              <Switch
                checked={block.content?.showSubtotal ?? true}
                onCheckedChange={(checked) => updateContent({ showSubtotal: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label>Mostrar ITBIS/Impuestos</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Muestra el desglose del ITBIS (18%) en la factura
                </p>
              </div>
              <Switch
                checked={block.content?.showTax ?? true}
                onCheckedChange={(checked) =>
                  updateBlockContent('showTax', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label>Mostrar 10% de Ley</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Muestra el 10% de Ley (propina obligatoria en RD)
                </p>
              </div>
              <Switch
                checked={block.content?.showTip ?? true}
                onCheckedChange={(checked) =>
                  updateBlockContent('showTip', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Mostrar Descuento</Label>
              <Switch
                checked={block.content?.showDiscount ?? true}
                onCheckedChange={(checked) => updateContent({ showDiscount: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Mostrar Total</Label>
              <Switch
                checked={block.content?.showTotal ?? true}
                onCheckedChange={(checked) => updateContent({ showTotal: checked })}
              />
            </div>
          </div>
        );

      case 'custom_text':
        return (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Texto Personalizado
            </h4>
            <div>
              <Label htmlFor="customText">Contenido</Label>
              <Textarea
                id="customText"
                value={block.content?.text || ''}
                onChange={(e) => updateContent({ text: e.target.value })}
                placeholder="Escribe tu texto aquí..."
                rows={4}
              />
            </div>
          </div>
        );

      case 'qr_code':
        return (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Código QR
            </h4>
            <div>
              <Label htmlFor="qrData">Datos (URL o Texto)</Label>
              <Input
                id="qrData"
                value={block.content?.data || ''}
                onChange={(e) => updateContent({ data: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="qrSize">Tamaño: {block.content?.size || 100}px</Label>
              <Slider
                id="qrSize"
                min={50}
                max={200}
                step={10}
                value={[block.content?.size || 100]}
                onValueChange={([value]) => updateContent({ size: value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 'barcode':
        return (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Código de Barras
            </h4>
            <div>
              <Label htmlFor="barcodeData">Datos</Label>
              <Input
                id="barcodeData"
                value={block.content?.data || ''}
                onChange={(e) => updateContent({ data: e.target.value })}
                placeholder="123456789"
              />
            </div>
            <div>
              <Label htmlFor="barcodeSize">Altura: {block.content?.size || 50}px</Label>
              <Slider
                id="barcodeSize"
                min={30}
                max={100}
                step={5}
                value={[block.content?.size || 50]}
                onValueChange={([value]) => updateContent({ size: value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Imagen
            </h4>
            <div>
              <Label htmlFor="imageUrl">URL de la Imagen</Label>
              <Input
                id="imageUrl"
                value={block.content?.imageUrl || ''}
                onChange={(e) => updateContent({ imageUrl: e.target.value })}
                placeholder="https://example.com/image.png"
              />
            </div>
            <div>
              <Label htmlFor="imageHeight">Altura: {block.content?.height || 50}px</Label>
              <Slider
                id="imageHeight"
                min={20}
                max={200}
                step={10}
                value={[block.content?.height || 50]}
                onValueChange={([value]) => updateContent({ height: value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  }
}