'use client';

import { useState, useEffect } from 'react';
import { Save, Building2, Receipt, Bell, Shield, Database, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

// Tipos de empresa disponibles
const tiposEmpresa = [
  'Restaurante',
  'Cafetería',
  'Supermercado',
  'Tienda de Ropa',
  'Ferretería',
  'Farmacia',
  'Panadería',
  'Librería',
  'Electrónica',
  'Otro',
];

interface EmpresaData {
  nombre: string;
  tipoEmpresa: string;
  cedulaJuridica: string;
  telefono: string;
  email: string;
  direccion: string;
}

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState('empresa');
  
  // Estado para la información de empresa
  const [empresaData, setEmpresaData] = useState<EmpresaData>({
    nombre: '',
    tipoEmpresa: '',
    cedulaJuridica: '',
    telefono: '',
    email: '',
    direccion: '',
  });

  // Cargar datos desde localStorage al montar el componente
  useEffect(() => {
    const savedData = localStorage.getItem('odin-empresa-config');
    if (savedData) {
      try {
        setEmpresaData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error al cargar datos de empresa:', error);
      }
    }
  }, []);

  // Guardar datos de empresa
  const handleSaveEmpresa = () => {
    // Validaciones básicas
    if (!empresaData.nombre.trim()) {
      toast.error('Error', {
        description: 'El nombre de la empresa es requerido',
      });
      return;
    }

    if (!empresaData.tipoEmpresa) {
      toast.error('Error', {
        description: 'Debe seleccionar un tipo de empresa',
      });
      return;
    }

    // Guardar en localStorage
    localStorage.setItem('odin-empresa-config', JSON.stringify(empresaData));
    
    toast.success('Información guardada', {
      description: 'Los datos de la empresa se han guardado exitosamente',
      icon: <Check className="w-4 h-4" />,
    });
  };

  // Handler para cambios en los campos
  const handleEmpresaChange = (field: keyof EmpresaData, value: string) => {
    setEmpresaData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configuración</h1>
        <p className="text-slate-400">Configuración general del sistema</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border border-purple-500/20 p-1 grid grid-cols-5 gap-2">
          <TabsTrigger 
            value="empresa" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-slate-300 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Empresa
          </TabsTrigger>
          <TabsTrigger 
            value="facturacion" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-slate-300 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Facturación
          </TabsTrigger>
          <TabsTrigger 
            value="notificaciones" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-slate-300 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger 
            value="seguridad" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-slate-300 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30"
          >
            <Shield className="w-4 h-4 mr-2" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger 
            value="sistema" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-slate-300 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30"
          >
            <Database className="w-4 h-4 mr-2" />
            Sistema
          </TabsTrigger>
        </TabsList>

        {/* Empresa Tab */}
        <TabsContent value="empresa" className="mt-6">
          <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Información de la Empresa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-slate-200">Nombre de la Empresa</Label>
                <Input
                  id="company-name"
                  placeholder="ODIN POS"
                  className="bg-slate-800/50 border-purple-500/20 text-white focus:border-purple-500"
                  value={empresaData.nombre}
                  onChange={(e) => handleEmpresaChange('nombre', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-id" className="text-slate-200">Cédula Jurídica / RUC</Label>
                <Input
                  id="tax-id"
                  placeholder="3-101-123456"
                  className="bg-slate-800/50 border-purple-500/20 text-white focus:border-purple-500"
                  value={empresaData.cedulaJuridica}
                  onChange={(e) => handleEmpresaChange('cedulaJuridica', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-200">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="+506 2222-2222"
                  className="bg-slate-800/50 border-purple-500/20 text-white focus:border-purple-500"
                  value={empresaData.telefono}
                  onChange={(e) => handleEmpresaChange('telefono', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contacto@odinpos.com"
                  className="bg-slate-800/50 border-purple-500/20 text-white focus:border-purple-500"
                  value={empresaData.email}
                  onChange={(e) => handleEmpresaChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-slate-200">Dirección</Label>
                <Input
                  id="address"
                  placeholder="San José, Costa Rica"
                  className="bg-slate-800/50 border-purple-500/20 text-white focus:border-purple-500"
                  value={empresaData.direccion}
                  onChange={(e) => handleEmpresaChange('direccion', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tipo-empresa" className="text-slate-200">Tipo de Empresa</Label>
                <Select
                  value={empresaData.tipoEmpresa}
                  onValueChange={(value) => handleEmpresaChange('tipoEmpresa', value)}
                >
                  <SelectTrigger className="bg-slate-800/50 border-purple-500/20 text-white focus:border-purple-500">
                    <SelectValue placeholder="Selecciona un tipo de empresa" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-purple-500/30 text-white backdrop-blur-xl shadow-2xl">
                    {tiposEmpresa.map(tipo => (
                      <SelectItem 
                        key={tipo} 
                        value={tipo}
                        className="text-white hover:bg-purple-600/30 focus:bg-purple-600/40 cursor-pointer"
                      >
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all" onClick={handleSaveEmpresa}>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Facturación Tab */}
        <TabsContent value="facturacion" className="mt-6">
          <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Configuración de Facturación</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-purple-500/20">
                <div>
                  <p className="font-medium text-white">Facturación Electrónica</p>
                  <p className="text-sm text-slate-400">Habilitar facturación electrónica del Ministerio de Hacienda</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-purple-500/20">
                <div>
                  <p className="font-medium text-white">Numeración Automática</p>
                  <p className="text-sm text-slate-400">Generar números de factura automáticamente</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="invoice-prefix" className="text-slate-200">Prefijo de Factura</Label>
                  <Input
                    id="invoice-prefix"
                    placeholder="FAC-"
                    className="bg-slate-800/50 border-purple-500/20 text-white focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="next-number" className="text-slate-200">Próximo Número</Label>
                  <Input
                    id="next-number"
                    type="number"
                    placeholder="1001"
                    className="bg-slate-800/50 border-purple-500/20 text-white focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all">
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notificaciones Tab */}
        <TabsContent value="notificaciones" className="mt-6">
          <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Configuración de Notificaciones</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-purple-500/20">
                <div>
                  <p className="font-medium text-white">Notificaciones de Ventas</p>
                  <p className="text-sm text-slate-400">Recibir notificaciones cuando se complete una venta</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-purple-500/20">
                <div>
                  <p className="font-medium text-white">Alertas de Stock Bajo</p>
                  <p className="text-sm text-slate-400">Notificar cuando productos tengan stock bajo</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-purple-500/20">
                <div>
                  <p className="font-medium text-white">Notificaciones por Email</p>
                  <p className="text-sm text-slate-400">Enviar resúmenes diarios por correo electrónico</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-purple-500/20">
                <div>
                  <p className="font-medium text-white">Notificaciones Push</p>
                  <p className="text-sm text-slate-400">Recibir notificaciones en tiempo real en el navegador</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all">
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Seguridad Tab */}
        <TabsContent value="seguridad" className="mt-6">
          <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Configuración de Seguridad</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-purple-500/20">
                <div>
                  <p className="font-medium text-white">Autenticación de Dos Factores</p>
                  <p className="text-sm text-slate-400">Requerir código adicional al iniciar sesión</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-purple-500/20">
                <div>
                  <p className="font-medium text-white">Cierre de Sesión Automático</p>
                  <p className="text-sm text-slate-400">Cerrar sesión después de inactividad</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeout" className="text-slate-200">Tiempo de Inactividad (minutos)</Label>
                <Input
                  id="timeout"
                  type="number"
                  placeholder="30"
                  className="bg-slate-800/50 border-purple-500/20 text-white focus:border-purple-500 max-w-xs"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all">
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Sistema Tab */}
        <TabsContent value="sistema" className="mt-6">
          <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 border-purple-500/20 backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Información del Sistema</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-800/30 rounded-lg border border-purple-500/20">
                <div>
                  <p className="text-sm text-slate-400">Versión del Sistema</p>
                  <p className="font-medium text-white">1.0.0</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Última Actualización</p>
                  <p className="font-medium text-white">2025-02-09</p>
                </div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg border border-purple-500/20">
                <p className="text-sm text-slate-400 mb-2">Base de Datos</p>
                <p className="font-medium text-white">Conectado</p>
                <p className="text-xs text-green-400 mt-1">Estado: Óptimo</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="border-purple-500/30 text-white hover:bg-purple-500/10 hover:border-purple-500/50 bg-slate-900/50">
                  Limpiar Caché
                </Button>
                <Button variant="outline" className="border-purple-500/30 text-white hover:bg-purple-500/10 hover:border-purple-500/50 bg-slate-900/50">
                  Verificar Actualizaciones
                </Button>
                <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-slate-900/50">
                  Restablecer Sistema
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}