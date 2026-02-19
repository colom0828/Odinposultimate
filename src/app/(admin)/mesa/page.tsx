'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { PlanoRestaurante } from '@/app/types/mesa.types';

export default function MesaPage() {
  const [savedPlanos, setSavedPlanos] = useState<PlanoRestaurante[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [planoToDelete, setPlanoToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadSavedPlanos();
  }, []);

  const loadSavedPlanos = () => {
    const saved = localStorage.getItem('odin-plano-mesas');
    if (saved) {
      try {
        const plano = JSON.parse(saved);
        // Por ahora solo tenemos un plano, pero preparamos para múltiples
        setSavedPlanos([plano]);
      } catch (error) {
        console.error('Error cargando planos:', error);
      }
    }
  };

  const handleNavigateToPlano = () => {
    window.history.pushState({}, '', '/admin/mesa/plano');
    window.dispatchEvent(new Event('popstate'));
  };

  const handleDeletePlano = (planoId: string) => {
    setPlanoToDelete(planoId);
    setShowDeleteDialog(true);
  };

  const confirmDeletePlano = () => {
    if (planoToDelete) {
      localStorage.removeItem('odin-plano-mesas');
      setSavedPlanos([]);
      setShowDeleteDialog(false);
      setPlanoToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const features = [
    {
      icon: LucideIcons.LayoutGrid,
      title: 'Constructor Visual',
      description: 'Diseña el plano de tu restaurante arrastrando y soltando mesas',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: LucideIcons.Move,
      title: 'Drag & Drop',
      description: 'Mueve y organiza mesas de forma intuitiva',
      color: 'from-purple-600 to-pink-600',
    },
    {
      icon: LucideIcons.Grid3x3,
      title: 'Sistema de Grid',
      description: 'Alineación perfecta con cuadrícula opcional',
      color: 'from-orange-600 to-red-600',
    },
    {
      icon: LucideIcons.MapPin,
      title: 'Múltiples Áreas',
      description: 'Crea áreas separadas: Salón, Terraza, VIP',
      color: 'from-green-600 to-emerald-600',
    },
  ];

  const mesaTypes = [
    {
      icon: LucideIcons.Square,
      name: 'Cuadrada',
      capacidad: '2-4 personas',
    },
    {
      icon: LucideIcons.Circle,
      name: 'Redonda',
      capacidad: '4 personas',
    },
    {
      icon: LucideIcons.RectangleHorizontal,
      name: 'Rectangular',
      capacidad: '4-6 personas',
    },
    {
      icon: LucideIcons.Octagon,
      name: 'Grande',
      capacidad: '6-8 personas',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <LucideIcons.Utensils className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                  Gestión de Mesas
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">
                  Organiza y administra las mesas de tu restaurante
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-8 mb-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 border-none shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-3">
                  Constructor de Plano de Mesas
                </h2>
                <p className="text-white/90 text-lg mb-6 max-w-2xl">
                  Diseña el layout perfecto de tu restaurante con nuestro constructor visual.
                  Arrastra mesas, crea áreas y organiza tu espacio de forma profesional.
                </p>
                <Button
                  onClick={handleNavigateToPlano}
                  className="bg-white text-purple-600 hover:bg-white/90 text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform"
                >
                  <LucideIcons.LayoutGrid className="w-5 h-5 mr-3" />
                  Abrir Constructor de Plano
                  <LucideIcons.ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </div>
              <div className="hidden lg:block">
                <div className="w-48 h-48 bg-white/10 rounded-3xl backdrop-blur-sm flex items-center justify-center">
                  <LucideIcons.LayoutGrid className="w-24 h-24 text-white/80" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Planos Guardados */}
        {savedPlanos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Planos Guardados
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Gestiona tus construcciones de planos de mesas
                </p>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                <LucideIcons.Database className="w-4 h-4" />
                <span className="text-sm font-bold">{savedPlanos.length} Plano{savedPlanos.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlanos.map((plano, index) => (
                <motion.div
                  key={plano.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 group">
                    {/* Preview Image */}
                    <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                      {/* Simulación visual del plano */}
                      <div className="absolute inset-0 p-4">
                        {plano.mesas.slice(0, 12).map((mesa, i) => (
                          <div
                            key={mesa.id}
                            className="absolute bg-purple-500/30 border-2 border-purple-500/60 rounded-lg transition-all group-hover:bg-purple-500/50"
                            style={{
                              width: `${mesa.size.width / 8}px`,
                              height: `${mesa.size.height / 8}px`,
                              left: `${mesa.position.x / 8}px`,
                              top: `${mesa.position.y / 8}px`,
                              transform: `rotate(${mesa.rotation}deg)`,
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Overlay con acciones */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={handleNavigateToPlano}
                            className="bg-white/90 text-purple-600 hover:bg-white"
                            size="sm"
                          >
                            <LucideIcons.Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            onClick={() => handleDeletePlano(plano.id)}
                            variant="outline"
                            className="bg-red-500/90 text-white border-red-500 hover:bg-red-600"
                            size="sm"
                          >
                            <LucideIcons.Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Badge de áreas */}
                      <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-slate-900/90 rounded-lg backdrop-blur-sm">
                        <div className="flex items-center space-x-1">
                          <LucideIcons.MapPin className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {plano.areas.length} {plano.areas.length === 1 ? 'Área' : 'Áreas'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            {plano.nombre}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Modificado: {formatDate(plano.ultimaModificacion)}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                          <LucideIcons.Grid3x3 className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                          <p className="text-xs text-slate-600 dark:text-slate-400">Mesas</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            {plano.mesas.length}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                          <LucideIcons.Users className="w-4 h-4 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                          <p className="text-xs text-slate-600 dark:text-slate-400">Capacidad</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            {plano.mesas.reduce((sum, m) => sum + m.capacidad, 0)}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-xl">
                          <LucideIcons.CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto mb-1" />
                          <p className="text-xs text-slate-600 dark:text-slate-400">Libres</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            {plano.mesas.filter(m => m.status === 'libre').length}
                          </p>
                        </div>
                      </div>

                      {/* Áreas */}
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">
                          Áreas configuradas:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {plano.areas.map((area) => (
                            <div
                              key={area.id}
                              className={`px-3 py-1 ${area.color} rounded-lg text-xs font-bold text-white`}
                            >
                              {area.nombre}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Características Principales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tipos de Mesa */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Tipos de Mesa Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mesaTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center">
                    <type.icon className="w-10 h-10 text-slate-700 dark:text-slate-300" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    Mesa {type.name}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {type.capacidad}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
              <div className="flex items-start space-x-3">
                <LucideIcons.Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-400 mb-1">
                    Estados de Mesa
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-400/80">
                    Libre, Ocupada, Reservada y Pagando
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Card className="p-6 bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-900/20">
              <div className="flex items-start space-x-3">
                <LucideIcons.Zap className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-purple-900 dark:text-purple-400 mb-1">
                    Edición Rápida
                  </h4>
                  <p className="text-sm text-purple-800 dark:text-purple-400/80">
                    Click en cualquier mesa para editar
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <Card className="p-6 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20">
              <div className="flex items-start space-x-3">
                <LucideIcons.Save className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-green-900 dark:text-green-400 mb-1">
                    Auto Guardado
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-400/80">
                    Tus cambios se guardan automáticamente
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteDialog(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md"
          >
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <LucideIcons.AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Confirmar Eliminación
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Esta acción no se puede deshacer
                  </p>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 mb-6">
                ¿Estás seguro de que deseas eliminar este plano de mesas? Se perderán todos los datos guardados.
              </p>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowDeleteDialog(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmDeletePlano}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  <LucideIcons.Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}