'use client'
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';

export function BannerSlider() {
const banners = [
    { id: 1, src: "/banner-ofertas.png", alt: "Ofertas Increíbles", link: "/catalogo" },
    { id: 2, src: "/Especial-Placares.png", alt: "Especial Placares", link: "/catalogo?cat=Placares" },
    { id: 3, src: "/banner-taurus.png", alt: "Colchones Taurus", link: "/catalogo?cat=Colchones" },
  ];
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      pagination={{ clickable: true }}
      navigation
      autoplay={{ delay: 5000 }}
      className="w-full h-full"
    >
      {banners.map((ban) => (
        <SwiperSlide key={ban.id} className="relative w-full h-full bg-white flex items-center justify-center">
          <Link href={ban.link} className="relative w-full h-full block">
            <Image src={ban.src} alt={ban.alt} fill sizes="100vw" className="object-cover" priority={ban.id === 1} />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export function ProductosSlider({ tipo }: { tipo: 'ofertas' | 'nuevos' }) {
  const [productos, setProductos] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchProductos = async () => {
      // Traemos los últimos 8 productos cargados
      const { data } = await supabase.from('productos').select('*').order('created_at', { ascending: false }).limit(8);
      if (data) setProductos(data);
    };
    fetchProductos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{ 480: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
      className="pb-4"
    >
      {productos.map((prod) => (
        <SwiperSlide key={prod.id}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col h-full overflow-hidden">
            <div className="relative w-full h-48 bg-gray-50 flex items-center justify-center p-4">
               {tipo === 'ofertas' && prod.precio_lista && prod.precio_lista > prod.precio && (
                 <span className="absolute top-2 left-2 bg-[#e60000] text-white text-[10px] font-bold px-2 py-1 rounded-sm z-10">OFERTA</span>
               )}
               <div className="w-full h-full relative">
                 <Image src={prod.imagen || "/vestidor.png"} alt={prod.titulo} fill className="object-contain" sizes="(max-width: 768px) 100vw, 300px" />
               </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{prod.marca || 'Muebles Ilusión'}</div>
              <h3 className="font-medium text-gray-800 text-sm line-clamp-2 min-h-[2.5rem] mb-2">{prod.titulo}</h3>
              <div className="mt-auto">
                {prod.precio_lista && prod.precio_lista > prod.precio && (
                   <p className="text-xs text-gray-400 line-through">${Number(prod.precio_lista).toLocaleString('es-AR')}</p>
                )}
                <p className="text-xl font-bold text-gray-900">${Number(prod.precio).toLocaleString('es-AR')}</p>
                <p className="text-xs text-green-600 font-medium mb-3">
                  {prod.cuotas ? '3 cuotas sin interés' : 'Consultar financiación'}
                </p>
                <Link href={`/producto/${prod.id}`} className="block w-full text-center bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#e60000] transition-colors">
                  Ver Detalles
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}