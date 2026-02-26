import { useState } from 'react';
import { Plus, Printer, CheckCircle, XCircle, AlertCircle, Trash2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const mockPrinters = [
  { id: 1, name: 'Impresora Tickets Principal', model: 'Epson TM-T88V', ip: '192.168.1.100', status: 'online', location: 'Caja 1' },
  { id: 2, name: 'Impresora Facturas', model: 'HP LaserJet Pro', ip: '192.168.1.101', status: 'online', location: 'Administración' },
  { id: 3, name: 'Impresora Tickets Secundaria', model: 'Epson TM-T20III', ip: '192.168.1.102', status: 'offline', location: 'Caja 2' },
  { id: 4, name: 'Impresora Etiquetas', model: 'Zebra ZD420', ip: '192.168.1.103', status: 'warning', location: 'Inventario' },
];

export default function ImpresorasPage() {
  const [printers, setPrinters] = useState(mockPrinters);
  const [showModal, setShowModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState<any>(null);
  const [customGroups, setCustomGroups] = useState<string[]>(['Caja', 'Cocina', 'Bar', 'Administración']);
  const [formData, setFormData] = useState({
    descripcion: '',
    ipe: '',
    ipSecundario: '',
    status: 'Activo',
    tipoImpresora: 'Comando',
    tamanoLetra: 'Normal',
    cortarPapel: 'Si',
    grupoImpresoras: '',
    imprimirDescripcion: false,
    imprimirComandos: false,
    imprimirCopia: false,
    ods: false,
    excluirTipos: ''
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return null;
    }
  };

  const handleDeletePrinter = (id: number) => {
    setPrinters(printers.filter(p => p.id !== id));
  };

  const handleDeleteAll = () => {
    if (window.confirm('⚠️ ADVERTENCIA: ¿Estás seguro de eliminar TODAS las impresoras? Esta acción no se puede deshacer.')) {
      if (window.confirm('¿Realmente deseas continuar? Se eliminarán ' + printers.length + ' impresoras.')) {
        setPrinters([]);
      }
    }
  };

  const handleAddPrinter = () => {
    const newPrinter = {
      id: printers.length + 1,
      name: formData.descripcion,
      model: formData.tipoImpresora,
      ip: formData.ipe,
      status: formData.status.toLowerCase(),
      location: formData.grupoImpresoras
    };
    setPrinters([...printers, newPrinter]);
    
    // Add to custom groups if it's a new group
    if (formData.grupoImpresoras && !customGroups.includes(formData.grupoImpresoras)) {
      setCustomGroups([...customGroups, formData.grupoImpresoras]);
    }
    
    setShowModal(false);
    setFormData({
      descripcion: '',
      ipe: '',
      ipSecundario: '',
      status: 'Activo',
      tipoImpresora: 'Comando',
      tamanoLetra: 'Normal',
      cortarPapel: 'Si',
      grupoImpresoras: '',
      imprimirDescripcion: false,
      imprimirComandos: false,
      imprimirCopia: false,
      ods: false,
      excluirTipos: ''
    });
    toast.success('Impresora agregada exitosamente');
  };

  const handleEditPrinter = () => {
    const updatedPrinters = printers.map(p => {
      if (p.id === selectedPrinter.id) {
        return {
          id: p.id,
          name: formData.descripcion,
          model: formData.tipoImpresora,
          ip: formData.ipe,
          status: formData.status.toLowerCase(),
          location: formData.grupoImpresoras
        };
      }
      return p;
    });
    setPrinters(updatedPrinters);
    
    // Add to custom groups if it's a new group
    if (formData.grupoImpresoras && !customGroups.includes(formData.grupoImpresoras)) {
      setCustomGroups([...customGroups, formData.grupoImpresoras]);
    }
    
    setShowConfigModal(false);
    setFormData({
      descripcion: '',
      ipe: '',
      ipSecundario: '',
      status: 'Activo',
      tipoImpresora: 'Comando',
      tamanoLetra: 'Normal',
      cortarPapel: 'Si',
      grupoImpresoras: '',
      imprimirDescripcion: false,
      imprimirComandos: false,
      imprimirCopia: false,
      ods: false,
      excluirTipos: ''
    });
    toast.success('Impresora configurada exitosamente');
  };

  const handleTestPrinter = (printer: any) => {
    toast.info('Generando ticket de prueba...');
    
    // Generar ticket de prueba
    const testTicket = `
      <html>
        <head>
          <style>
            @media print {
              body { 
                margin: 0; 
                padding: 20px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
              }
              .ticket {
                width: 80mm;
                margin: 0 auto;
              }
              .center { text-align: center; }
              .bold { font-weight: bold; }
              .line { 
                border-bottom: 1px dashed #000; 
                margin: 10px 0; 
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              td {
                padding: 4px 0;
              }
            }
            body { 
              margin: 0; 
              padding: 20px;
              font-family: 'Courier New', monospace;
              font-size: 12px;
              background: white;
            }
            .ticket {
              width: 80mm;
              margin: 0 auto;
              background: white;
              padding: 20px;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { 
              border-bottom: 1px dashed #000; 
              margin: 10px 0; 
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            td {
              padding: 4px 0;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="center bold" style="font-size: 18px; margin-bottom: 10px;">
              ODIN POS
            </div>
            <div class="center" style="margin-bottom: 5px;">
              Sistema de Punto de Venta
            </div>
            <div class="center" style="margin-bottom: 15px; font-size: 10px;">
              República Dominicana
            </div>
            
            <div class="line"></div>
            
            <div class="center bold" style="font-size: 14px; margin: 15px 0;">
              🖨️ TICKET DE PRUEBA
            </div>
            
            <div class="line"></div>
            
            <table>
              <tr>
                <td class="bold">Impresora:</td>
                <td style="text-align: right;">${printer.name}</td>
              </tr>
              <tr>
                <td class="bold">Modelo:</td>
                <td style="text-align: right;">${printer.model}</td>
              </tr>
              <tr>
                <td class="bold">IP:</td>
                <td style="text-align: right;">${printer.ip}</td>
              </tr>
              <tr>
                <td class="bold">Ubicación:</td>
                <td style="text-align: right;">${printer.location}</td>
              </tr>
              <tr>
                <td class="bold">Estado:</td>
                <td style="text-align: right;">${printer.status === 'online' ? 'En línea' : printer.status === 'offline' ? 'Fuera de línea' : 'Advertencia'}</td>
              </tr>
            </table>
            
            <div class="line"></div>
            
            <div class="center" style="margin: 15px 0;">
              Fecha: ${new Date().toLocaleDateString('es-DO')}<br/>
              Hora: ${new Date().toLocaleTimeString('es-DO')}
            </div>
            
            <div class="line"></div>
            
            <div class="center" style="margin-top: 20px; font-size: 10px;">
              ✓ Impresión exitosa<br/>
              La impresora está funcionando correctamente
            </div>
            
            <div class="center" style="margin-top: 30px; font-size: 10px;">
              Powered by ODIN POS
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Crear ventana de impresión
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(testTicket);
      printWindow.document.close();
      
      // Esperar a que cargue y luego imprimir
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          toast.success('Ticket de prueba enviado a la impresora');
        }, 250);
      };
    } else {
      toast.error('No se pudo abrir la ventana de impresión. Verifica los bloqueadores de ventanas emergentes.');
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-[var(--odin-text-primary)] mb-2">Impresoras</h1>
        <p className="text-[var(--odin-text-secondary)]">Gestión de impresoras conectadas al sistema</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div className="flex gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
          <Button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Impresora
          </Button>
          </motion.div>
          {printers.length > 0 && (
            <Button 
              onClick={handleDeleteAll}
              variant="outline"
              className="border-red-500/30 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:border-red-500/50 transition-all"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Eliminar Todas
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-[var(--odin-bg-card)] border-green-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">En Línea</p>
          <p className="text-2xl font-bold text-green-400">{printers.filter(p => p.status === 'online').length}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-red-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Fuera de Línea</p>
          <p className="text-2xl font-bold text-red-400">{printers.filter(p => p.status === 'offline').length}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-yellow-500/20 p-4 backdrop-blur-sm transition-colors duration-300">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Con Advertencias</p>
          <p className="text-2xl font-bold text-yellow-400">{printers.filter(p => p.status === 'warning').length}</p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {printers.map((printer) => (
          <Card key={printer.id} className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-6 backdrop-blur-sm hover:border-purple-500/40 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 flex items-center justify-center">
                  <Printer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--odin-text-primary)]">{printer.name}</h3>
                  <p className="text-sm text-[var(--odin-text-secondary)]">{printer.model}</p>
                </div>
              </div>
              {getStatusIcon(printer.status)}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[var(--odin-text-secondary)]">Dirección IP</span>
                <span className="text-sm text-[var(--odin-text-primary)] font-mono">{printer.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--odin-text-secondary)]">Ubicación</span>
                <span className="text-sm text-[var(--odin-text-primary)]">{printer.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--odin-text-secondary)]">Estado</span>
                <Badge className={
                  printer.status === 'online' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  printer.status === 'offline' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }>
                  {printer.status === 'online' ? 'En línea' : printer.status === 'offline' ? 'Fuera de línea' : 'Advertencia'}
                </Badge>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--odin-border-accent)] flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 border-[var(--odin-border-accent)] bg-[var(--odin-input-bg)] text-[var(--odin-text-primary)] hover:bg-purple-500/20 hover:border-purple-500/50" onClick={() => handleTestPrinter(printer)}>
                Probar
              </Button>
              <Button size="sm" variant="outline" className="flex-1 border-[var(--odin-border-accent)] bg-[var(--odin-input-bg)] text-[var(--odin-text-primary)] hover:bg-purple-500/20 hover:border-purple-500/50" onClick={() => {
                setSelectedPrinter(printer);
                setFormData({
                  descripcion: printer.name,
                  ipe: printer.ip,
                  ipSecundario: '',
                  status: printer.status === 'online' ? 'Activo' : 'Inactivo',
                  tipoImpresora: printer.model,
                  tamanoLetra: 'Normal',
                  cortarPapel: 'Si',
                  grupoImpresoras: printer.location,
                  imprimirDescripcion: false,
                  imprimirComandos: false,
                  imprimirCopia: false,
                  ods: false,
                  excluirTipos: ''
                });
                setShowConfigModal(true);
              }}>
                Configurar
              </Button>
              <Button size="sm" variant="outline" className="flex-1 border-[var(--odin-border-accent)] bg-[var(--odin-input-bg)] text-[var(--odin-text-primary)] hover:bg-purple-500/20 hover:border-purple-500/50" onClick={() => handleDeletePrinter(printer.id)}>
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        ))}
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-purple-500/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-500/20">
                <div>
                  <h2 className="text-2xl font-bold text-white">Crear Impresora</h2>
                  <p className="text-sm text-slate-400 mt-1">Datos Generales</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form - Two Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Descripción <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      placeholder="Ingrese descripción"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      IP Secundario
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      placeholder="192.168.1.1"
                      value={formData.ipSecundario}
                      onChange={(e) => setFormData({ ...formData, ipSecundario: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tipo de Impresora <span className="text-red-400">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      value={formData.tipoImpresora}
                      onChange={(e) => setFormData({ ...formData, tipoImpresora: e.target.value })}
                    >
                      <option value="Comando">Comando</option>
                      <option value="Texto">Texto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Cortar papel
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      value={formData.cortarPapel}
                      onChange={(e) => setFormData({ ...formData, cortarPapel: e.target.value })}
                    >
                      <option value="Si">Si</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-purple-500/20">
                    <input
                      type="checkbox"
                      id="imprimirDescripcion"
                      className="w-4 h-4 bg-slate-700 border-purple-500/30 rounded text-purple-500 focus:ring-2 focus:ring-purple-500/50"
                      checked={formData.imprimirDescripcion}
                      onChange={(e) => setFormData({ ...formData, imprimirDescripcion: e.target.checked })}
                    />
                    <label htmlFor="imprimirDescripcion" className="text-sm text-slate-300 cursor-pointer">
                      ¿Imprimir descripción del artículo?
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-purple-500/20">
                    <input
                      type="checkbox"
                      id="imprimirCopia"
                      className="w-4 h-4 bg-slate-700 border-purple-500/30 rounded text-purple-500 focus:ring-2 focus:ring-purple-500/50"
                      checked={formData.imprimirCopia}
                      onChange={(e) => setFormData({ ...formData, imprimirCopia: e.target.checked })}
                    />
                    <label htmlFor="imprimirCopia" className="text-sm text-slate-300 cursor-pointer">
                      ¿Imprimir copia?
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Excluir tipos de órdenes
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      placeholder="Tipos a excluir"
                      value={formData.excluirTipos}
                      onChange={(e) => setFormData({ ...formData, excluirTipos: e.target.value })}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      IPE <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      placeholder="192.168.1.1"
                      value={formData.ipe}
                      onChange={(e) => setFormData({ ...formData, ipe: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Status
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tamaño de Letra
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      value={formData.tamanoLetra}
                      onChange={(e) => setFormData({ ...formData, tamanoLetra: e.target.value })}
                    >
                      <option value="Normal">Normal</option>
                      <option value="Grande">Grande</option>
                      <option value="Pequeño">Pequeño</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Grupo de Impresoras
                    </label>
                    <input
                      type="text"
                      list="printer-groups"
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      placeholder="Escribir o seleccionar grupo"
                      value={formData.grupoImpresoras}
                      onChange={(e) => setFormData({ ...formData, grupoImpresoras: e.target.value })}
                    />
                    <datalist id="printer-groups">
                      {customGroups.map(group => (
                        <option key={group} value={group} />
                      ))}
                    </datalist>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-purple-500/20">
                    <input
                      type="checkbox"
                      id="imprimirComandos"
                      className="w-4 h-4 bg-slate-700 border-purple-500/30 rounded text-purple-500 focus:ring-2 focus:ring-purple-500/50"
                      checked={formData.imprimirComandos}
                      onChange={(e) => setFormData({ ...formData, imprimirComandos: e.target.checked })}
                    />
                    <label htmlFor="imprimirComandos" className="text-sm text-slate-300 cursor-pointer">
                      ¿Imprimir comandos individuales?
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-purple-500/20">
                    <input
                      type="checkbox"
                      id="ods"
                      className="w-4 h-4 bg-slate-700 border-purple-500/30 rounded text-purple-500 focus:ring-2 focus:ring-purple-500/50"
                      checked={formData.ods}
                      onChange={(e) => setFormData({ ...formData, ods: e.target.checked })}
                    />
                    <label htmlFor="ods" className="text-sm text-slate-300 cursor-pointer">
                      Order Display System (ODS)
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-purple-500/20 flex justify-end gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="border-purple-500/30 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:border-purple-500/50 transition-all"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddPrinter}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Impresora
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-purple-500/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-500/20">
                <div>
                  <h2 className="text-2xl font-bold text-white">Configurar Impresora</h2>
                  <p className="text-sm text-slate-400 mt-1">Datos Generales</p>
                </div>
                <button 
                  onClick={() => setShowConfigModal(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form - Two Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Descripción <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      placeholder="Ingrese descripción"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      IP Secundario
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      placeholder="192.168.1.1"
                      value={formData.ipSecundario}
                      onChange={(e) => setFormData({ ...formData, ipSecundario: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tipo de Impresora <span className="text-red-400">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      value={formData.tipoImpresora}
                      onChange={(e) => setFormData({ ...formData, tipoImpresora: e.target.value })}
                    >
                      <option value="Comando">Comando</option>
                      <option value="Texto">Texto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Cortar papel
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      value={formData.cortarPapel}
                      onChange={(e) => setFormData({ ...formData, cortarPapel: e.target.value })}
                    >
                      <option value="Si">Si</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-purple-500/20">
                    <input
                      type="checkbox"
                      id="imprimirDescripcion"
                      className="w-4 h-4 bg-slate-700 border-purple-500/30 rounded text-purple-500 focus:ring-2 focus:ring-purple-500/50"
                      checked={formData.imprimirDescripcion}
                      onChange={(e) => setFormData({ ...formData, imprimirDescripcion: e.target.checked })}
                    />
                    <label htmlFor="imprimirDescripcion" className="text-sm text-slate-300 cursor-pointer">
                      ¿Imprimir descripción del artículo?
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-purple-500/20">
                    <input
                      type="checkbox"
                      id="imprimirCopia"
                      className="w-4 h-4 bg-slate-700 border-purple-500/30 rounded text-purple-500 focus:ring-2 focus:ring-purple-500/50"
                      checked={formData.imprimirCopia}
                      onChange={(e) => setFormData({ ...formData, imprimirCopia: e.target.checked })}
                    />
                    <label htmlFor="imprimirCopia" className="text-sm text-slate-300 cursor-pointer">
                      ¿Imprimir copia?
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Excluir tipos de órdenes
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      placeholder="Tipos a excluir"
                      value={formData.excluirTipos}
                      onChange={(e) => setFormData({ ...formData, excluirTipos: e.target.value })}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      IPE <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      placeholder="192.168.1.1"
                      value={formData.ipe}
                      onChange={(e) => setFormData({ ...formData, ipe: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Status
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tamaño de Letra
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      value={formData.tamanoLetra}
                      onChange={(e) => setFormData({ ...formData, tamanoLetra: e.target.value })}
                    >
                      <option value="Normal">Normal</option>
                      <option value="Grande">Grande</option>
                      <option value="Pequeño">Pequeño</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Grupo de Impresoras
                    </label>
                    <input
                      type="text"
                      list="printer-groups"
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      placeholder="Escribir o seleccionar grupo"
                      value={formData.grupoImpresoras}
                      onChange={(e) => setFormData({ ...formData, grupoImpresoras: e.target.value })}
                    />
                    <datalist id="printer-groups">
                      {customGroups.map(group => (
                        <option key={group} value={group} />
                      ))}
                    </datalist>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-purple-500/20">
                    <input
                      type="checkbox"
                      id="imprimirComandos"
                      className="w-4 h-4 bg-slate-700 border-purple-500/30 rounded text-purple-500 focus:ring-2 focus:ring-purple-500/50"
                      checked={formData.imprimirComandos}
                      onChange={(e) => setFormData({ ...formData, imprimirComandos: e.target.checked })}
                    />
                    <label htmlFor="imprimirComandos" className="text-sm text-slate-300 cursor-pointer">
                      ¿Imprimir comandos individuales?
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-purple-500/20">
                    <input
                      type="checkbox"
                      id="ods"
                      className="w-4 h-4 bg-slate-700 border-purple-500/30 rounded text-purple-500 focus:ring-2 focus:ring-purple-500/50"
                      checked={formData.ods}
                      onChange={(e) => setFormData({ ...formData, ods: e.target.checked })}
                    />
                    <label htmlFor="ods" className="text-sm text-slate-300 cursor-pointer">
                      Order Display System (ODS)
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-purple-500/20 flex justify-end gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowConfigModal(false)}
                  className="border-purple-500/30 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:border-purple-500/50 transition-all"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleEditPrinter}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </motion.div>
  );
}