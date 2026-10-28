'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';
import { CreditCard, Truck, BedDouble, LayoutPanelLeft } from 'lucide-react';
import Footer from '@/components/Footer';

export default function Home() {
  // Productos de prueba para renderizar el frontend antes de conectar con Supabase
  const ofertas = [
    { id: 1, titulo: "Vestidor Art. 582", precio: 350000, cuotas: "3 cuotas sin interés", img: "/vestidor.jpg" },
    { id: 2, titulo: "Colchón Taurus King", precio: 450000, cuotas: "3 cuotas sin interés", img: "/colchon.jpg" },
    { id: 3, titulo: "Placard Art. 138 6 Puertas", precio: 280000, cuotas: "3 cuotas sin interés", img: "/placard.jpg" },
  ];

  return (
    <main className="min-h-screen bg-ilusion-gray flex flex-col">
      {/* Top Banner Informativo */}
      <div className="bg-ilusion-red text-white text-center py-2 text-sm font-semibold tracking-wide flex justify-center items-center gap-4">
        <CreditCard size={18} />
        HASTA 3 CUOTAS SIN INTERÉS CON TARJETAS SELECCIONADAS
        <Truck size={18} className="ml-4" />
        ENVÍOS A ACORDAR CON EL VENDEDOR
      </div>

      {/* Hero Carousel */}
      <section className="w-full h-[400px] md:h-[500px]">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 5000 }}
          className="w-full h-full"
        >
          <SwiperSlide className="bg-white flex items-center justify-center border-b-4 border-ilusion-red">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-ilusion-black mb-4">ESPECIAL PLACARES</h1>
              <p className="text-xl mb-6 text-gray-600">Renová tu espacio con hasta 30% OFF</p>
              <Link href="/catalogo?cat=placares" className="bg-ilusion-red text-white px-8 py-3 rounded-md font-bold hover:bg-red-700 transition">Ver Modelos</Link>
            </div>
          </SwiperSlide>
          <SwiperSlide className="bg-white flex items-center justify-center border-b-4 border-ilusion-black">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-ilusion-black mb-4">COLCHONES TAURUS</h1>
              <p className="text-xl mb-6 text-gray-600">El descanso que mereces, en 3 cuotas sin interés</p>
              <Link href="/catalogo?cat=colchones" className="bg-ilusion-black text-white px-8 py-3 rounded-md font-bold hover:bg-gray-800 transition">Descubrir</Link>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Categorías Dinámicas */}
      <section className="max-w-7xl mx-auto px-4 py-12 w-full">
        <h2 className="text-2xl font-bold text-ilusion-black mb-8 border-l-4 border-ilusion-red pl-4">Nuestros Fuertes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/catalogo?cat=placares" className="group relative h-48 bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center justify-center transform transition-transform hover:-translate-y-2 hover:shadow-xl border border-gray-200">
            <LayoutPanelLeft size={48} className="text-ilusion-red mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-ilusion-black">PLACARES Y VESTIDORES</h3>
          </Link>
          <Link href="/catalogo?cat=colchones" className="group relative h-48 bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center justify-center transform transition-transform hover:-translate-y-2 hover:shadow-xl border border-gray-200">
            <BedDouble size={48} className="text-ilusion-black mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-ilusion-red">COLCHONES TAURUS</h3>
          </Link>
        </div>
      </section>

      {/* Carrusel de Ofertas Destacadas */}
      <section className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex justify-between items-center mb-6 border-l-4 border-ilusion-red pl-4">
          <h2 className="text-2xl font-bold text-ilusion-black">Ofertas / Nuevos Ingresos</h2>
          <Link href="/catalogo" className="text-ilusion-red font-semibold hover:underline">Ver todo</Link>
        </div>
        
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 }
          }}
          className="pb-4"
        >
          {ofertas.map((prod) => (
            <SwiperSlide key={prod.id}>
              <div className="bg-white p-4 rounded-lg shadow border border-gray-100 hover:shadow-lg transition flex flex-col h-full">
                <div className="h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
                  {/* Aquí irá la imagen de Supabase: <img src={prod.img} alt={prod.titulo} className="object-contain h-full" /> */}
                  [Imagen: {prod.titulo}]
                </div>
                <h3 className="font-semibold text-gray-800 line-clamp-2">{prod.titulo}</h3>
                <div className="mt-auto pt-4">
                  <p className="text-2xl font-bold text-ilusion-black">${prod.precio.toLocaleString('es-AR')}</p>
                  <p className="text-sm text-green-600 font-medium">{prod.cuotas}</p>
                  <Link href={`/producto/${prod.id}`} className="mt-3 block w-full text-center bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition">
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <div className="flex-grow"></div>
      <Footer />
    </main>
  );
}