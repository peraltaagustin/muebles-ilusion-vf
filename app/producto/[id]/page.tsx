'use client'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Truck, ShieldCheck, Trophy, CreditCard, Store, ChevronRight, Search, User, ShoppingCart, Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/supabase';

const ProductosSlider = dynamic(() => import('@/components/ClientCarousel').then((mod) => mod.ProductosSlider), { ssr: false });

export default function ProductoPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, totalItems } = useCart();
  const supabase = createClient();
  
  const [producto, setProducto] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  
  const [colorSeleccionado, setColorSeleccionado] = useState('');
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      const { data } = await supabase.from('productos').select('*').eq('id', params.id).single();
      if (data) {
        setProducto(data);
        // Si hay colores guardados separados por coma, seleccionamos el primero por defecto
        if (data.colores) {
          const arrColores = data.colores.split(',').map((c: string) => c.trim());
          if (arrColores.length > 0) setColorSeleccionado(arrColores[0]);
        }
      }
      setCargando(false);
    };
    if (params.id) fetchProducto();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const contactarWhatsApp = () => {
    if (!producto) return;
    const numero = "5492974776203";
    const mensaje = encodeURIComponent(`Hola Muebles Ilusión, me interesa el producto ${producto.titulo} que vi en la página.`);
    window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
  };

  const handleAgregarCarrito = () => {
    if (!producto) return;
    addToCart({
      id: producto.id,
      titulo: producto.titulo,
      precio: Number(producto.precio),
      img: producto.imagen || "/vestidor.png",
      color: colorSeleccionado || 'Único'
    });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  const handleComprarAhora = () => {
    handleAgregarCarrito();
    router.push('/carrito');
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ebebeb]">
        <Loader2 className="animate-spin text-[#e60000]" size={48} />
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#ebebeb] gap-4">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <Link href="/catalogo" className="text-[#e60000] hover:underline font-medium">Volver al catálogo</Link>
      </div>
    );
  }

  // Parsear colores para los botones
  const listaColores = producto.colores ? producto.colores.split(',').map((c: string) => c.trim()) : [];

  return (
    <main className="min-h-screen bg-[#ebebeb] flex flex-col">
      <header className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-6">
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-40 h-12">
               <Image src="/logo.png" alt="Muebles Ilusión" fill sizes="160px" className="object-contain" priority />
            </div>
          </Link>
          
          <div className="flex-grow max-w-2xl mx-auto order-3 md:order-2 w-full md:w-auto hidden md:block">
            <div className="relative flex items-center w-full h-12 rounded-full border border-gray-300 bg-white overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-gray-400">
              <Search className="text-gray-400 ml-4" size={20} />
              <input type="text" placeholder="Buscar productos, marcas y más..." className="w-full h-full bg-transparent text-gray-700 px-3 outline-none text-sm" />
            </div>
          </div>

          <div className="flex gap-6 text-gray-700 order-2 md:order-3">
            <Link href="/cuenta" className="flex flex-col items-center hover:text-[#e60000] transition-colors">
              <User size={24} strokeWidth={1.5} />
              <span className="text-[11px] mt-1 font-semibold">Mi Cuenta</span>
            </Link>
            <Link href="/carrito" className="flex flex-col items-center hover:text-[#e60000] transition-colors relative">
              <ShoppingCart size={24} strokeWidth={1.5} />
              <span className="text-[11px] mt-1 font-semibold">Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#e60000] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-4">
        <div className="max-w-6xl mx-auto px-4 w-full mb-4 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition">Inicio</Link> <ChevronRight size={14} />
          <Link href="/catalogo" className="hover:text-blue-600 transition">Catálogo</Link> <ChevronRight size={14} />
          <span className="text-gray-800 font-medium truncate">{producto.titulo}</span>
        </div>

        <div className="max-w-6xl mx-auto px-4 w-full flex-grow">
          <div className="bg-white rounded-md shadow-sm flex flex-col md:flex-row p-4 md:p-0">
            
            <div className="w-full md:w-2/3 flex flex-col md:flex-row p-4 gap-4 border-r border-gray-100">
              <div className="flex-grow flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
                <div className="relative w-full h-full max-h-[500px]">
                  <Image src={producto.imagen || "/vestidor.png"} alt={producto.titulo} fill className="object-contain" priority sizes="(max-width: 768px) 100vw, 800px" />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/3 p-6 flex flex-col">
              <p className="text-sm text-gray-500 mb-1">Nuevo</p>
              <h1 className="text-[22px] font-semibold text-gray-900 leading-tight mb-4">{producto.titulo}</h1>
              
              <div className="mb-4">
                {producto.precio_lista && producto.precio_lista > producto.precio && (
                  <p className="text-gray-500 line-through text-sm">${Number(producto.precio_lista).toLocaleString('es-AR')}</p>
                )}
                <div className="flex items-center gap-3">
                  <p className="text-4xl font-light text-gray-900">${Number(producto.precio).toLocaleString('es-AR')}</p>
                </div>
                {producto.cuotas && (
                  <p className="text-green-600 text-sm font-medium mt-1">Mismo precio en 3 cuotas de ${(Number(producto.precio) / 3).toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
                )}
              </div>

              {listaColores.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Color: <span className="font-normal">{colorSeleccionado}</span></p>
                  <div className="flex gap-2 flex-wrap">
                    {listaColores.map((color: string) => (
                      <button 
                        key={color}
                        onClick={() => setColorSeleccionado(color)}
                        className={`px-4 py-2 text-sm rounded border transition-colors ${colorSeleccionado === color ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-500' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 mb-6">
                {producto.envio_gratis && (
                  <div className="flex gap-3">
                    <Truck className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-green-600 text-sm font-medium">Llega gratis a tu domicilio</p>
                      <button onClick={contactarWhatsApp} className="text-blue-500 text-xs hover:text-blue-700 mt-1">Acordar envío por WhatsApp</button>
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <Store className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-green-600 text-sm font-medium">Retirar producto en el local</p>
                    <p className="text-gray-500 text-xs mt-1">Calle Alberdi 314, Las Heras</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-8">
                <p className="text-sm font-semibold text-gray-900 mb-1">{producto.stock > 0 ? `¡Stock disponible (${producto.stock})!` : 'Sin stock'}</p>
                
                <button 
                  onClick={handleComprarAhora}
                  disabled={producto.stock <= 0}
                  className="w-full bg-[#3483fa] hover:bg-[#2968c8] disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-3.5 rounded-md font-semibold text-base transition-colors"
                >
                  Comprar ahora
                </button>
                
                <button 
                  onClick={handleAgregarCarrito}
                  disabled={producto.stock <= 0}
                  className={`w-full py-3.5 rounded-md font-semibold text-base transition-all ${
                    agregado 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-[#e3edfb] hover:bg-[#d0e3fc] disabled:bg-gray-100 disabled:text-gray-400 text-[#3483fa]'
                  }`}
                >
                  {agregado ? '¡Agregado al carrito!' : 'Agregar al carrito'}
                </button>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-200 pt-6">
                <div className="flex gap-3 items-start text-sm text-gray-600">
                  <ShieldCheck className="text-gray-400 flex-shrink-0" size={18} />
                  <p><span className="text-blue-500 hover:text-blue-700 cursor-pointer">Compra Protegida</span>, recibí el producto que esperabas o te devolvemos tu dinero.</p>
                </div>
                <div className="flex gap-3 items-start text-sm text-gray-600">
                  <Trophy className="text-gray-400 flex-shrink-0" size={18} />
                  <p><span className="text-blue-500 hover:text-blue-700 cursor-pointer">{producto.marca || 'Muebles Ilusión'}</span>, garantía de calidad.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 mb-4">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Productos similares</h2>
            <div className="bg-transparent">
              <ProductosSlider tipo="nuevos" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow pb-12"></div>
      <Footer />
    </main>
  );
}