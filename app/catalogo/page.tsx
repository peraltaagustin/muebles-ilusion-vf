'use client'
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Truck, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase';

const BannerSlider = dynamic(() => import('@/components/ClientCarousel').then((mod) => mod.BannerSlider), { ssr: false });

export default function CatalogoPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const supabase = createClient();

  // Estados de los filtros
  const [busqueda, setBusqueda] = useState('');
  const [catSeleccionada, setCatSeleccionada] = useState('Todas');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('Todas');
  const [colorSeleccionado, setColorSeleccionado] = useState('Todos');
  const [soloEnvioGratis, setSoloEnvioGratis] = useState(false);
  const [soloCuotas, setSoloCuotas] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      const { data } = await supabase.from('productos').select('*').order('created_at', { ascending: false });
      if (data) setProductos(data);
      setCargando(false);
    };
    fetchProductos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generar listas únicas para los selectores a partir de los datos reales
  const categorias = ['Todas', ...Array.from(new Set(productos.map(p => p.categoria).filter(Boolean)))];
  const marcas = ['Todas', ...Array.from(new Set(productos.map(p => p.marca).filter(Boolean)))];
  // Simplificamos los colores asumiendo que el texto guardado sea simple por ahora
  const colores = ['Todos', ...Array.from(new Set(productos.map(p => p.colores).filter(Boolean)))];

  const productosFiltrados = useMemo(() => {
    return productos.filter(prod => {
      const coincideBusqueda = prod.titulo.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCat = catSeleccionada === 'Todas' || prod.categoria === catSeleccionada;
      const coincideMarca = marcaSeleccionada === 'Todas' || prod.marca === marcaSeleccionada;
      const coincideColor = colorSeleccionado === 'Todos' || (prod.colores && prod.colores.includes(colorSeleccionado));
      const coincideEnvio = !soloEnvioGratis || prod.envio_gratis;
      const coincideCuotas = !soloCuotas || prod.cuotas;

      return coincideBusqueda && coincideCat && coincideMarca && coincideColor && coincideEnvio && coincideCuotas;
    });
  }, [productos, busqueda, catSeleccionada, marcaSeleccionada, colorSeleccionado, soloEnvioGratis, soloCuotas]);

  return (
    <main className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <header className="bg-white border-b py-4 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="Muebles Ilusión" width={150} height={50} className="object-contain" priority />
          </Link>
          <div className="flex gap-4">
             <Link href="/" className="text-gray-600 hover:text-[#e60000] font-semibold text-sm">Volver al Inicio</Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-6 w-full h-[150px] md:h-[250px]">
        <BannerSlider />
      </section>

      <div className="max-w-7xl mx-auto px-4 py-4 w-full flex flex-col md:flex-row gap-8">
        
        <aside className="w-full md:w-64 flex-shrink-0 bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <Filter size={20} className="text-[#e60000]" />
            <h2 className="text-lg font-bold text-gray-800">Filtros</h2>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Categoría</h3>
            <div className="flex flex-col gap-2">
              {categorias.map(cat => (
                <button 
                  key={cat} onClick={() => setCatSeleccionada(cat)}
                  className={`text-left text-sm px-2 py-1.5 rounded-md transition-colors ${catSeleccionada === cat ? 'bg-red-50 text-[#e60000] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Marca</h3>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 outline-none" value={marcaSeleccionada} onChange={(e) => setMarcaSeleccionada(e.target.value)}>
              {marcas.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="mb-2">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Beneficios</h3>
            <label className="flex items-center gap-3 mb-3 cursor-pointer group">
              <input type="checkbox" checked={soloEnvioGratis} onChange={() => setSoloEnvioGratis(!soloEnvioGratis)} className="w-4 h-4 text-[#e60000] accent-[#e60000] rounded" />
              <span className="text-sm text-gray-600 flex items-center gap-2"><Truck size={16} className="text-green-600"/> Envío Gratis</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={soloCuotas} onChange={() => setSoloCuotas(!soloCuotas)} className="w-4 h-4 text-[#e60000] accent-[#e60000] rounded" />
              <span className="text-sm text-gray-600 flex items-center gap-2"><CreditCard size={16} className="text-blue-600"/> 3 Cuotas sin interés</span>
            </label>
          </div>
        </aside>

        <section className="flex-1">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm text-gray-500 font-medium">
              Mostrando <strong className="text-gray-900">{productosFiltrados.length}</strong> productos
            </span>
            <div className="relative w-full sm:w-72">
              <input type="text" placeholder="Buscar por nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full border border-gray-300 rounded-full py-2 px-4 pr-10 text-sm outline-none focus:border-[#e60000]" />
              <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {cargando ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-[#e60000]" size={40} />
            </div>
          ) : productosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosFiltrados.map((prod) => (
                <div key={prod.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col h-full overflow-hidden">
                  <div className="relative w-full h-48 bg-gray-50 flex items-center justify-center p-4">
                    <div className="w-full h-full relative">
                      <Image src={prod.imagen || "/vestidor.png"} alt={prod.titulo} fill className="object-contain" />
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{prod.marca || 'Muebles Ilusión'}</div>
                    <h3 className="font-medium text-gray-800 text-sm line-clamp-2 min-h-[2.5rem] mb-2">{prod.titulo}</h3>
                    
                    <div className="mt-auto">
                      <p className="text-xl font-bold text-gray-900">${Number(prod.precio).toLocaleString('es-AR')}</p>
                      <div className="min-h-[2rem] mt-1 flex flex-col gap-1">
                        {prod.cuotas && <p className="text-xs text-blue-600 font-bold">Mismo precio en 3 cuotas</p>}
                        {prod.envio_gratis && <p className="text-xs text-green-600 font-bold">Llega gratis a tu domicilio</p>}
                      </div>
                      <Link href={`/producto/${prod.id}`} className="mt-3 flex items-center justify-center gap-2 w-full bg-white border border-[#e60000] text-[#e60000] py-2.5 rounded-lg text-sm font-bold hover:bg-[#e60000] hover:text-white transition-colors">
                        Ver Detalles <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center flex flex-col items-center">
              <Search size={48} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No encontramos resultados</h3>
              <p className="text-gray-500 text-sm">Intenta ajustar los filtros o buscar con otras palabras.</p>
              <button onClick={() => { setBusqueda(''); setCatSeleccionada('Todas'); setMarcaSeleccionada('Todas'); setColorSeleccionado('Todos'); setSoloEnvioGratis(false); setSoloCuotas(false); }} className="mt-6 bg-[#e60000] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition">
                Limpiar Filtros
              </button>
            </div>
          )}
        </section>
      </div>
      <div className="flex-grow"></div>
      <Footer />
    </main>
  );
}