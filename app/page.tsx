'use client'
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingCart, Menu, Snowflake, Tv, Smartphone, Armchair, Laptop, ChefHat, LayoutPanelLeft, BedDouble, CreditCard, Wallet, Landmark, ChevronDown, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

const BannerSlider = dynamic(() => import('@/components/ClientCarousel').then((mod) => mod.BannerSlider), { ssr: false });
const ProductosSlider = dynamic(() => import('@/components/ClientCarousel').then((mod) => mod.ProductosSlider), { ssr: false });

export default function Home() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categoriasCirculares = [
    { nombre: 'Aires', icono: Snowflake, href: '/catalogo?cat=Climatización' },
    { nombre: 'Smart TV', icono: Tv, href: '/catalogo?cat=Tecnología' },
    { nombre: 'Celulares', icono: Smartphone, href: '/catalogo?cat=Tecnología' },
    { nombre: 'Muebles', icono: Armchair, href: '/catalogo?cat=Muebles' },
    { nombre: 'Notebooks', icono: Laptop, href: '/catalogo?cat=Tecnología' },
    { nombre: 'Cocina', icono: ChefHat, href: '/catalogo?cat=Electrodomésticos' },
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f5] flex flex-col relative">
      <header className="bg-white py-4 relative z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-6">
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-40 h-12">
               <Image src="/logo.png" alt="Muebles Ilusión" fill sizes="160px" className="object-contain" priority />
            </div>
          </Link>
          
          <div className="flex-grow max-w-2xl mx-auto order-3 md:order-2 w-full md:w-auto">
            <div className="relative flex items-center w-full h-12 rounded-full border border-gray-300 bg-gray-50 overflow-hidden shadow-inner focus-within:bg-white focus-within:ring-2 focus-within:ring-red-200 focus-within:border-[#e60000] transition-all">
              <Search className="text-gray-400 ml-4" size={20} />
              <input type="text" placeholder="Buscar productos, marcas y más..." className="w-full h-full bg-transparent text-gray-800 font-medium px-3 outline-none text-sm" />
            </div>
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
             <button 
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="flex items-center gap-2 text-[#e60000] hover:text-red-700 transition"
             >
               <Menu size={20} /> Todas las Categorías <ChevronDown size={16} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
             </button>
             <Link href="/catalogo?cat=Climatización" className="hover:text-[#e60000] transition">Climatización</Link>
             <Link href="/catalogo?cat=Tecnología" className="hover:text-[#e60000] transition">Tecnología y TV</Link>
             <Link href="/catalogo?cat=Muebles" className="hover:text-[#e60000] transition">Muebles de Interior</Link>
             <Link href="/catalogo?cat=Electrodomésticos" className="hover:text-[#e60000] transition">Electrodomésticos</Link>
          </div>
          <Link href="/catalogo?ofertas=true" className="text-[#e60000] font-bold hover:underline ml-6 flex-shrink-0 bg-red-50 px-3 py-1.5 rounded-full">
            Ofertas 40 Años
          </Link>
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

      {/* Banner Principal - Altura reducida y ajustada */}
      <section className="w-full h-[25vh] min-h-[200px] sm:h-[35vh] md:h-[45vh] max-h-[400px] relative z-20 shadow-inner">
        <BannerSlider />
      </section>

      {/* Categorías Circulares Mejoradas */}
      <section className="max-w-7xl mx-auto px-4 py-10 w-full">
        <h2 className="text-2xl font-black tracking-tight text-gray-900 mb-8">¿Qué estás buscando?</h2>
        <div className="flex justify-between items-center overflow-x-auto gap-4 pb-6 pt-2 px-2 snap-x hide-scrollbar">
          {categoriasCirculares.map((cat, index) => {
            const Icono = cat.icono;
            return (
              <Link key={index} href={cat.href} className="flex flex-col items-center gap-4 group min-w-[90px] snap-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center justify-center text-[#e60000] group-hover:bg-[#e60000] group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_8px_30px_rgba(230,0,0,0.3)] transition-all duration-300">
                  <Icono size={36} strokeWidth={1.5} className="md:w-10 md:h-10" />
                </div>
                <span className="text-sm font-bold text-gray-700 text-center group-hover:text-[#e60000] transition-colors">{cat.nombre}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Botones Destacados Premium */}
      <section className="max-w-7xl mx-auto px-4 py-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/catalogo?cat=Placares" className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-48 flex items-center p-8 border border-gray-700">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 group-hover:opacity-20 transition-all duration-700">
               <LayoutPanelLeft size={120} />
            </div>
            <div className="relative z-10 text-white">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block backdrop-blur-md">DORMITORIO</span>
              <h3 className="text-2xl font-black tracking-wide mb-2 group-hover:text-red-400 transition-colors">PLACARES Y VESTIDORES</h3>
              <p className="text-gray-300 text-sm font-medium flex items-center gap-2">Explorar catálogo <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" /></p>
            </div>
          </Link>
          
          <Link href="/catalogo?cat=Colchones" className="group relative overflow-hidden bg-gradient-to-br from-red-700 to-[#e60000] rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-500 h-48 flex items-center p-8 border border-red-600">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 group-hover:opacity-20 transition-all duration-700">
               <BedDouble size={120} />
            </div>
            <div className="relative z-10 text-white">
              <span className="bg-black/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block backdrop-blur-md">DESCANSO PREMIUM</span>
              <h3 className="text-2xl font-black tracking-wide mb-2 group-hover:text-black transition-colors">COLCHONES TAURUS</h3>
              <p className="text-red-100 text-sm font-medium flex items-center gap-2">Explorar catálogo <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" /></p>
            </div>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black tracking-tight text-gray-900">Ofertas Destacadas</h2>
        </div>
        <ProductosSlider tipo="ofertas" />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black tracking-tight text-gray-900">Nuevos Ingresos</h2>
        </div>
        <ProductosSlider tipo="nuevos" />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 w-full mb-8">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-8 flex flex-col md:flex-row justify-around items-center gap-8 md:gap-4">
          <div className="flex flex-col items-center text-center group">
             <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <CreditCard size={32} strokeWidth={1.5} className="text-[#e60000]" />
             </div>
             <span className="font-bold text-gray-900 text-lg">Tarjetas de Crédito / Débito</span>
             <span className="text-sm font-medium text-gray-500 mt-1">Hasta 3 cuotas sin interés</span>
          </div>
          <div className="hidden md:block w-px h-24 bg-gray-100"></div>
          <div className="flex flex-col items-center text-center group">
             <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <Wallet size={32} strokeWidth={1.5} className="text-[#e60000]" />
             </div>
             <span className="font-bold text-gray-900 text-lg">Crédito Crediario</span>
             <span className="text-sm font-medium text-gray-500 mt-1">Aprobación en el local</span>
          </div>
          <div className="hidden md:block w-px h-24 bg-gray-100"></div>
          <div className="flex flex-col items-center text-center group">
             <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <Landmark size={32} strokeWidth={1.5} className="text-[#e60000]" />
             </div>
             <span className="font-bold text-gray-900 text-lg">Plan SOEM</span>
             <span className="text-sm font-medium text-gray-500 mt-1">Beneficio exclusivo municipal</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}