'use client'
import { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Truck, CreditCard, ChevronRight, Loader2, User, ShoppingCart, Menu, ChevronDown, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

const BannerSlider = dynamic(() => import('@/components/ClientCarousel').then((mod) => mod.BannerSlider), { ssr: false });

function CatalogoContent() {
  const [productos, setProductos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q');
  
  const { totalItems } = useCart();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [busquedaInput, setBusquedaInput] = useState(queryParam || '');

  // Estados de los filtros
  const [busqueda, setBusqueda] = useState(queryParam || '');
  const [catSeleccionada, setCatSeleccionada] = useState('Todas');
  const [subcatSeleccionada, setSubcatSeleccionada] = useState('Todas');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('Todas');
  const [soloEnvioGratis, setSoloEnvioGratis] = useState(false);
  const [soloCuotas, setSoloCuotas] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      const { data } = await supabase.from('productos').select('*').order('created_at', { ascending: false });
      if (data) setProductos(data);
      setCargando(false);
    };
    fetchProductos();
  }, [supabase]);

  useEffect(() => {
    if (queryParam) {
      setBusqueda(queryParam);
      setBusquedaInput(queryParam);
    }
  }, [queryParam]);

  const handleSearchHeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (busquedaInput.trim()) {
      setBusqueda(busquedaInput.trim());
      router.push(`/catalogo?q=${encodeURIComponent(busquedaInput.trim())}`);
    } else {
      setBusqueda('');
      router.push('/catalogo');
    }
  };

  const categorias = ['Todas', ...Array.from(new Set(productos.map(p => p.categoria).filter(Boolean)))];
  const subcategorias = ['Todas', ...Array.from(new Set(productos.filter(p => catSeleccionada === 'Todas' || p.categoria === catSeleccionada).map(p => p.subcategoria).filter(Boolean)))];
  
  // MARCAS FILTRADAS DINÁMICAMENTE POR CATEGORÍA
  const marcas = ['Todas', ...Array.from(new Set(
    productos
      .filter(p => catSeleccionada === 'Todas' || p.categoria === catSeleccionada)
      .map(p => p.marca)
      .filter(Boolean)
  ))];

  const productosFiltrados = useMemo(() => {
    return productos.filter(prod => {
      const coincideBusqueda = prod.titulo.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCat = catSeleccionada === 'Todas' || prod.categoria === catSeleccionada;
      const coincideSubcat = subcatSeleccionada === 'Todas' || prod.subcategoria === subcatSeleccionada;
      const coincideMarca = marcaSeleccionada === 'Todas' || prod.marca === marcaSeleccionada;
      const coincideEnvio = !soloEnvioGratis || prod.envio_gratis;
      const coincideCuotas = !soloCuotas || prod.cuotas;

      return coincideBusqueda && coincideCat && coincideSubcat && coincideMarca && coincideEnvio && coincideCuotas;
    });
  }, [productos, busqueda, catSeleccionada, subcatSeleccionada, marcaSeleccionada, soloEnvioGratis, soloCuotas]);

  const handleCatChange = (cat: string) => {
    setCatSeleccionada(cat);
    setSubcatSeleccionada('Todas');
    setMarcaSeleccionada('Todas'); // Resetear la marca al cambiar categoría
  };

  return (
    <>
      <header className="bg-white py-4 relative z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-6">
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-52 h-16 md:w-56 md:h-18">
               <Image src="/logo.png" alt="Muebles Ilusión" fill sizes="220px" className="object-contain" priority />
            </div>
          </Link>
          
          <div className="flex-grow max-w-2xl mx-auto order-3 md:order-2 w-full md:w-auto">
            <form onSubmit={handleSearchHeader} className="relative flex items-center w-full h-12 rounded-full border border-gray-300 bg-gray-50 overflow-hidden shadow-inner focus-within:bg-white focus-within:ring-2 focus-within:ring-red-200 focus-within:border-[#e60000] transition-all">
              <button type="submit" className="ml-4 text-gray-400 hover:text-[#e60000] transition-colors">
                <Search size={20} />
              </button>
              <input 
                type="text" 
                placeholder="Buscar productos, marcas y más..." 
                value={busquedaInput}
                onChange={(e) => setBusquedaInput(e.target.value)}
                className="w-full h-full bg-transparent text-gray-800 font-medium px-3 outline-none text-sm" 
              />
            </form>
          </div>

          <div className="flex gap-6 text-gray-700 order-2 md:order-3">
            <Link href="/cuenta" className="flex flex-col items-center hover:text-[#e60000] transition-colors group">
              <div className="p-1 rounded-full group-hover:bg-red-50 transition-colors"><User size={24} strokeWidth={1.5} /></div>
              <span className="text-[11px] font-bold mt-1 tracking-wide">Mi Cuenta</span>
            </Link>
            <Link href="/carrito" className="flex flex-col items-center hover:text-[#e60000] transition-colors relative group">
              <div className="p-1 rounded-full group-hover:bg-red-50 transition-colors"><ShoppingCart size={24} strokeWidth={1.5} /></div>
              <span className="text-[11px] font-bold mt-1 tracking-wide">Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 right-0 bg-[#e60000] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b relative z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm font-semibold py-3 overflow-x-auto hide-scrollbar whitespace-nowrap">
          <div className="flex items-center gap-6 text-gray-700">
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 text-[#e60000] hover:text-red-700 transition">
               <Menu size={20} /> Todas las Categorías <ChevronDown size={16} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
             </button>
          </div>
          <Link href="/catalogo?ofertas=true" className="text-[#e60000] font-bold hover:underline ml-6 flex-shrink-0 bg-red-50 px-3 py-1.5 rounded-full">Ofertas 40 Años</Link>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-[#e60000] font-bold mb-4 border-b border-gray-100 pb-2">Dormitorio y Hogar</h4>
                <ul className="space-y-3 text-sm text-gray-600 font-medium">
                  <li><Link onClick={() => setIsMenuOpen(false)} href="/catalogo?cat=Placares" className="hover:text-[#e60000] hover:translate-x-1 transition-transform inline-block">Placares y Vestidores</Link></li>
                  <li><Link onClick={() => setIsMenuOpen(false)} href="/catalogo?cat=Colchones" className="hover:text-[#e60000] hover:translate-x-1 transition-transform inline-block">Colchones y Sommiers</Link></li>
                  <li><Link onClick={() => setIsMenuOpen(false)} href="/catalogo?cat=Camas" className="hover:text-[#e60000] hover:translate-x-1 transition-transform inline-block">Camas y Cuchetas</Link></li>
                  <li><Link onClick={() => setIsMenuOpen(false)} href="/catalogo?cat=Muebles" className="hover:text-[#e60000] hover:translate-x-1 transition-transform inline-block">Juegos de Comedor y Living</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[#e60000] font-bold mb-4 border-b border-gray-100 pb-2">Electrodomésticos</h4>
                <ul className="space-y-3 text-sm text-gray-600 font-medium">
                  <li><Link onClick={() => setIsMenuOpen(false)} href="/catalogo?cat=Climatización" className="hover:text-[#e60000] hover:translate-x-1 transition-transform inline-block">Calefacción y Termotanques</Link></li>
                  <li><Link onClick={() => setIsMenuOpen(false)} href="/catalogo?cat=Electrodomésticos" className="hover:text-[#e60000] hover:translate-x-1 transition-transform inline-block">Cocinas y Lavado</Link></li>
                  <li><Link onClick={() => setIsMenuOpen(false)} href="/catalogo?cat=Electrodomésticos" className="hover:text-[#e60000] hover:translate-x-1 transition-transform inline-block">Pequeños Electrodomésticos</Link></li>
                  <li><Link onClick={() => setIsMenuOpen(false)} href="/catalogo?cat=Cuidado" className="hover:text-[#e60000] hover:translate-x-1 transition-transform inline-block">Cuidado Personal</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[#e60000] font-bold mb-4 border-b border-gray-100 pb-2">Tecnología y Tiempo Libre</h4>
                <ul className="space-y-3 text-sm text-gray-600 font-medium">
                  <li><Link onClick={() => setIsMenuOpen(false)} href="/catalogo?cat=Tecnología" className="hover:text-[#e60000] hover:translate-x-1 transition-transform inline-block">Smart TV y Audio</Link></li>
                  <li><Link onClick={() => setIsMenuOpen(false)} href="/catalogo?cat=Tecnología" className="hover:text-[#e60000] hover:translate-x-1 transition-transform inline-block">Celulares y Notebooks</Link></li>
                  <li><Link onClick={() => setIsMenuOpen(false)} href="/catalogo?cat=Bicicletas" className="hover:text-[#e60000] hover:translate-x-1 transition-transform inline-block">Bicicletas y Fitness</Link></li>
                  <li><Link onClick={() => setIsMenuOpen(false)} href="/catalogo?cat=Camping" className="hover:text-[#e60000] hover:translate-x-1 transition-transform inline-block">Camping y Piletas</Link></li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-4 flex flex-col items-center justify-center text-center border border-red-100 shadow-sm">
                <span className="bg-[#e60000] text-white text-[10px] font-black tracking-wider px-3 py-1 rounded-full mb-3 shadow-sm">DESTACADO</span>
                <h5 className="font-bold text-gray-900 mb-2">Herramientas y Construcción</h5>
                <p className="text-xs text-gray-500 mb-4 font-medium">Todo lo que necesitas para tus proyectos y remodelaciones.</p>
                <Link onClick={() => setIsMenuOpen(false)} href="/catalogo?cat=Herramientas" className="text-sm font-bold text-[#e60000] hover:text-red-700 flex items-center gap-1">Ver productos <ArrowRight size={14}/></Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {isMenuOpen && <div className="absolute inset-0 bg-black/50 z-30 backdrop-blur-sm transition-all" onClick={() => setIsMenuOpen(false)}></div>}

      <section className="w-full h-[25vh] min-h-[200px] sm:h-[35vh] md:h-[45vh] max-h-[400px] relative z-20 shadow-inner mb-10">
        <BannerSlider ubicacion="superior" />
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex flex-col md:flex-row gap-8 relative z-10">
        
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
                  key={cat} onClick={() => handleCatChange(cat)}
                  className={`text-left text-sm px-2 py-1.5 rounded-md transition-colors ${catSeleccionada === cat ? 'bg-red-50 text-[#e60000] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {subcategorias.length > 1 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Subcategoría</h3>
              <select className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 outline-none focus:border-[#e60000]" value={subcatSeleccionada} onChange={(e) => setSubcatSeleccionada(e.target.value)}>
                {subcategorias.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Marca</h3>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 outline-none focus:border-[#e60000]" value={marcaSeleccionada} onChange={(e) => setMarcaSeleccionada(e.target.value)}>
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
              <button onClick={() => { setBusqueda(''); setBusquedaInput(''); router.push('/catalogo'); setCatSeleccionada('Todas'); setSubcatSeleccionada('Todas'); setMarcaSeleccionada('Todas'); setSoloEnvioGratis(false); setSoloCuotas(false); }} className="mt-6 bg-[#e60000] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition">
                Limpiar Filtros
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default function Catalogo() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] flex flex-col relative">
      <Suspense fallback={
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="animate-spin text-[#e60000]" size={40} />
        </div>
      }>
        <CatalogoContent />
      </Suspense>
      <div className="flex-grow"></div>
      <Footer />
    </main>
  );
}