'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';
import Image from 'next/image';

export function CarouselOft() {
  const ofertas = [
    { id: 1, titulo: "Vestidor Art. 582", precio: 350000, cuotas: "3 cuotas sin interés", img: "/vestidor.png" },
    { id: 2, titulo: "Colchón Taurus King", precio: 450000, cuotas: "3 cuotas sin interés", img: "/colchon.png" },
    { id: 3, titulo: "Placard Art. 138 6 Puertas", precio: 280000, cuotas: "3 cuotas sin interés", img: "/placard.png" },
  ];

  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        480: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 3 }
      }}
      className="pb-4"
    >
      {ofertas.map((prod) => (
        <SwiperSlide key={prod.id}>
          <div className="bg-white p-4 rounded-xl shadow border border-gray-100 hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="relative w-full h-48 bg-gray-50 mb-4 flex items-center justify-center rounded-lg overflow-hidden">
               <Image src={prod.img} alt={prod.titulo} fill className="object-contain p-2" />
            </div>
            <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[3rem]">{prod.titulo}</h3>
            <div className="mt-auto pt-3">
              <p className="text-2xl font-bold text-ilusion-red">${prod.precio.toLocaleString('es-AR')}</p>
              <p className="text-xs text-green-600 font-medium mt-1">{prod.cuotas}</p>
              <Link href={`/producto/${prod.id}`} className="mt-4 block w-full text-center bg-white border border-ilusion-red text-ilusion-red py-2 rounded-lg font-bold hover:bg-ilusion-red hover:text-white transition-colors">
                Ver Detalles
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export function SlideBanners() {
  const banners = [
    { id: 1, src: "/banner-ofertas.png", alt: "Gran Apertura y Ofertas Exclusivas", link: "/catalogo" },
    { id: 2, src: "/banner-placares.png", alt: "Especial Placares - Renovación del Espacio", link: "/catalogo?cat=placares" },
    { id: 3, src: "/banner-taurus.png", alt: "Colchones Taurus - El Descanzo que merecés", link: "/catalogo?cat=colchones" },
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
            <Image 
              src={ban.src} 
              alt={ban.alt} 
              fill 
              sizes="100vw"
              className="object-cover md:object-fill"
              priority={ban.id === 1}
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}