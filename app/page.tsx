'use client'
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { CreditCard, Truck, BedDouble, LayoutPanelLeft } from 'lucide-react';
import Footer from '@/components/Footer';

// La magia ocurre aquí: { ssr: false } desactiva el renderizado en servidor
const SlideBanners = dynamic(() => import('@/components/ClientCarousel').then((mod) => mod.SlideBanners), { 
  ssr: false, 
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">Cargando Banners...</div> 
});

const CarouselOft = dynamic(() => import('@/components/ClientCarousel').then((mod) => mod.CarouselOft), { 
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gray-200 animate-pulse rounded-xl"></div>
});

export default function Home() {
  return (
    <main className="min-h-screen bg-ilusion-gray flex flex-col">
      <div className="bg-ilusion-red text-white text-center py-2 text-xs md:text-sm font-semibold tracking-wide flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 z-10">
        <span className="flex items-center gap-2"><CreditCard size={18} /> HASTA 3 CUOTAS SIN INTERÉS CON TARJETAS SELECCIONADAS</span>
        <span className="hidden md:inline">|</span>
        <span className="flex items-center gap-2"><Truck size={18} /> ENVÍOS A ACORDAR CON EL VENDEDOR</span>
      </div>

      <header className="bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Muebles Ilusión Logo" width={180} height={60} className="object-contain" priority />
          </Link>
          <div className="hidden md:flex gap-6 font-semibold text-gray-700">
            <Link href="/" className="text-ilusion-red">Inicio</Link>
            <Link href="/catalogo" className="hover:text-ilusion-red transition">Catálogo</Link>
            <Link href="/contacto" className="hover:text-ilusion-red transition">Contacto</Link>
          </div>
        </div>
      </header>

      <section className="w-full h-[200px] sm:h-[300px] md:h-[450px]">
        <SlideBanners />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/catalogo?cat=placares" className="group relative h-56 bg-white rounded-2xl shadow border border-gray-100 overflow-hidden flex flex-col items-center justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-ilusion-red">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <LayoutPanelLeft size={56} className="text-ilusion-red mb-4 transform group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xl font-bold text-ilusion-black group-hover:text-ilusion-red transition-colors">PLACARES Y VESTIDORES</h3>
            <p className="text-xs text-gray-500 mt-2">Explorar la mejor línea para tu hogar</p>
          </Link>
          <Link href="/catalogo?cat=colchones" className="group relative h-56 bg-white rounded-2xl shadow border border-gray-100 overflow-hidden flex flex-col items-center justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-ilusion-red">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <BedDouble size={56} className="text-ilusion-black mb-4 transform group-hover:scale-110 transition-transform duration-300 group-hover:text-ilusion-red" />
            <h3 className="text-xl font-bold text-ilusion-red">COLCHONES TAURUS</h3>
            <p className="text-xs text-gray-500 mt-2">Encontrá el descanso ideal en 3 cuotas</p>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-ilusion-black border-l-4 border-ilusion-red pl-4">Ofertas Destacadas</h2>
          <Link href="/catalogo" className="text-ilusion-red text-sm font-semibold hover:underline">Ver todas</Link>
        </div>
        <CarouselOft />
      </section>

      <div className="flex-grow"></div>
      <Footer />
    </main>
  );
}