import { MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ilusion-black text-white py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-ilusion-red mb-4">MUEBLES ILUSIÓN</h3>
          <p className="text-sm text-gray-300">40 años equipando tu hogar con la mejor calidad en muebles, colchones y placares.</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Contacto y Ubicación</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2"><Phone size={16} /> 2974 - 776203</li>
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-1" /> Calle Alberdi 314<br/>Las Heras - Santa Cruz<br/>Argentina</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Enlaces Útiles</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/catalogo?cat=placares" className="hover:text-ilusion-red transition">Placares</Link></li>
            <li><Link href="/catalogo?cat=colchones" className="hover:text-ilusion-red transition">Colchones Taurus</Link></li>
            <li><Link href="/preguntas-frecuentes" className="hover:text-ilusion-red transition">Preguntas Frecuentes</Link></li>
            <li><Link href="/terminos" className="hover:text-ilusion-red transition">Términos y Condiciones</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Redes Sociales</h4>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/profile.php?id=61560083084978" target="_blank" className="hover:text-ilusion-red transition">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/mueblesilusionoficial.2006/?hl=es" target="_blank" className="hover:text-ilusion-red transition">
              <svg className="w-6 h-6 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://www.tiktok.com/@muebles.ilusion.oficial" target="_blank" className="hover:text-ilusion-red transition">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.63 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}