'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Productos', icon: Package, path: '/admin/productos' },
    { name: 'Pedidos', icon: ShoppingBag, path: '/admin/pedidos' },
    { name: 'Configuración', icon: Settings, path: '/admin/configuracion' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar / Menú Lateral */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
          <div className="relative w-32 h-10">
            <Image src="/logo.png" alt="Muebles Ilusión" fill className="object-contain" />
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-red-50 text-[#e60000]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 w-full transition-colors">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Móvil y Barra Superior */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-gray-800">Panel de Control</h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#e60000] text-white flex items-center justify-center font-bold text-sm">
              AP
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Agustin N, Peralta</span>
          </div>
        </header>
        
        {/* Área donde se renderizan las páginas */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}