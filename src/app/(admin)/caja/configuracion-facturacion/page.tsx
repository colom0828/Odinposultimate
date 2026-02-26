/**
 * ═══════════════════════════════════════════════════════════════
 * CONFIGURACIÓN DE FACTURACIÓN ELECTRÓNICA POR CAJA
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Zap, Printer, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card } from '../../../components/ui/card';
import { Switch } from '../../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ElectronicBillingService } from '../../../services/electronic-billing.service';
import { PrintService } from '../../../services/printing.service';
import type { ElectronicBillingConfig, ElectronicBillingFormData } from '../../../types/electronic-billing.types';

export default function ConfiguracionFacturacionPage() {
  // Navigation helper (usando el sistema nativo del proyecto)
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  
  // Estados
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [cashRegisters] = useState([
    { id: 'caja-1', name: 'Caja 1 - Principal' },
    { id: 'caja-2', name: 'Caja 2 - Secundaria' },
    { id: 'caja-3', name: 'Caja 3 - Express' },
  ]);
  const [printers] = useState([
    { id: 'printer-1', name: 'Epson TM-T88V (Caja 1)', status: 'online' },
    { id: 'printer-2', name: 'HP LaserJet Pro', status: 'online' },
    { id: 'printer-3', name: 'Epson TM-T20III', status: 'offline' },
  ]);

  const [formData, setFormData] = useState<ElectronicBillingFormData>({
    provider: 'digifact',
    environment: 'sandbox',
    facturaConsumo: 'B02',
    notaCredito: 'B04',
    comprobanteCredito: 'B01',
    comprobanteGubernamental: 'B15',
    branchCode: '001',
    rnc: '',
    dv: '',
    taxpayerType: 'persona-juridica',
    legalName: '',
    locationCode: '001',
    username: '',
    password: '',
    regimenEspecial: '',
    production: false,
    simplifiedTicket: false,
    printTaxReceipt: true,
    autoIssue: true,
    autoPrint: true,
    cashRegisterId: '',
    printerId: '',
  });

  const [existingConfig, setExistingConfig] = useState<ElectronicBillingConfig | null>(null);

  // Cargar configuración existente si hay
  useEffect(() => {
    if (formData.cashRegisterId) {
      const config = ElectronicBillingService.getConfigByCashRegisterId(formData.cashRegisterId);
      if (config) {
        setExistingConfig(config);
        // Populate form
        setFormData({
          provider: config.provider,
          environment: config.environment,
          facturaConsumo: 'B02',
          notaCredito: 'B04',
          comprobanteCredito: 'B01',
          comprobanteGubernamental: 'B15',
          branchCode: config.branchCode,
          rnc: config.rnc,
          dv: config.dv || '',
          taxpayerType: config.taxpayerType,
          legalName: config.legalName,
          locationCode: config.locationCode,
          username: config.username,
          password: '', // Don't show password
          regimenEspecial: config.settings.regimenEspecial || '',
          production: config.settings.production,
          simplifiedTicket: config.settings.simplifiedTicket,
          printTaxReceipt: config.settings.printTaxReceipt,
          autoIssue: config.settings.autoIssue,
          autoPrint: config.settings.autoPrint,
          cashRegisterId: config.cashRegisterId,
          printerId: config.printerId,
        });
      } else {
        setExistingConfig(null);
      }
    }
  }, [formData.cashRegisterId]);

  const handleSubmit = async () => {
    // Validations
    if (!formData.cashRegisterId) {
      toast.error('Selecciona una caja registradora');
      return;
    }

    if (!formData.printerId) {
      toast.error('Selecciona una impresora');
      return;
    }

    if (!formData.rnc) {
      toast.error('Ingresa el RNC');
      return;
    }

    if (!formData.legalName) {
      toast.error('Ingresa el nombre legal del negocio');
      return;
    }

    if (!formData.username || !formData.password) {
      if (!existingConfig) {
        toast.error('Ingresa username y password');
        return;
      }
    }

    setLoading(true);

    try {
      const cashRegister = cashRegisters.find(c => c.id === formData.cashRegisterId);
      const printer = printers.find(p => p.id === formData.printerId);

      const config: ElectronicBillingConfig = {
        id: existingConfig?.id || `config-${Date.now()}`,
        cashRegisterId: formData.cashRegisterId,
        cashRegisterName: cashRegister?.name || '',
        printerId: formData.printerId,
        printerName: printer?.name || '',
        provider: formData.provider,
        environment: formData.environment,
        rnc: formData.rnc,
        dv: formData.dv,
        taxpayerType: formData.taxpayerType,
        legalName: formData.legalName,
        branchCode: formData.branchCode,
        locationCode: formData.locationCode,
        username: formData.username,
        passwordEncrypted: formData.password || existingConfig?.passwordEncrypted || '',
        settings: {
          production: formData.production,
          simplifiedTicket: formData.simplifiedTicket,
          printTaxReceipt: formData.printTaxReceipt,
          autoIssue: formData.autoIssue,
          autoPrint: formData.autoPrint,
          templateType: 'ticket-80mm',
          regimenEspecial: formData.regimenEspecial,
        },
        isActive: true,
        createdAt: existingConfig?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      ElectronicBillingService.saveConfig(config);

      // Initialize sequences if new config
      if (!existingConfig) {
        ElectronicBillingService.initializeDefaultSequences(config.id);
      }

      toast.success('Configuración guardada exitosamente');
      
      // Redirect to caja page
      setTimeout(() => {
        navigate('/admin/caja');
      }, 1500);
    } catch (error: any) {
      toast.error('Error al guardar configuración', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!formData.rnc || !formData.username || !formData.password) {
      toast.error('Completa RNC, username y password para probar conexión');
      return;
    }

    setTesting(true);

    try {
      const cashRegister = cashRegisters.find(c => c.id === formData.cashRegisterId);
      const printer = printers.find(p => p.id === formData.printerId);

      const tempConfig: ElectronicBillingConfig = {
        id: 'temp',
        cashRegisterId: formData.cashRegisterId,
        cashRegisterName: cashRegister?.name || '',
        printerId: formData.printerId,
        printerName: printer?.name || '',
        provider: formData.provider,
        environment: formData.environment,
        rnc: formData.rnc,
        dv: formData.dv,
        taxpayerType: formData.taxpayerType,
        legalName: formData.legalName,
        branchCode: formData.branchCode,
        locationCode: formData.locationCode,
        username: formData.username,
        passwordEncrypted: formData.password,
        settings: {
          production: formData.production,
          simplifiedTicket: formData.simplifiedTicket,
          printTaxReceipt: formData.printTaxReceipt,
          autoIssue: formData.autoIssue,
          autoPrint: formData.autoPrint,
          templateType: 'ticket-80mm',
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await ElectronicBillingService.testConnection(tempConfig);

      if (result.success) {
        toast.success('✅ Conexión exitosa', {
          description: `Provider: ${result.provider || 'Digifact'} | Ambiente: ${formData.production ? 'Producción' : 'Pruebas'}`,
          duration: 4000,
        });
      } else {
        toast.error('❌ Error de conexión', {
          description: result.error || result.message,
        });
      }
    } catch (error: any) {
      toast.error('❌ Error al probar conexión', {
        description: error.message,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleTestPrint = async () => {
    if (!formData.printerId) {
      toast.error('Selecciona una impresora primero');
      return;
    }

    setPrinting(true);

    try {
      const printer = printers.find(p => p.id === formData.printerId);

      if (!printer) {
        toast.error('Impresora no encontrada');
        return;
      }

      toast.info('🖨️ Enviando página de prueba...', {
        description: `Impresora: ${printer.name}`,
      });

      const result = await PrintService.printTestPage(printer.id, printer.name);

      if (result.success) {
        toast.success('✅ Impresión enviada correctamente', {
          description: `Job ID: ${result.jobId} | Revisa la impresora: ${printer.name}`,
          duration: 5000,
        });
      } else {
        toast.error('❌ Error de impresión', {
          description: result.error || result.message,
        });
      }
    } catch (error: any) {
      toast.error('❌ Error al imprimir prueba', {
        description: error.message,
      });
    } finally {
      setPrinting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/caja')}
            className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[var(--odin-text-primary)]">
              Configuración de Facturación Electrónica
            </h1>
            <p className="text-[var(--odin-text-secondary)] mt-1">
              Configurar e-CF (DGII) por Caja Registradora
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
      <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-6">
        <div className="space-y-6">
          {/* Asociaciones */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-[var(--odin-text-primary)] mb-4">
              1. Asociar Caja e Impresora
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Caja Registradora *</Label>
                <Select
                  value={formData.cashRegisterId}
                  onValueChange={(value) => setFormData({ ...formData, cashRegisterId: value })}
                >
                  <SelectTrigger className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)]">
                    <SelectValue placeholder="Seleccionar caja" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)]">
                    {cashRegisters.map((cr) => (
                      <SelectItem key={cr.id} value={cr.id}>
                        {cr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Impresora Asignada *</Label>
                <Select
                  value={formData.printerId}
                  onValueChange={(value) => setFormData({ ...formData, printerId: value })}
                >
                  <SelectTrigger className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)]">
                    <SelectValue placeholder="Seleccionar impresora" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)]">
                    {printers.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="border-t border-[var(--odin-border-accent)] pt-6"
          >
            <h2 className="text-xl font-semibold text-[var(--odin-text-primary)] mb-4">
              2. Configuración del Proveedor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Facturación Electrónica</Label>
                <Input
                  value={formData.provider === 'digifact' ? 'Digifact (dominicana)' : ''}
                  disabled
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)]"
                />
              </div>

              <div className="space-y-2">
                <Label>Ambiente</Label>
                <Select
                  value={formData.environment}
                  onValueChange={(value: any) => setFormData({ ...formData, environment: value })}
                >
                  <SelectTrigger className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)]">
                    <SelectItem value="sandbox">Sandbox (Pruebas)</SelectItem>
                    <SelectItem value="production">Production (Producción)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="border-t border-[var(--odin-border-accent)] pt-6"
          >
            <h2 className="text-xl font-semibold text-[var(--odin-text-primary)] mb-4">
              3. Información del Contribuyente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>RNC *</Label>
                <Input
                  value={formData.rnc}
                  onChange={(e) => setFormData({ ...formData, rnc: e.target.value })}
                  placeholder="130-12345-6"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)]"
                />
              </div>

              <div className="space-y-2">
                <Label>DV (Dígito Verificador)</Label>
                <Input
                  value={formData.dv}
                  onChange={(e) => setFormData({ ...formData, dv: e.target.value })}
                  placeholder="6"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)]"
                />
              </div>

              <div className="space-y-2">
                <Label>Taxpayer Type *</Label>
                <Select
                  value={formData.taxpayerType}
                  onValueChange={(value: any) => setFormData({ ...formData, taxpayerType: value })}
                >
                  <SelectTrigger className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)]">
                    <SelectItem value="persona-fisica">Persona Física</SelectItem>
                    <SelectItem value="persona-juridica">Persona Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-4">
                <Label>Nombre Legal del Negocio *</Label>
                <Input
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                  placeholder="Mi Empresa SRL"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)]"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="border-t border-[var(--odin-border-accent)] pt-6"
          >
            <h2 className="text-xl font-semibold text-[var(--odin-text-primary)] mb-4">
              4. Códigos de Sucursal/Ubicación
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Branch Code</Label>
                <Input
                  value={formData.branchCode}
                  onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
                  placeholder="001"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)]"
                />
              </div>

              <div className="space-y-2">
                <Label>Location Code</Label>
                <Input
                  value={formData.locationCode}
                  onChange={(e) => setFormData({ ...formData, locationCode: e.target.value })}
                  placeholder="001"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)]"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="border-t border-[var(--odin-border-accent)] pt-6"
          >
            <h2 className="text-xl font-semibold text-[var(--odin-text-primary)] mb-4">
              5. Credenciales de Acceso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username *</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="usuario"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)]"
                />
              </div>

              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={existingConfig ? '••••••••' : 'contraseña'}
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)]"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="border-t border-[var(--odin-border-accent)] pt-6"
          >
            <h2 className="text-xl font-semibold text-[var(--odin-text-primary)] mb-4">
              6. Configuraciones de Emisión e Impresión
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <Label className="cursor-pointer">Production (Producción)</Label>
                <Switch
                  checked={formData.production}
                  onCheckedChange={(checked) => setFormData({ ...formData, production: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <Label className="cursor-pointer">Simplified Ticket</Label>
                <Switch
                  checked={formData.simplifiedTicket}
                  onCheckedChange={(checked) => setFormData({ ...formData, simplifiedTicket: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <Label className="cursor-pointer">Print Tax Receipt</Label>
                <Switch
                  checked={formData.printTaxReceipt}
                  onCheckedChange={(checked) => setFormData({ ...formData, printTaxReceipt: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <Label className="cursor-pointer">Emitir Automáticamente</Label>
                <Switch
                  checked={formData.autoIssue}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoIssue: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <Label className="cursor-pointer">Imprimir Automáticamente</Label>
                <Switch
                  checked={formData.autoPrint}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoPrint: checked })}
                />
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="border-t border-[var(--odin-border-accent)] pt-6 flex flex-wrap gap-4"
          >
            <Button
              onClick={handleTestConnection}
              disabled={testing || !formData.rnc || !formData.username || !formData.password}
              variant="outline"
              className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Probando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Probar Conexión
                </>
              )}
            </Button>

            <Button
              onClick={handleTestPrint}
              disabled={printing || !formData.printerId}
              variant="outline"
              className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)]"
            >
              {printing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Imprimiendo...
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 mr-2" />
                  Probar Impresión
                </>
              )}
            </Button>

            <div className="flex-1"></div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Configuración
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </Card>
      </motion.div>
    </motion.div>
  );
}