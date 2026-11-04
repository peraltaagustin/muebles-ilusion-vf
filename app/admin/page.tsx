'use client'
import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit, Trash2, X, Upload, Check, Loader2, Image as ImageIcon, Package, ShoppingBag, Settings, LogOut, Calculator, Lock } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';

type Producto = {
  id: string;
  titulo: string;
  descripcion?: string;
  precio: number;
  precio_lista?: number;
  precio_tachado?: number;
  stock: number;
  categoria: string;
  subcategoria?: string;
  marca: string;
  proveedor?: string;
  imagen: string;
  imagenes?: string[];
  colores?: string;
  envio_gratis?: boolean;
  envio_gratis_las_heras?: boolean;
  retiro_sucursal?: boolean;
  cuotas?: boolean;
  destacado?: boolean;
};

// Nuevo tipo para los banners
type Banner = {
  id: string;
  imagen_url: string;
};

export default function AdminDashboard() {
  const supabase = createClient();
  
  const [activeTab, setActiveTab] = useState<'productos' | 'pedidos' | 'configuracion'>('productos');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargandoTabla, setCargandoTabla] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);

  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [filtroProveedor, setFiltroProveedor] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [isAjusteModalOpen, setIsAjusteModalOpen] = useState(false);
  const [porcentajeAjuste, setPorcentajeAjuste] = useState('');
  const [tipoAjuste, setTipoAjuste] = useState<'aumento' | 'descuento'>('aumento');

  // --- ESTADOS PARA BANNERS ---
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [cargandoBanners, setCargandoBanners] = useState(false);
  const [nuevoBannerArchivo, setNuevoBannerArchivo] = useState<File | null>(null);
  const [nuevoBannerUrl, setNuevoBannerUrl] = useState('');
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const [categoriasExistentes, setCategoriasExistentes] = useState<string[]>([]);
  const [subcategoriasExistentes, setSubcategoriasExistentes] = useState<string[]>([]);
  const [marcasExistentes, setMarcasExistentes] = useState<string[]>([]);
  const [proveedoresExistentes, setProveedoresExistentes] = useState<string[]>([]);
  const [coloresExistentes, setColoresExistentes] = useState<string[]>([]);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [nuevaSubcategoria, setNuevaSubcategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [nuevaMarca, setNuevaMarca] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [nuevoProveedor, setNuevoProveedor] = useState('');
  
  const [precio, setPrecio] = useState('');
  const [precioLista, setPrecioLista] = useState('');
  const [precioTachado, setPrecioTachado] = useState('');
  const [stock, setStock] = useState('');
  
  const [coloresSeleccionados, setColoresSeleccionados] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState('');
  const [nuevoColor, setNuevoColor] = useState('');
  
  const [envioGratis, setEnvioGratis] = useState(false);
  const [envioGratisLasHeras, setEnvioGratisLasHeras] = useState(false);
  const [retiroSucursal, setRetiroSucursal] = useState(false);
  const [cuotas, setCuotas] = useState(false);
  const [destacado, setDestacado] = useState(false);
  
  const [archivosImagen, setArchivosImagen] = useState<File[]>([]);
  const [urlsImagen, setUrlsImagen] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProductos = async () => {
    setCargandoTabla(true);
    const { data, error } = await supabase.from('productos').select('*').order('created_at', { ascending: false });
    if (data) {
      setProductos(data);
      setCategoriasExistentes(Array.from(new Set(data.map(p => p.categoria).filter(Boolean))));
      setMarcasExistentes(Array.from(new Set(data.map(p => p.marca).filter(Boolean))));
      setProveedoresExistentes(Array.from(new Set(data.map(p => p.proveedor).filter(Boolean))));
      const todosColores = data.flatMap(p => p.colores ? p.colores.split(',').map((c:string) => c.trim()) : []);
      setColoresExistentes(Array.from(new Set(todosColores.filter(Boolean))));
    }
    setCargandoTabla(false);
  };

  // --- FUNCIÓN FETCH BANNERS ---
  const fetchBanners = async () => {
    const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
    if (data) setBanners(data);
  };

  useEffect(() => { 
    fetchProductos(); 
    fetchBanners();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const catActual = categoria === 'NUEVA' ? nuevaCategoria : categoria;
    const subcats = productos.filter(p => p.categoria === catActual).map(p => p.subcategoria).filter(Boolean) as string[];
    setSubcategoriasExistentes(Array.from(new Set(subcats)));
  }, [categoria, nuevaCategoria, productos]);

  const productosFiltrados = productos.filter(p => {
    return (
      (filtroCategoria === '' || p.categoria === filtroCategoria) &&
      (filtroMarca === '' || p.marca === filtroMarca) &&
      (filtroProveedor === '' || p.proveedor === filtroProveedor) &&
      (busqueda === '' || p.titulo.toLowerCase().includes(busqueda.toLowerCase()))
    );
  });

  const toggleSeleccion = (id: string) => setSeleccionados(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  
  const toggleSeleccionarTodos = () => {
    if (seleccionados.length === productosFiltrados.length && productosFiltrados.length > 0) setSeleccionados([]);
    else setSeleccionados(productosFiltrados.map(p => p.id));
  };

  const handleAplicarAjusteMasivo = async () => {
    if (!porcentajeAjuste || isNaN(Number(porcentajeAjuste)) || Number(porcentajeAjuste) <= 0) return alert("Porcentaje inválido.");
    setCargando(true);
    const multiplicador = tipoAjuste === 'aumento' ? (1 + Number(porcentajeAjuste) / 100) : (1 - Number(porcentajeAjuste) / 100);

    const promesas = seleccionados.map(async (id) => {
      const prod = productos.find(p => p.id === id);
      if (!prod) return;
      return supabase.from('productos').update({
        precio: Math.round(prod.precio * multiplicador),
        precio_lista: prod.precio_lista ? Math.round(prod.precio_lista * multiplicador) : null,
        precio_tachado: prod.precio_tachado ? Math.round(prod.precio_tachado * multiplicador) : null
      }).eq('id', id);
    });
    await Promise.all(promesas);
    setCargando(false); setIsAjusteModalOpen(false); setSeleccionados([]); setPorcentajeAjuste(''); fetchProductos();
  };

  // --- FUNCIONES PARA BANNERS ---
  const handleGuardarBanner = async () => {
    if (!nuevoBannerArchivo && !nuevoBannerUrl.trim()) return;
    setCargandoBanners(true);

    let urlFinal = nuevoBannerUrl.trim();

    // 1. Si hay archivo físico, lo subimos al bucket 'banners'
    if (nuevoBannerArchivo) {
      const fileExt = nuevoBannerArchivo.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('banners').upload(fileName, nuevoBannerArchivo);
      
      if (!uploadError) {
        urlFinal = supabase.storage.from('banners').getPublicUrl(fileName).data.publicUrl;
      } else {
        alert('Error al subir la imagen: ' + uploadError.message);
        setCargandoBanners(false);
        return;
      }
    }

    // 2. Guardamos la URL final en la tabla
    if (urlFinal) {
      const { error } = await supabase.from('banners').insert([{ imagen_url: urlFinal }]);
      if (error) {
        alert('Error al guardar el banner en base de datos: ' + error.message);
      } else {
        setNuevoBannerArchivo(null);
        setNuevoBannerUrl('');
        fetchBanners(); // Recargar lista
      }
    }
    setCargandoBanners(false);
  };

  const handleEliminarBanner = async (id: string, url: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este banner?')) return;
    
    // 1. Borrar de la tabla
    const { error } = await supabase.from('banners').delete().eq('id', id);
    
    if (!error) {
       // 2. Borrar del bucket (Storage) si la imagen está alojada en Supabase
       if (url.includes('supabase.co')) {
          const fileName = url.split('/').pop();
          if (fileName) await supabase.storage.from('banners').remove([fileName]);
       }
       fetchBanners(); // Recargar lista
    }
  };

  const agregarColor = () => {
    const c = colorInput === 'NUEVO' ? nuevoColor.trim() : colorInput;
    if (c && !coloresSeleccionados.includes(c)) setColoresSeleccionados([...coloresSeleccionados, c]);
    setColorInput(''); setNuevoColor('');
  };
  
  const quitarColor = (c: string) => setColoresSeleccionados(coloresSeleccionados.filter(col => col !== c));
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) setArchivosImagen(prev => [...prev, ...Array.from(e.target.files!)]); };
  
  const agregarUrlImagen = () => { if (urlInput.trim()) { setUrlsImagen(prev => [...prev, urlInput.trim()]); setUrlInput(''); } };
  
  const eliminarImagen = (index: number, tipo: 'archivo' | 'url') => {
    if (tipo === 'archivo') setArchivosImagen(prev => prev.filter((_, i) => i !== index));
    else setUrlsImagen(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditar = (prod: Producto) => {
    setProductoEditando(prod);
    setTitulo(prod.titulo); setDescripcion(prod.descripcion || ''); setCategoria(prod.categoria);
    setSubcategoria(prod.subcategoria || ''); setMarca(prod.marca || ''); setProveedor(prod.proveedor || '');
    setPrecio(prod.precio.toString()); 
    setPrecioLista(prod.precio_lista ? prod.precio_lista.toString() : '');
    setPrecioTachado(prod.precio_tachado ? prod.precio_tachado.toString() : '');
    setStock(prod.stock.toString()); setColoresSeleccionados(prod.colores ? prod.colores.split(',').map(c => c.trim()) : []);
    setEnvioGratis(prod.envio_gratis || false); setEnvioGratisLasHeras(prod.envio_gratis_las_heras || false);
    setRetiroSucursal(prod.retiro_sucursal || false); setCuotas(prod.cuotas || false);
    setDestacado(prod.destacado || false); // <--- Cargar estado destacado
    setUrlsImagen(prod.imagenes || (prod.imagen ? [prod.imagen] : [])); setArchivosImagen([]);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setProductoEditando(null); setTitulo(''); setDescripcion(''); setCategoria(''); setNuevaCategoria(''); setSubcategoria(''); setNuevaSubcategoria(''); setMarca(''); setNuevaMarca(''); setProveedor(''); setNuevoProveedor(''); 
    setPrecio(''); setPrecioLista(''); setPrecioTachado(''); 
    setStock(''); setColoresSeleccionados([]); setColorInput(''); setNuevoColor(''); 
    setEnvioGratis(false); setEnvioGratisLasHeras(false); setRetiroSucursal(false); setCuotas(false); setDestacado(false); // <--- Resetear destacado
    setArchivosImagen([]); setUrlsImagen([]); setUrlInput('');
  };

  const handleGuardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    const catFinal = categoria === 'NUEVA' ? nuevaCategoria : categoria;
    const subcatFinal = subcategoria === 'NUEVA' ? nuevaSubcategoria : subcategoria;
    const marcaFinal = marca === 'NUEVA' ? nuevaMarca : marca;
    const provFinal = proveedor === 'NUEVA' ? nuevoProveedor : proveedor;
    
    let urlsSubidas: string[] = [];
    for (const file of archivosImagen) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('productos').upload(fileName, file);
      if (!uploadError) urlsSubidas.push(supabase.storage.from('productos').getPublicUrl(fileName).data.publicUrl);
    }

    const urlsFinales = [...urlsImagen, ...urlsSubidas];
    const imagenPrincipal = urlsFinales.length > 0 ? urlsFinales[0] : "/vestidor.png";

    const datosGuardar = {
      titulo, 
      descripcion, 
      categoria: catFinal, 
      subcategoria: subcatFinal, 
      marca: marcaFinal, 
      proveedor: provFinal,
      precio: parseFloat(precio), 
      precio_lista: precioLista ? parseFloat(precioLista) : null, 
      precio_tachado: precioTachado ? parseFloat(precioTachado) : null,
      stock: parseInt(stock),
      colores: coloresSeleccionados.join(', '), 
      envio_gratis: envioGratis, 
      envio_gratis_las_heras: envioGratisLasHeras,
      retiro_sucursal: retiroSucursal, 
      cuotas,
      destacado, // <--- Guardar valor destacado en DB
      imagen: imagenPrincipal, 
      imagenes: urlsFinales
    };

    let dbError;
    if (productoEditando) dbError = (await supabase.from('productos').update(datosGuardar).eq('id', productoEditando.id)).error;
    else dbError = (await supabase.from('productos').insert([datosGuardar])).error;
    
    setCargando(false);
    if (dbError) alert('Error: ' + dbError.message);
    else { setIsModalOpen(false); resetForm(); fetchProductos(); }
  };

  const handleEliminar = async (id: string, imagenesParaBorrar?: string[]) => {
    if (window.confirm('¿Eliminar este producto?')) {
      const { error } = await supabase.from('productos').delete().eq('id', id);
      if (!error) {
        if (imagenesParaBorrar && imagenesParaBorrar.length > 0) {
           const filenames = imagenesParaBorrar
              .filter(url => url.includes('supabase.co'))
              .map(url => url.split('/').pop())
              .filter(Boolean) as string[];
           if (filenames.length > 0) await supabase.storage.from('productos').remove(filenames);
        }
        fetchProductos();
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-100 flex justify-center">
          <Image src="/logo.png" alt="Logo" width={140} height={40} className="object-contain" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('productos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'productos' ? 'bg-red-50 text-[#e60000]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Package size={20} /> Productos
          </button>
          <button onClick={() => setActiveTab('pedidos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'pedidos' ? 'bg-red-50 text-[#e60000]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <ShoppingBag size={20} /> Pedidos
          </button>
          <button onClick={() => setActiveTab('configuracion')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'configuracion' ? 'bg-red-50 text-[#e60000]' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Settings size={20} /> Configuración
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* HEADER SUPERIOR */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-800">Panel de Control</h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#e60000] text-white flex items-center justify-center font-bold text-xs">AP</div>
            <span className="text-sm font-semibold text-gray-700">Agustin N, Peralta</span>
          </div>
        </header>

        {/* ÁREA DE PESTAÑAS */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* ----- PESTAÑA: PRODUCTOS ----- */}
          {activeTab === 'productos' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Inventario de Productos</h2>
                  <p className="text-sm text-gray-500 mt-1">Gestión de catálogo, ajustes masivos, stock y proveedores.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { if(seleccionados.length === 0) alert("Selecciona productos"); else setIsAjusteModalOpen(true); }} className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                    <Calculator size={18} /> Ajuste Masivo ({seleccionados.length})
                  </button>
                  <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#e60000] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                    <Plus size={18} /> Nuevo Producto
                  </button>
                </div>
              </div>

              {/* Filtros */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                  <input type="text" placeholder="Buscar producto..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-[#e60000]" />
                </div>
                <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} className="border rounded-lg p-2 text-sm outline-none focus:border-[#e60000]">
                  <option value="">Todas las Categorías</option>
                  {categoriasExistentes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={filtroMarca} onChange={e => setFiltroMarca(e.target.value)} className="border rounded-lg p-2 text-sm outline-none focus:border-[#e60000]">
                  <option value="">Todas las Marcas</option>
                  {marcasExistentes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={filtroProveedor} onChange={e => setFiltroProveedor(e.target.value)} className="border rounded-lg p-2 text-sm outline-none focus:border-[#e60000]">
                  <option value="">Todos los Proveedores</option>
                  {proveedoresExistentes.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Tabla */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-600 uppercase tracking-wider">
                        <th className="p-4 w-12 text-center">
                          <input type="checkbox" className="w-4 h-4 accent-[#e60000] cursor-pointer" checked={seleccionados.length === productosFiltrados.length && productosFiltrados.length > 0} onChange={toggleSeleccionarTodos} />
                        </th>
                        <th className="py-4 pr-4 font-semibold">Producto</th>
                        <th className="p-4 font-semibold">Cat / Subcat</th>
                        <th className="p-4 font-semibold">Marca / Prov.</th>
                        <th className="p-4 font-semibold min-w-[140px]">Precios</th>
                        <th className="p-4 font-semibold">Stock</th>
                        <th className="p-4 font-semibold text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {cargandoTabla ? (
                        <tr><td colSpan={7} className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-[#e60000]" size={24} /></td></tr>
                      ) : productosFiltrados.map((prod) => (
                          <tr key={prod.id} className={`hover:bg-gray-50 transition-colors ${seleccionados.includes(prod.id) ? 'bg-red-50/50' : ''}`}>
                            <td className="p-4 text-center">
                              <input type="checkbox" className="w-4 h-4 accent-[#e60000] cursor-pointer" checked={seleccionados.includes(prod.id)} onChange={() => toggleSeleccion(prod.id)} />
                            </td>
                            <td className="py-4 pr-4 flex items-center gap-3">
                              <div className="w-12 h-12 relative bg-white rounded border flex-shrink-0 overflow-hidden">
                                <Image src={prod.imagen || "/vestidor.png"} alt={prod.titulo} fill className="object-contain" sizes="48px" />
                              </div>
                              <span className="font-medium text-gray-900 line-clamp-2 max-w-[200px]">
                                {prod.titulo}
                                {prod.destacado && <span className="ml-2 inline-block px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded">DESTACADO</span>}
                              </span>
                            </td>
                            <td className="p-4 text-xs">
                              <p className="font-semibold text-gray-800">{prod.categoria}</p>
                              <p className="text-gray-500">{prod.subcategoria || '-'}</p>
                            </td>
                            <td className="p-4 text-xs">
                              <p className="font-semibold text-gray-800">{prod.marca || 'Genérica'}</p>
                              <p className="text-blue-600 font-medium flex items-center gap-1"><Lock size={10}/> {prod.proveedor || '-'}</p>
                            </td>
                            <td className="p-4 text-xs">
                              <p className="font-bold text-gray-900 text-sm">${prod.precio.toLocaleString('es-AR')}</p>
                              {prod.precio_tachado && <p className="text-gray-400 line-through">Oferta: ${prod.precio_tachado.toLocaleString('es-AR')}</p>}
                              {prod.precio_lista && <p className="text-blue-600 font-medium mt-1 flex items-center gap-1" title="Costo Interno"><Lock size={10}/>Lista: ${prod.precio_lista.toLocaleString('es-AR')}</p>}
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${prod.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} flex items-center w-max gap-1`}>
                                <Lock size={10}/> {prod.stock} disp.
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-1">
                                <button onClick={() => handleEditar(prod)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md" title="Editar"><Edit size={18} /></button>
                                <button onClick={() => handleEliminar(prod.id, prod.imagenes)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md" title="Eliminar"><Trash2 size={18} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ----- PESTAÑA: PEDIDOS ----- */}
          {activeTab === 'pedidos' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center">
              <ShoppingBag size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Módulo de Pedidos en Construcción</h3>
              <p className="text-gray-500 text-sm max-w-md">Aquí aparecerán todas las compras que realicen los clientes.</p>
            </div>
          )}
          
          {/* ----- PESTAÑA: CONFIGURACIÓN ----- */}
          {activeTab === 'configuracion' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Configuración del Sitio</h2>
                <p className="text-sm text-gray-500 mt-1">Ajustes generales, banners y datos del administrador.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Banners de Inicio</h3>
                  <p className="text-sm text-gray-500 mb-4">Agrega o quita las imágenes promocionales que se muestran en el carrusel de la página principal.</p>
                  <button onClick={() => setIsBannerModalOpen(true)} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-sm font-semibold text-[#e60000] transition-colors">
                    <ImageIcon size={18} /> Gestionar Banners
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Datos y Soporte Técnico</h3>
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Administrador del Sistema</h4>
                    <p className="font-semibold text-gray-800">Muebles Ilusión</p>
                    <p className="text-sm text-gray-600">Alberdi 314, Las Heras, Santa Cruz</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-xs font-bold text-[#e60000] uppercase tracking-wider mb-2">Desarrollador / Soporte</h4>
                    <p className="font-bold text-gray-900">Agustin N, Peralta</p>
                    <p className="text-sm text-gray-600 mb-3">Full Stack Web Developer</p>
                    <a href="https://wa.me/5493541336420" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors">
                       WhatsApp: 3541336420
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----- MODALES ----- */}

          {/* MODAL: GESTIÓN DE BANNERS */}
          {isBannerModalOpen && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><ImageIcon size={20} className="text-[#e60000]"/> Gestionar Banners Principales</h3>
                  <button onClick={() => setIsBannerModalOpen(false)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                  {/* Formulario para agregar banner */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <h4 className="text-sm font-bold text-gray-800 mb-3">Agregar nuevo banner</h4>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Subir desde PC</label>
                        <input type="file" accept="image/*" ref={bannerFileInputRef} onChange={e => setNuevoBannerArchivo(e.target.files?.[0] || null)} className="hidden" />
                        <button type="button" onClick={() => bannerFileInputRef.current?.click()} className="w-full py-2.5 border border-gray-300 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-100 flex justify-center gap-2 items-center transition-colors">
                          <Upload size={18} /> {nuevoBannerArchivo ? nuevoBannerArchivo.name : 'Seleccionar Archivo'}
                        </button>
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">O pegar enlace directo (URL)</label>
                        <input type="url" value={nuevoBannerUrl} onChange={e => setNuevoBannerUrl(e.target.value)} placeholder="https://..." className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#e60000] bg-white" />
                      </div>
                      <button type="button" onClick={handleGuardarBanner} disabled={cargandoBanners || (!nuevoBannerArchivo && !nuevoBannerUrl.trim())} className="px-5 py-2.5 bg-[#e60000] text-white rounded-lg font-bold text-sm disabled:opacity-50 flex items-center gap-2 justify-center w-full md:w-auto hover:bg-red-700 transition-colors">
                        {cargandoBanners ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Agregar
                      </button>
                    </div>
                  </div>

                  {/* Lista de banners activos */}
                  <h4 className="text-sm font-bold text-gray-800 mb-3">Banners Activos ({banners.length})</h4>
                  {banners.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">No hay banners cargados actualmente.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {banners.map((banner) => (
                        <div key={banner.id} className="relative group border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                          <div className="relative w-full h-32 bg-gray-100">
                            <Image src={banner.imagen_url} alt="Banner Promocional" fill className="object-cover" unoptimized={banner.imagen_url.includes('http')} />
                          </div>
                          <button onClick={() => handleEliminarBanner(banner.id, banner.imagen_url)} className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur text-gray-500 hover:text-red-600 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50" title="Eliminar Banner">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                  <button onClick={() => setIsBannerModalOpen(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">Cerrar</button>
                </div>
              </div>
            </div>
          )}
          
          {/* MODAL: AJUSTE MASIVO DE PRECIOS */}
          {isAjusteModalOpen && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Calculator size={20} className="text-[#e60000]"/> Ajuste Masivo</h3>
                  <button onClick={() => setIsAjusteModalOpen(false)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600 mb-4">Se modificará el precio de <strong className="text-gray-900">{seleccionados.length} productos</strong>.</p>
                  <div className="flex gap-4 mb-4">
                    <label className="flex-1 flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50"><input type="radio" checked={tipoAjuste === 'aumento'} onChange={() => setTipoAjuste('aumento')} className="accent-[#e60000]" /><span className="text-sm font-bold text-gray-800">Aumentar (+)</span></label>
                    <label className="flex-1 flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50"><input type="radio" checked={tipoAjuste === 'descuento'} onChange={() => setTipoAjuste('descuento')} className="accent-[#e60000]" /><span className="text-sm font-bold text-gray-800">Descontar (-)</span></label>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Porcentaje de ajuste (%) *</label>
                    <input type="number" value={porcentajeAjuste} onChange={e => setPorcentajeAjuste(e.target.value)} placeholder="Ej: 15" className="w-full border rounded-lg p-3 text-lg font-bold outline-none focus:border-[#e60000]" />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                  <button onClick={() => setIsAjusteModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-600">Cancelar</button>
                  <button onClick={handleAplicarAjusteMasivo} disabled={cargando} className="bg-[#e60000] text-white px-6 py-2 rounded-lg text-sm font-bold">{cargando ? 'Aplicando...' : 'Aplicar'}</button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL: FORMULARIO DE PRODUCTOS COMPLETAMENTE RESTAURADO */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                  <h3 className="text-lg font-bold text-gray-900">{productoEditando ? '✏️ Editar Producto' : 'Agregar Nuevo Producto'}</h3>
                  <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-gray-400 hover:text-gray-700 p-1"><X size={20} /></button>
                </div>

                <div className="p-6 overflow-y-auto flex-grow bg-gray-50/50">
                  <form id="form-producto" onSubmit={handleGuardarProducto} className="space-y-8">
                    
                    {/* 1. TÍTULO Y CLASIFICACIÓN */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="text-sm font-bold text-[#e60000] mb-4 uppercase tracking-wider">1. Identificación del Producto</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Título del Producto *</label>
                          <input required type="text" value={titulo} onChange={e => setTitulo(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#e60000]" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-700">Categoría Principal *</label>
                          <select required value={categoria} onChange={e => {setCategoria(e.target.value); setSubcategoria('');}} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#e60000]">
                            <option value="">Seleccionar...</option>
                            {categoriasExistentes.map(c => <option key={c} value={c}>{c}</option>)}
                            <option value="NUEVA" className="font-bold text-[#e60000]">➕ Agregar nueva...</option>
                          </select>
                          {categoria === 'NUEVA' && <input required type="text" placeholder="Nueva categoría" value={nuevaCategoria} onChange={e => setNuevaCategoria(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm border-[#e60000] bg-red-50 outline-none" />}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-700">Subcategoría</label>
                          <select value={subcategoria} onChange={e => setSubcategoria(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#e60000]" disabled={!categoria && categoria !== 'NUEVA'}>
                            <option value="">Seleccionar...</option>
                            {subcategoriasExistentes.map(s => <option key={s} value={s}>{s}</option>)}
                            <option value="NUEVA" className="font-bold text-[#e60000]">➕ Agregar nueva...</option>
                          </select>
                          {subcategoria === 'NUEVA' && <input required type="text" placeholder="Nueva subcategoría" value={nuevaSubcategoria} onChange={e => setNuevaSubcategoria(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm border-[#e60000] bg-red-50 outline-none" />}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-700">Marca</label>
                          <select value={marca} onChange={e => setMarca(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#e60000]">
                            <option value="">Genérica...</option>
                            {marcasExistentes.map(m => <option key={m} value={m}>{m}</option>)}
                            <option value="NUEVA" className="font-bold text-[#e60000]">➕ Agregar nueva...</option>
                          </select>
                          {marca === 'NUEVA' && <input required type="text" placeholder="Nueva marca" value={nuevaMarca} onChange={e => setNuevaMarca(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm border-[#e60000] bg-red-50 outline-none" />}
                        </div>
                      </div>
                    </div>

                    {/* 2. ADMIN Y STOCK PRIVADO (CON CANDADO) */}
                    <div className="bg-gray-100 p-5 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2"><Lock size={16} className="text-blue-600"/> 2. Datos de Administración Privados</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-700">Proveedor / Mayorista</label>
                          <select value={proveedor} onChange={e => setProveedor(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm outline-none bg-white focus:border-blue-500">
                            <option value="">Seleccionar...</option>
                            {proveedoresExistentes.map(p => <option key={p} value={p}>{p}</option>)}
                            <option value="NUEVA" className="font-bold text-blue-600">➕ Nuevo proveedor...</option>
                          </select>
                          {proveedor === 'NUEVA' && <input required type="text" placeholder="Nombre" value={nuevoProveedor} onChange={e => setNuevoProveedor(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm border-blue-500 bg-blue-50 outline-none" />}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1" title="Costo Interno">Precio de Lista ($)</label>
                          <input type="number" value={precioLista} onChange={e => setPrecioLista(e.target.value)} placeholder="Costo interno" className="w-full border rounded-lg p-2.5 text-sm outline-none bg-white focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Cantidad en Stock *</label>
                          <input required type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm outline-none bg-white focus:border-blue-500" />
                        </div>
                      </div>
                    </div>

                    {/* 3. PRECIOS Y VARIANTES (PUBLICOS) */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="text-sm font-bold text-[#e60000] mb-4 uppercase tracking-wider">3. Venta Pública y Variantes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                          <div className="w-1/2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Precio Final de Venta ($) *</label>
                            <input required type="number" value={precio} onChange={e => setPrecio(e.target.value)} className="w-full border rounded-lg p-2.5 text-lg font-bold outline-none focus:border-[#e60000]" />
                          </div>
                          <div className="w-1/2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Precio Tachado (Oferta)</label>
                            <input type="number" value={precioTachado} onChange={e => setPrecioTachado(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#e60000]" placeholder="Opcional" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Colores Disponibles</label>
                          <div className="flex gap-2">
                            <select value={colorInput} onChange={e => setColorInput(e.target.value)} className="flex-1 border rounded-lg p-2.5 text-sm outline-none focus:border-[#e60000]">
                              <option value="">Seleccionar color...</option>
                              {coloresExistentes.map(c => <option key={c} value={c}>{c}</option>)}
                              <option value="NUEVO" className="font-bold text-[#e60000]">➕ Escribir nuevo...</option>
                            </select>
                            <button type="button" onClick={agregarColor} className="px-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">Agregar</button>
                          </div>
                          {colorInput === 'NUEVO' && <input type="text" placeholder="Ej: Roble" value={nuevoColor} onChange={e => setNuevoColor(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm border-[#e60000] bg-red-50 mt-2 outline-none" />}
                          {coloresSeleccionados.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {coloresSeleccionados.map(col => (
                                <span key={col} className="bg-gray-100 border border-gray-300 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                                  {col} <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => quitarColor(col)} />
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 4. BENEFICIOS Y DESTACADOS */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="text-sm font-bold text-[#e60000] mb-4 uppercase tracking-wider">4. Beneficios y Logística</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"><input type="checkbox" checked={cuotas} onChange={e => setCuotas(e.target.checked)} className="w-5 h-5 accent-[#e60000]" /> <span className="text-sm font-medium text-gray-800">3 Cuotas sin interés</span></label>
                        <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"><input type="checkbox" checked={envioGratis} onChange={e => setEnvioGratis(e.target.checked)} className="w-5 h-5 accent-[#e60000]" /> <span className="text-sm font-medium text-gray-800">Envío Gratis (General)</span></label>
                        <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"><input type="checkbox" checked={envioGratisLasHeras} onChange={e => setEnvioGratisLasHeras(e.target.checked)} className="w-5 h-5 accent-[#e60000]" /> <span className="text-sm font-medium text-gray-800">Envío Gratis Las Heras</span></label>
                        <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"><input type="checkbox" checked={retiroSucursal} onChange={e => setRetiroSucursal(e.target.checked)} className="w-5 h-5 accent-[#e60000]" /> <span className="text-sm font-medium text-gray-800">Retiro en Sucursal</span></label>
                        
                        {/* Nuevo check para Destacado */}
                        <label className="flex items-center gap-3 p-3 border border-yellow-300 bg-yellow-50 rounded-lg hover:bg-yellow-100 col-span-1 sm:col-span-2 mt-2">
                          <input type="checkbox" checked={destacado} onChange={e => setDestacado(e.target.checked)} className="w-5 h-5 accent-yellow-600" /> 
                          <div>
                            <span className="text-sm font-bold text-yellow-900 block">Destacar en Inicio (Ofertas)</span>
                            <span className="text-xs text-yellow-700">El producto aparecerá en el carrusel de Ofertas Destacadas en la página principal.</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* 5. MULTIMEDIA Y DESCRIPCION */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="text-sm font-bold text-[#e60000] mb-4 uppercase tracking-wider">5. Detalles y Galería</h4>
                      
                      <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción del Producto</label>
                        <textarea rows={4} value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#e60000]" placeholder="Medidas, materiales, cuidados..."></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Galería de Imágenes (Primera imagen será la principal)</label>
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                          <div className="flex-1">
                            <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                              <Upload size={18} className="text-gray-400"/> Subir fotos desde la PC
                            </button>
                          </div>
                          <div className="flex-1 flex gap-2">
                            <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="Pegar URL de internet..." className="w-full border rounded-lg p-2.5 text-sm outline-none focus:border-[#e60000]"/>
                            <button type="button" onClick={agregarUrlImagen} className="px-4 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">Agregar</button>
                          </div>
                        </div>

                        {(archivosImagen.length > 0 || urlsImagen.length > 0) && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            {urlsImagen.map((url, i) => (
                              <div key={`url-${i}`} className="relative h-28 border border-gray-300 rounded-lg bg-white flex items-center justify-center group overflow-hidden shadow-sm">
                                <Image src={url} alt="Preview URL" fill className="object-contain" unoptimized />
                                <button type="button" onClick={() => eliminarImagen(i, 'url')} className="absolute top-1 right-1 bg-white rounded-full p-1.5 shadow-md text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                                {i === 0 && archivosImagen.length === 0 && <span className="absolute bottom-0 left-0 right-0 bg-[#e60000] text-white text-[10px] text-center font-bold py-1">PRINCIPAL</span>}
                              </div>
                            ))}
                            {archivosImagen.map((file, i) => (
                              <div key={`file-${i}`} className="relative h-28 border border-gray-300 rounded-lg bg-white flex items-center justify-center group overflow-hidden shadow-sm">
                                <Image src={URL.createObjectURL(file)} alt="Preview File" fill className="object-contain" />
                                <button type="button" onClick={() => eliminarImagen(i, 'archivo')} className="absolute top-1 right-1 bg-white rounded-full p-1.5 shadow-md text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                                {i === 0 && urlsImagen.length === 0 && <span className="absolute bottom-0 left-0 right-0 bg-[#e60000] text-white text-[10px] text-center font-bold py-1">PRINCIPAL</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-white rounded-b-xl flex justify-end gap-3 shadow-t">
                  <button onClick={() => { setIsModalOpen(false); resetForm(); }} type="button" className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">Cancelar</button>
                  <button form="form-producto" type="submit" disabled={cargando} className="px-5 py-2.5 bg-[#e60000] hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                    {cargando ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />} {productoEditando ? 'Actualizar Producto' : 'Guardar Producto'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}