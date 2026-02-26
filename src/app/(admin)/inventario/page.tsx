import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, X, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Modal } from '../../components/ui/modal';
import { formatCurrency } from '../../utils/formatters';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
}

const initialProducts: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 15', sku: 'DELL-XPS-15', price: 1200, stock: 15, category: 'Electrónica', status: 'active' },
  { id: 2, name: 'Mouse Logitech MX Master', sku: 'LOG-MX-MST', price: 100, stock: 45, category: 'Accesorios', status: 'active' },
  { id: 3, name: 'Teclado Mecánico Keychron K2', sku: 'KEY-K2-BLK', price: 120, stock: 32, category: 'Accesorios', status: 'active' },
  { id: 4, name: 'Monitor LG 27" 4K', sku: 'LG-27-4K', price: 400, stock: 8, category: 'Pantallas', status: 'active' },
  { id: 5, name: 'Auriculares Sony WH-1000XM4', sku: 'SNY-WH1000', price: 300, stock: 22, category: 'Audio', status: 'active' },
  { id: 6, name: 'Webcam Logitech C920', sku: 'LOG-C920', price: 80, stock: 0, category: 'Accesorios', status: 'inactive' },
  { id: 7, name: 'SSD Samsung 1TB', sku: 'SAM-SSD-1TB', price: 150, stock: 50, category: 'Almacenamiento', status: 'active' },
  { id: 8, name: 'RAM Corsair 16GB DDR4', sku: 'COR-RAM-16', price: 90, stock: 38, category: 'Componentes', status: 'active' },
];

export default function InventarioPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    category: '',
    status: 'active',
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: '',
        price: 0,
        stock: 0,
        category: '',
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      price: 0,
      stock: 0,
      category: '',
      status: 'active',
    });
  };

  const handleSave = () => {
    if (editingProduct) {
      // Editar producto existente
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...formData, id: p.id } as Product : p
      ));
    } else {
      // Agregar nuevo producto
      const newProduct: Product = {
        ...formData,
        id: Math.max(...products.map(p => p.id)) + 1,
      } as Product;
      setProducts([...products, newProduct]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleInputChange = (field: keyof Product, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--odin-text-primary)] mb-2">Gestión de Inventario</h1>
          <p className="text-[var(--odin-text-secondary)]\">Control de stock y movimientos</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Producto
        </Button>
        </motion.div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-4 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Total Productos</p>
          <p className="text-2xl font-bold text-[var(--odin-text-primary)]">{products.length}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-4 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Productos Activos</p>
          <p className="text-2xl font-bold text-green-400">{products.filter(p => p.status === 'active').length}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-4 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Stock Bajo</p>
          <p className="text-2xl font-bold text-yellow-400">{products.filter(p => p.stock < 10 && p.stock > 0).length}</p>
        </Card>
        <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-4 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl">
          <p className="text-sm text-[var(--odin-text-secondary)] mb-1">Sin Stock</p>
          <p className="text-2xl font-bold text-red-400">{products.filter(p => p.stock === 0).length}</p>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] p-6 backdrop-blur-sm transition-all duration-300 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--odin-text-secondary)]" />
            <Input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-[var(--odin-input-bg)] border-[var(--odin-border-accent)] text-[var(--odin-text-primary)] placeholder:text-[var(--odin-text-secondary)] focus:border-purple-500"
            />
          </div>
        </div>
      </Card>

      {/* Products table */}
      <Card className="bg-[var(--odin-bg-card)] border-[var(--odin-border-accent)] backdrop-blur-sm overflow-hidden transition-all duration-300 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--odin-border)]">
                <th className="text-left p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Producto</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">SKU</th>
                <th className="text-left p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Categoría</th>
                <th className="text-right p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Precio</th>
                <th className="text-center p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Stock</th>
                <th className="text-center p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Estado</th>
                <th className="text-center p-4 text-sm font-semibold text-[var(--odin-text-secondary)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-[var(--odin-border)] hover:bg-[var(--odin-input-bg)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-[var(--odin-text-primary)]">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[var(--odin-text-secondary)] font-mono text-sm">{product.sku}</td>
                  <td className="p-4 text-[var(--odin-text-primary)]">{product.category}</td>
                  <td className="p-4 text-right font-semibold text-[var(--odin-text-primary)]">{formatCurrency(product.price)}</td>
                  <td className="p-4 text-center">
                    <span className={`font-medium ${
                      product.stock === 0 ? 'text-red-400' :
                      product.stock < 10 ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Badge className={product.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }>
                      {product.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-[var(--odin-text-secondary)] hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-[var(--odin-text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-purple-500/20 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
        </div>
      </Card>

      {/* Modal para agregar/editar producto */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        footer={
          <>
            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="border-purple-500/30 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nombre del Producto</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ej: Laptop Dell XPS 15"
              className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">SKU</label>
            <Input
              type="text"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              placeholder="Ej: DELL-XPS-15"
              className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Precio</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                placeholder="0.00"
                className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Stock</label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                placeholder="0"
                className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Categoría</label>
            <Input
              type="text"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="Ej: Electrónica"
              className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Estado</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}