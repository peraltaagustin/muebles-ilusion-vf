'use client'
import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit, Trash2, X, Upload, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';

type Producto = {
  id: string;
  titulo: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
};

export default function AdminDashboard() {
  const supabase = createClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoTabla, setCargandoTabla] = useState(true);

  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [precio, setPrecio] = useState('');
  const [precioLista, setPrecioLista] = useState('');
  const [stock, setStock] = useState('');
  const [colores, setColores] = useState('');
  const [envioGratis, setEnvioGratis] = useState(false);
  const [cuotas, setCuotas] = useState(false);
  
  // Estados para la imagen
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProductos = async () => {
    setCargandoTabla(true);
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setProductos(data);
    if (error) console.error('Error cargando productos:', error.message);
    setCargandoTabla(false);
  };

  useEffect(() => {
    fetchProductos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejar selección de imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImagenFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Muestra la previsualización al instante
    }
  };

  const handleGuardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    let urlImagenFinal = "/vestidor.png"; // Imagen por defecto por si no suben nada

    // 1. Subir la imagen a Supabase Storage (si se seleccionó una)
    if (imagenFile) {
      // Generamos un nombre único para evitar que se pisen los archivos
      const fileExt = imagenFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('productos') // Nombre exacto del bucket
        .upload(fileName, imagenFile);

      if (uploadError) {
        alert('Error al subir la imagen: ' + uploadError.message);
        setCargando(false);
        return; // Detenemos el proceso si falla la imagen
      }

      // 2. Obtener la URL pública de la imagen recién subida
      const { data: publicUrlData } = supabase.storage
        .from('productos')
        .getPublicUrl(fileName);
        
      urlImagenFinal = publicUrlData.publicUrl;
    }

    // 3. Guardar todos los datos en la tabla (incluyendo la URL de la imagen)
    const { error: dbError } = await supabase
      .from('productos')
      .insert([
        {
          titulo,
          categoria,
          marca,
          precio: parseFloat(precio),
          precio_lista: precioLista ? parseFloat(precioLista) : null,
          stock: parseInt(stock),
          colores,
          envio_gratis: envioGratis,
          cuotas,
          imagen: urlImagenFinal 
        }
      ]);

    setCargando(false);

    if (dbError) {
      alert('Error al guardar el producto: ' + dbError.message);
    } else {
      setIsModalOpen(false);
      // Limpiar formulario completo
      setTitulo(''); setCategoria(''); setMarca(''); setPrecio(''); 
      setPrecioLista(''); setStock(''); setColores(''); 
      setEnvioGratis(false); setCuotas(false);
      setImagenFile(null); setPreviewUrl(null);
      fetchProductos();
    }
  };

  const handleEliminar = async (id: string, imageUrl: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      // 1. Eliminar de la base de datos
      const { error: dbError } = await supabase.from('productos').delete().eq('id', id);
      
      if (dbError) {
        alert('Error al eliminar: ' + dbError.message);
      } else {
        // 2. Intentar eliminar la imagen del Storage (para no ocupar espacio basura)
        if (imageUrl && imageUrl.includes('supabase.co')) {
          const fileName = imageUrl.split('/').pop();
          if (fileName) await supabase.storage.from('productos').remove([fileName]);
        }
        fetchProductos();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventario de Productos</h2>
          <p className="text-sm text-gray-500 mt-1">Gestiona los precios, stock y detalles de tu catálogo.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#e60000] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input type="text" placeholder="Buscar por nombre..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#e60000]" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 uppercase tracking-wider">
                <th className="p-4 font-semibold">Producto</th>
                <th className="p-4 font-semibold">Categoría</th>
                <th className="p-4 font-semibold">Precio</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {cargandoTabla ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-[#e60000]" size={24} />
                      <span>Cargando inventario...</span>
                    </div>
                  </td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    No hay productos cargados todavía.
                  </td>
                </tr>
              ) : (
                productos.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 relative bg-gray-100 rounded-md border border-gray-200 p-1 flex-shrink-0 overflow-hidden">
                        <Image src={prod.imagen || "/vestidor.png"} alt={prod.titulo} fill className="object-contain" sizes="48px" />
                      </div>
                      <span className="font-medium text-gray-900 line-clamp-2 max-w-xs">{prod.titulo}</span>
                    </td>
                    <td className="p-4 text-gray-600">{prod.categoria}</td>
                    <td className="p-4 font-semibold text-gray-900">${prod.precio.toLocaleString('es-AR')}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        prod.stock > 10 ? 'bg-green-100 text-green-800' : 
                        prod.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {prod.stock > 0 ? `${prod.stock} en stock` : 'Sin stock'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Editar">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleEliminar(prod.id, prod.imagen)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h3 className="text-lg font-bold text-gray-900">Agregar Nuevo Producto</h3>
              <button onClick={() => {
                setIsModalOpen(false);
                setPreviewUrl(null);
                setImagenFile(null);
              }} className="text-gray-400 hover:text-gray-700 transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              <form id="form-producto" onSubmit={handleGuardarProducto} className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">Información Básica</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título del Producto</label>
                      <input required type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#e60000] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                      <select required value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#e60000] outline-none">
                        <option value="">Seleccionar...</option>
                        <option value="Placares">Placares y Vestidores</option>
                        <option value="Colchones">Colchones y Sommiers</option>
                        <option value="Tecnología">Smart TV</option>
                        <option value="Muebles">Muebles de Interior</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                      <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#e60000] outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">Precios y Stock</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Precio de Venta ($)</label>
                      <input required type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#e60000] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Precio de Lista</label>
                      <input type="number" value={precioLista} onChange={(e) => setPrecioLista(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#e60000] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input required type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#e60000] outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">Detalles</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Colores (Separados por coma)</label>
                      <input type="text" value={colores} onChange={(e) => setColores(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#e60000] outline-none" />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={envioGratis} onChange={(e) => setEnvioGratis(e.target.checked)} className="w-4 h-4 accent-[#e60000]" />
                        <span className="text-sm text-gray-700">Envío Gratis</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={cuotas} onChange={(e) => setCuotas(e.target.checked)} className="w-4 h-4 accent-[#e60000]" />
                        <span className="text-sm text-gray-700">3 Cuotas sin interés</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* ZONA DE SUBIDA DE IMAGEN */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">Imagen del Producto</h4>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                  />
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer relative overflow-hidden ${
                      previewUrl ? 'border-[#e60000] bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {previewUrl ? (
                      <div className="relative w-full h-40">
                         <Image src={previewUrl} alt="Vista previa" fill className="object-contain" />
                      </div>
                    ) : (
                      <>
                        <Upload size={32} className="text-gray-400 mb-3" />
                        <p className="text-sm font-medium text-gray-700">Haz clic para subir una imagen</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG o WEBP (Recomendado 800x800)</p>
                      </>
                    )}
                  </div>
                  {previewUrl && (
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewUrl(null);
                        setImagenFile(null);
                        if(fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-[#e60000] text-sm mt-2 font-medium hover:underline block text-center w-full"
                    >
                      Eliminar y seleccionar otra
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <button onClick={() => {
                setIsModalOpen(false);
                setPreviewUrl(null);
                setImagenFile(null);
              }} type="button" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                Cancelar
              </button>
              <button form="form-producto" type="submit" disabled={cargando} className="px-4 py-2 bg-[#e60000] hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                {cargando ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                {cargando ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}