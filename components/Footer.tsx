import Link from 'next/link';
import { Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#b30000] text-white pt-12 pb-8 border-t-4 border-gray-900 mt-auto shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-xl font-extrabold mb-4 tracking-wider">MUEBLES ILUSIÓN</h3>
          <p className="text-red-100 text-sm leading-relaxed mb-6 font-medium">
            40 años equipando tu hogar con la mejor calidad en muebles, tecnología y artículos para toda la familia en Las Heras.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4 text-white uppercase tracking-wide text-sm">Contacto y Ubicación</h4>
          <ul className="space-y-4 text-sm text-red-50">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Phone size={16} className="text-white" />
              </div>
              <span className="mt-1 font-medium">2974 - 776203</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-white" />
              </div>
              <span className="mt-1 font-medium leading-relaxed">Calle Alberdi 314<br />Las Heras - Santa Cruz<br />Argentina</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4 text-white uppercase tracking-wide text-sm">Enlaces Útiles</h4>
          <ul className="space-y-3 text-sm font-medium text-red-100">
            <li><Link href="/catalogo?cat=Placares" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Placares y Vestidores</Link></li>
            <li><Link href="/catalogo?cat=Colchones" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Colchones Taurus</Link></li>
            <li><Link href="/catalogo?ofertas=true" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Ofertas 40 Años</Link></li>
            <li><Link href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Preguntas Frecuentes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4 text-white uppercase tracking-wide text-sm">Seguinos</h4>
          <div className="flex gap-4">
            <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#b30000] hover:scale-110 transition-all shadow-sm">
              {/* Logo Oficial de Facebook en SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#b30000] hover:scale-110 transition-all shadow-sm">
              {/* Logo Oficial de Instagram en SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-red-800 text-center text-xs text-red-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-medium">&copy; {new Date().getFullYear()} Muebles Ilusión. Todos los derechos reservados.</p>
        <p className="font-bold tracking-wide">Desarrollado por Agustin N, Peralta</p>
      </div>
    </footer>
  );
}