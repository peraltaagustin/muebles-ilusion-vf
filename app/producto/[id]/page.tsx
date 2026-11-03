'use client'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Truck, ShieldCheck, Trophy, CreditCard, Store, ChevronRight, Search, User, ShoppingCart, Loader2, MapPin, Wallet, Landmark, CheckCircle2 } from 'lucide-react';
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
  
  // Estado para la galería de imágenes
  const [imagenActiva, setImagenActiva] = useState('');
  const [todasLasImagenes, setTodasLasImagenes] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducto = async () => {
      const { data } = await supabase.from('productos').select('*').eq('id', params.id).single();
      if (data) {
        setProducto(data);
        
        // Manejo de Colores
        if (data.colores) {
          const arrColores = data.colores.split(',').map((c: string) => c.trim()).filter(Boolean);
          if (arrColores.length > 0) setColorSeleccionado(arrColores[0]);
        }

        // Manejo de la Galería de Imágenes
        let imagenesCargadas: string[] = [];
        if (data.imagenes && data.imagenes.length > 0) {
          imagenesCargadas = data.imagenes;
        } else if (data.imagen) {
          imagenesCargadas = [data.imagen];
        } else {
          imagenesCargadas = ["/vestidor.png"];
        }
        
        setTodasLasImagenes(imagenesCargadas);
        setImagenActiva(imagenesCargadas[0]);
      }
      setCargando(false);
    };
    if (params.id) fetchProducto();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const contactarWhatsApp = () => {
    if (!producto) return;
    const numero = "5493541336420";
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

  if (cargando) return <div className="min-h-screen flex items-center justify-center bg-[#ebebeb]"><Loader2 className="animate-spin text-[#e60000]" size={48} /></div>;
  if (!producto) return <div className="min-h-screen flex flex-col items-center justify-center bg-[#ebebeb] gap-4"><h1 className="text-2xl font-bold">Producto no encontrado</h1><Link href="/catalogo" className="text-[#e60000] hover:underline font-medium">Volver al catálogo</Link></div>;

  const listaColores = producto.colores ? producto.colores.split(',').map((c: string) => c.trim()).filter(Boolean) : [];
  const tieneStock = producto.stock > 0;

  return (
    <main className="min-h-screen bg-[#ebebeb] flex flex-col">
      {/* HEADER */}
      <header className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-6">
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-40 h-12">
               <Image src="/logo.png" alt="Muebles Ilusión" fill sizes="160px" className="object-contain" priority />
            </div>
          </Link>
          <div className="flex-grow max-w-2xl mx-auto order-3 md:order-2 w-full md:w-auto hidden md:block">
            <div className="relative flex items-center w-full h-12 rounded-full border border-gray-300 bg-white overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-[#e60000]">
              <Search className="text-gray-400 ml-4" size={20} />
              <input type="text" placeholder="Buscar productos, marcas y más..." className="w-full h-full bg-transparent text-gray-700 px-3 outline-none text-sm" />
            </div>
          </div>
          <div className="flex gap-6 text-gray-700 order-2 md:order-3">
            <Link href="/cuenta" className="flex flex-col items-center hover:text-[#e60000] transition-colors"><User size={24} strokeWidth={1.5} /><span className="text-[11px] mt-1 font-semibold">Mi Cuenta</span></Link>
            <Link href="/carrito" className="flex flex-col items-center hover:text-[#e60000] transition-colors relative">
              <ShoppingCart size={24} strokeWidth={1.5} /><span className="text-[11px] mt-1 font-semibold">Carrito</span>
              {totalItems > 0 && <span className="absolute -top-1 -right-2 bg-[#e60000] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{totalItems}</span>}
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-4">
        {/* MIGAS DE PAN */}
        <div className="max-w-6xl mx-auto px-4 w-full mb-4 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#e60000] transition">Inicio</Link> <ChevronRight size={14} />
          <Link href={`/catalogo?cat=${producto.categoria}`} className="hover:text-[#e60000] transition">{producto.categoria}</Link> <ChevronRight size={14} />
          <span className="text-gray-800 font-medium truncate">{producto.titulo}</span>
        </div>

        <div className="max-w-6xl mx-auto px-4 w-full flex-grow">
          <div className="bg-white rounded-md shadow-sm flex flex-col md:flex-row p-4 md:p-6 gap-8">
            
            {/* IZQUIERDA: GALERÍA Y DESCRIPCIÓN */}
            <div className="w-full md:w-[60%] flex flex-col gap-8">
              
              {/* Galería de Imágenes */}
              <div className="flex flex-col-reverse md:flex-row gap-4 h-auto md:h-[500px]">
                {/* Miniaturas */}
                <div className="flex md:flex-col gap-2 overflow-auto hide-scrollbar w-full md:w-20 flex-shrink-0">
                  {todasLasImagenes.map((img, idx) => (
                    <div 
                      key={idx} 
                      onMouseEnter={() => setImagenActiva(img)}
                      onClick={() => setImagenActiva(img)}
                      className={`relative w-16 h-16 md:w-full md:h-20 rounded-md border-2 overflow-hidden cursor-pointer flex-shrink-0 transition-all ${imagenActiva === img ? 'border-[#e60000]' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <Image src={img} alt={`Miniatura ${idx}`} fill className="object-contain bg-white" sizes="80px" />
                    </div>
                  ))}
                </div>
                {/* Imagen Principal */}
                <div className="relative w-full h-[300px] md:h-full flex-grow bg-white flex items-center justify-center rounded-lg border border-gray-100">
                  <Image src={imagenActiva} alt={producto.titulo} fill className="object-contain p-2" priority sizes="(max-width: 768px) 100vw, 800px" />
                </div>
              </div>

              {/* Descripción (En desktop se ve abajo de la imagen) */}
              <div className="hidden md:block border-t border-gray-200 pt-8 mt-4">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Descripción</h2>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {producto.descripcion ? producto.descripcion : 'No hay descripción disponible para este producto.'}
                </div>
              </div>
            </div>

            {/* DERECHA: PANEL DE COMPRA */}
            <div className="w-full md:w-[40%] flex flex-col">
              <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">{producto.marca || 'Genérica'}</p>
              <h1 className="text-[22px] font-semibold text-gray-900 leading-tight mb-4">{producto.titulo}</h1>
              
              {/* Precios */}
              <div className="mb-6">
                {producto.precio_tachado && producto.precio_tachado > producto.precio && (
                  <p className="text-gray-500 line-through text-sm">${Number(producto.precio_tachado).toLocaleString('es-AR')}</p>
                )}
                <div className="flex items-center gap-3">
                  <p className="text-4xl font-light text-gray-900">${Number(producto.precio).toLocaleString('es-AR')}</p>
                </div>
              </div>

              {/* Medios de Pago */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Medios de Pago Aceptados</h3>
                <div className="flex flex-col gap-2.5">
                  {producto.cuotas && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CreditCard size={18} className="text-green-600 flex-shrink-0" /> <span className="font-medium">3 Cuotas sin interés</span> con Tarjetas
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Wallet size={18} className="text-[#e60000] flex-shrink-0" /> Crédito Crediario (Aprobación local)
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Landmark size={18} className="text-blue-600 flex-shrink-0" /> Plan SOEM (Beneficio municipal)
                  </div>
                </div>
              </div>

              {/* Opciones de Envío / Retiro */}
              <div className="flex flex-col gap-3 mb-6 border-b border-gray-100 pb-6">
                {producto.envio_gratis && (
                  <div className="flex gap-3 items-center text-sm text-green-600 font-medium">
                    <Truck size={20} className="flex-shrink-0" /> Envío gratis (General)
                  </div>
                )}
                {producto.envio_gratis_las_heras && (
                  <div className="flex gap-3 items-center text-sm text-green-600 font-medium">
                    <MapPin size={20} className="flex-shrink-0" /> Envío gratis en Las Heras
                  </div>
                )}
                {producto.retiro_sucursal && (
                  <div className="flex gap-3 items-start text-sm text-gray-700 font-medium">
                    <Store size={20} className="flex-shrink-0 text-green-600" /> 
                    <div>
                      <p className="text-green-600">Retiro gratis en sucursal</p>
                      <p className="text-xs text-gray-500 font-normal mt-0.5">Calle Alberdi 314, Las Heras</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Selector de Colores */}
              {listaColores.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Color: <span className="font-normal">{colorSeleccionado}</span></p>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {listaColores.map((color: string) => (
                      <button 
                        key={color} onClick={() => setColorSeleccionado(color)}
                        className={`px-4 py-2 text-sm rounded border transition-all ${colorSeleccionado === color ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold ring-2 ring-blue-500/20' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                  {/* Mensaje de disponibilidad del color */}
                  {tieneStock ? (
                     <p className="text-xs font-semibold text-green-600 flex items-center gap-1"><CheckCircle2 size={14}/> Disponible en color {colorSeleccionado}</p>
                  ) : (
                     <p className="text-xs font-semibold text-red-600">Color {colorSeleccionado} temporalmente sin stock</p>
                  )}
                </div>
              )}

              {/* Botones de Compra y Estado del Stock */}
              <div className="flex flex-col gap-3 mb-6 mt-auto">
                <p className={`text-sm font-bold mb-1 ${tieneStock ? 'text-gray-900' : 'text-red-600'}`}>
                  {tieneStock ? '¡Stock disponible!' : 'Producto sin stock'}
                </p>
                
                <button onClick={handleComprarAhora} disabled={!tieneStock} className="w-full bg-[#3483fa] hover:bg-[#2968c8] disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-3.5 rounded-lg font-semibold text-base transition-colors shadow-sm">
                  Comprar ahora
                </button>
                <button onClick={handleAgregarCarrito} disabled={!tieneStock} className={`w-full py-3.5 rounded-lg font-semibold text-base transition-all ${agregado ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-[#e3edfb] hover:bg-[#d0e3fc] disabled:bg-gray-100 disabled:text-gray-400 text-[#3483fa]'}`}>
                  {agregado ? '¡Agregado al carrito!' : 'Agregar al carrito'}
                </button>
                
                {tieneStock && (
                  <button onClick={contactarWhatsApp} className="w-full mt-2 text-center text-sm font-medium text-gray-500 hover:text-green-600 transition-colors">
                    ¿Dudas? Consultar por WhatsApp
                  </button>
                )}
              </div>

              {/* Garantías */}
              <div className="flex flex-col gap-4 border-t border-gray-200 pt-6">
                <div className="flex gap-3 items-start text-sm text-gray-600">
                  <ShieldCheck className="text-gray-400 flex-shrink-0" size={20} />
                  <p><span className="text-blue-500 hover:text-blue-700 cursor-pointer font-medium">Compra Protegida</span>, recibí el producto que esperabas o te devolvemos tu dinero.</p>
                </div>
                <div className="flex gap-3 items-start text-sm text-gray-600">
                  <Trophy className="text-gray-400 flex-shrink-0" size={20} />
                  <p><span className="text-blue-500 hover:text-blue-700 cursor-pointer font-medium">{producto.marca || 'Muebles Ilusión'}</span>, garantía de calidad.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Descripción (Versión Mobile: Se muestra debajo de todo en celulares) */}
          <div className="md:hidden bg-white p-4 mt-4 rounded-md shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Descripción</h2>
            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {producto.descripcion ? producto.descripcion : 'No hay descripción disponible para este producto.'}
            </div>
          </div>
          
          {/* PRODUCTOS SIMILARES */}
          <div className="mt-12 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-6 bg-[#e60000] rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">Quienes vieron este producto también compraron</h2>
            </div>
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