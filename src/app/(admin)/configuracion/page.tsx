'use client';

import { useState, useEffect } from 'react';
import { Save, Building2, Receipt, Bell, Shield, Database, Check, Palette, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { ThemePreviewCard } from '../../components/ThemePreviewCard';

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
  
  // Estado para el tema
  const [savedTheme, setSavedTheme] = useState<'dark' | 'light'>('dark'); // Tema guardado
  const [tempTheme, setTempTheme] = useState<'dark' | 'light'>('dark'); // Tema temporal (preview)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
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
    
    // Cargar tema guardado o aplicar tema claro por defecto para mostrar el diseño
    const savedThemeFromStorage = localStorage.getItem('odin-theme') as 'dark' | 'light' | null;
    if (savedThemeFromStorage) {
      setSavedTheme(savedThemeFromStorage);
      setTempTheme(savedThemeFromStorage);
      applyThemeToDocument(savedThemeFromStorage);
    } else {
      // Aplicar tema claro por defecto al cargar la página de configuración
      setSavedTheme('light');
      setTempTheme('light');
      applyThemeToDocument('light');
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

  // Función para aplicar el tema al documento
  const applyThemeToDocument = (theme: 'dark' | 'light') => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.documentElement.classList.add('dark');
    }
  };

  // Manejar cambio de tema (preview en vivo)
  const handleThemeChange = (theme: 'dark' | 'light') => {
    setTempTheme(theme);
    applyThemeToDocument(theme);
    setHasUnsavedChanges(theme !== savedTheme);
  };

  // Guardar tema permanentemente
  const handleSaveTheme = () => {
    localStorage.setItem('odin-theme', tempTheme);
    setSavedTheme(tempTheme);
    setHasUnsavedChanges(false);
    applyThemeToDocument(tempTheme);
    
    // Disparar eventos para que otros componentes se actualicen
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: tempTheme } }));
    
    toast.success('Tema Actualizado', {
      description: `El tema ${tempTheme === 'light' ? 'claro' : 'oscuro'} se ha aplicado correctamente`,
    });
  };

  // Restablecer tema
  const handleResetTheme = () => {
    setTempTheme(savedTheme);
    applyThemeToDocument(savedTheme);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--odin-text-primary)] mb-2">Configuración</h1>
        <p className="text-[var(--odin-text-secondary)]">Configuración general del sistema</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[var(--odin-bg-card)] border border-[var(--odin-border-accent)] p-1 grid grid-cols-6 gap-2">
          <TabsTrigger 
            value="empresa" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-[var(--odin-text-secondary)] data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Empresa
          </TabsTrigger>
          <TabsTrigger 
            value="facturacion" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-[var(--odin-text-secondary)] data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Facturación
          </TabsTrigger>
          <TabsTrigger 
            value="apariencia" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-[var(--odin-text-secondary)] data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30"
          >
            <Palette className="w-4 h-4 mr-2" />
            Apariencia
          </TabsTrigger>
          <TabsTrigger 
            value="notificaciones" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-[var(--odin-text-secondary)] data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger 
            value="seguridad" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-[var(--odin-text-secondary)] data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30"
          >
            <Shield className="w-4 h-4 mr-2" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger 
            value="sistema" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-[var(--odin-text-secondary)] data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30"
          >
            <Database className="w-4 h-4 mr-2" />
            Sistema
          </TabsTrigger>
        </TabsList>

        {/* Apariencia Tab */}
        <TabsContent value="apariencia" className="mt-6">
          <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-sm p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--odin-text-primary)] mb-2">Apariencia del Sistema</h2>
              <p className="text-[var(--odin-text-secondary)]">Personaliza el tema visual completo de ODIN POS</p>
              
              {/* Indicador de cambios pendientes */}
              {hasUnsavedChanges && (
                <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-orange-400 font-medium">
                    Tienes cambios sin guardar. Presiona "Guardar Cambios" para aplicarlos permanentemente.
                  </p>
                </div>
              )}
            </div>

            {/* Theme selector cards */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[var(--odin-text-primary)] mb-4">Seleccionar Tema</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ThemePreviewCard 
                  theme="dark" 
                  isSelected={tempTheme === 'dark'}
                  onSelect={() => handleThemeChange('dark')}
                />
                <ThemePreviewCard 
                  theme="light" 
                  isSelected={tempTheme === 'light'}
                  onSelect={() => handleThemeChange('light')}
                />
              </div>
            </div>

            {/* Quick toggle */}
            <div className="mb-8 p-5 bg-[var(--odin-input-bg)] rounded-xl border border-[var(--odin-border-accent)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--odin-text-primary)] mb-1">Cambio Rápido de Tema</p>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Usar tema claro en todo el sistema</p>
                </div>
                <Switch 
                  checked={tempTheme === 'light'} 
                  onCheckedChange={(checked) => {
                    const newTheme = checked ? 'light' : 'dark';
                    handleThemeChange(newTheme);
                  }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-4">
              <Button 
                variant="outline" 
                className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] hover:bg-purple-500/10 hover:border-purple-500/50 bg-[var(--odin-input-bg)]"
                onClick={handleResetTheme}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restablecer
              </Button>
              <Button 
                disabled={!hasUnsavedChanges}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSaveTheme}
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Empresa Tab */}
        <TabsContent value="empresa" className="mt-6">
          <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold text-[var(--odin-text-primary)] mb-6">Información de la Empresa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-[var(--odin-text-primary)]">Nombre de la Empresa</Label>
                <Input
                  id="company-name"
                  placeholder="ODIN POS"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] focus:border-purple-500"
                  value={empresaData.nombre}
                  onChange={(e) => handleEmpresaChange('nombre', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-id" className="text-[var(--odin-text-primary)]">Cédula Jurídica / RUC</Label>
                <Input
                  id="tax-id"
                  placeholder="3-101-123456"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] focus:border-purple-500"
                  value={empresaData.cedulaJuridica}
                  onChange={(e) => handleEmpresaChange('cedulaJuridica', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[var(--odin-text-primary)]">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="+506 2222-2222"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] focus:border-purple-500"
                  value={empresaData.telefono}
                  onChange={(e) => handleEmpresaChange('telefono', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[var(--odin-text-primary)]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contacto@odinpos.com"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] focus:border-purple-500"
                  value={empresaData.email}
                  onChange={(e) => handleEmpresaChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-[var(--odin-text-primary)]">Dirección</Label>
                <Input
                  id="address"
                  placeholder="San José, Costa Rica"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] focus:border-purple-500"
                  value={empresaData.direccion}
                  onChange={(e) => handleEmpresaChange('direccion', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tipo-empresa" className="text-[var(--odin-text-primary)]">Tipo de Empresa</Label>
                <Select
                  value={empresaData.tipoEmpresa}
                  onValueChange={(value) => handleEmpresaChange('tipoEmpresa', value)}
                >
                  <SelectTrigger className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] focus:border-purple-500">
                    <SelectValue placeholder="Selecciona un tipo de empresa" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] backdrop-blur-xl shadow-2xl">
                    {tiposEmpresa.map(tipo => (
                      <SelectItem 
                        key={tipo} 
                        value={tipo}
                        className="text-[var(--odin-text-primary)] hover:bg-purple-600/30 focus:bg-purple-600/40 cursor-pointer"
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
          <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold text-[var(--odin-text-primary)] mb-6">Configuración de Facturación</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <div>
                  <p className="font-medium text-[var(--odin-text-primary)]">Facturación Electrónica</p>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Habilitar facturación electrónica del Ministerio de Hacienda</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <div>
                  <p className="font-medium text-[var(--odin-text-primary)]">Numeración Automática</p>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Generar números de factura automáticamente</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="invoice-prefix" className="text-[var(--odin-text-primary)]">Prefijo de Factura</Label>
                  <Input
                    id="invoice-prefix"
                    placeholder="FAC-"
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="next-number" className="text-[var(--odin-text-primary)]">Próximo Número</Label>
                  <Input
                    id="next-number"
                    type="number"
                    placeholder="1001"
                    className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] focus:border-purple-500"
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
          <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold text-[var(--odin-text-primary)] mb-6">Configuración de Notificaciones</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <div>
                  <p className="font-medium text-[var(--odin-text-primary)]">Notificaciones de Ventas</p>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Recibir notificaciones cuando se complete una venta</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <div>
                  <p className="font-medium text-[var(--odin-text-primary)]">Alertas de Stock Bajo</p>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Notificar cuando productos tengan stock bajo</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <div>
                  <p className="font-medium text-[var(--odin-text-primary)]">Notificaciones por Email</p>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Enviar resúmenes diarios por correo electrónico</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <div>
                  <p className="font-medium text-[var(--odin-text-primary)]">Notificaciones Push</p>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Recibir notificaciones en tiempo real en el navegador</p>
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
          <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold text-[var(--odin-text-primary)] mb-6">Configuración de Seguridad</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <div>
                  <p className="font-medium text-[var(--odin-text-primary)]">Autenticación de Dos Factores</p>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Requerir código adicional al iniciar sesión</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <div>
                  <p className="font-medium text-[var(--odin-text-primary)]">Cierre de Sesión Automático</p>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Cerrar sesión después de inactividad</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeout" className="text-[var(--odin-text-primary)]">Tiempo de Inactividad (minutos)</Label>
                <Input
                  id="timeout"
                  type="number"
                  placeholder="30"
                  className="bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] focus:border-purple-500 max-w-xs"
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
          <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold text-[var(--odin-text-primary)] mb-6">Información del Sistema</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <div>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Versión del Sistema</p>
                  <p className="font-medium text-[var(--odin-text-primary)]">1.0.0</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--odin-text-secondary)]">Última Actualización</p>
                  <p className="font-medium text-[var(--odin-text-primary)]">2025-02-09</p>
                </div>
              </div>
              <div className="p-4 bg-[var(--odin-input-bg)] rounded-lg border border-[var(--odin-border-accent)]">
                <p className="text-sm text-[var(--odin-text-secondary)] mb-2">Base de Datos</p>
                <p className="font-medium text-[var(--odin-text-primary)]">Conectado</p>
                <p className="text-xs text-green-400 mt-1">Estado: Óptimo</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] hover:bg-purple-500/10 hover:border-purple-500/50 bg-[var(--odin-input-bg)]">
                  Limpiar Caché
                </Button>
                <Button variant="outline" className="border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] hover:bg-purple-500/10 hover:border-purple-500/50 bg-[var(--odin-input-bg)]">
                  Verificar Actualizaciones
                </Button>
                <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-[var(--odin-input-bg)]">
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