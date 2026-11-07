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

interface BannerDB {
  id: string;
  imagen_url: string;
  ubicacion?: string;
}

export function BannerSlider({ ubicacion = 'superior' }: { ubicacion?: 'superior' | 'inferior' }) {
  const [banners, setBanners] = useState<{ id: string | number, src: string, alt: string, link: string }[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchBanners = async () => {
      // Filtrar por ubicación (superior o inferior)
      const { data, error } = await supabase.from('banners').select('*').eq('ubicacion', ubicacion).order('created_at', { ascending: false });
      
      // Manejar el caso donde la columna 'ubicacion' no exista todavía o haya error
      let filteredData = data;
      if (error && error.code === '42703') { // Columna no existe
        console.warn("La columna 'ubicacion' no existe en la tabla banners. Mostrando todos los banners arriba.");
        const fallbackQuery = await supabase.from('banners').select('*').order('created_at', { ascending: false });
        if(ubicacion === 'superior') filteredData = fallbackQuery.data;
        else filteredData = [];
      }

      if (filteredData && filteredData.length > 0) {
        const bannersFormat = filteredData.map((b: BannerDB) => ({
          id: b.id,
          src: b.imagen_url,
          alt: "Banner Promocional",
          link: "/catalogo"
        }));
        setBanners(bannersFormat);
      } else {
        // Fallbacks por defecto si no hay nada en la BD para esa ubicación
        if (ubicacion === 'superior') {
          setBanners([
            { id: 1, src: "/banner-ofertas.png", alt: "Ofertas Increíbles", link: "/catalogo" },
            { id: 2, src: "/Especial-Placares.png", alt: "Especial Placares", link: "/catalogo?cat=Placares" }
          ]);
        } else {
           setBanners([{ id: 3, src: "/banner-taurus.png", alt: "Colchones Taurus", link: "/catalogo?cat=Colchones" }]);
        }
      }
    };
    fetchBanners();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ubicacion]);

  if (banners.length === 0) return <div className="w-full h-full bg-gray-100 flex items-center justify-center animate-pulse">Cargando banners...</div>;

  return (
   <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      pagination={{ clickable: true }}
      navigation={banners.length > 1}
      autoplay={{ delay: 5000 }}
      className="w-full h-full"
    >
      {banners.map((ban, index) => (
        <SwiperSlide key={ban.id} className="relative w-full h-full bg-white flex items-center justify-center overflow-hidden">
          <Link href={ban.link} className="relative w-full h-full block">
            <Image 
              src={ban.src} 
              alt={ban.alt} 
              fill 
              sizes="100vw" 
              className={ubicacion === 'superior' ? "object-contain md:object-cover" : "object-cover"} 
              priority={index === 0} 
              unoptimized={ban.src.includes('http')} 
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export function ProductosSlider({ tipo, categoriaFiltro }: { tipo: 'ofertas' | 'nuevos' | 'categoria', categoriaFiltro?: string }) {
  const [productos, setProductos] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchProductos = async () => {
      if (tipo === 'ofertas') {
        const { data } = await supabase.from('productos').select('*').eq('destacado', true).order('created_at', { ascending: false }).limit(8);
        if (data) setProductos(data);
      } else if (tipo === 'categoria' && categoriaFiltro) {
        // ILIKE ignora mayúsculas/minúsculas para evitar problemas de tipeo
        const { data } = await supabase.from('productos').select('*').ilike('categoria', `%${categoriaFiltro}%`).order('created_at', { ascending: false }).limit(8);
        if (data) setProductos(data);
      } else {
        const { data } = await supabase.from('productos').select('*').order('created_at', { ascending: false }).limit(8);
        if (data) setProductos(data);
      }
    };
    fetchProductos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, categoriaFiltro]);

  if (productos.length === 0) return <p className="text-gray-500 text-sm py-4 px-4 border-2 border-dashed rounded-lg border-gray-200 text-center mx-4 my-2">Todavía no hay productos para mostrar en esta sección.</p>;

  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{ 480: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
      className="pb-4 px-1"
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