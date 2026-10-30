'use client'
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ChevronLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Footer from '@/components/Footer';

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <main className="min-h-screen bg-[#ebebeb] flex flex-col pt-8">
      <div className="max-w-6xl mx-auto px-4 w-full flex-grow">
        
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Carrito de compras</h1>
          <Link href="/catalogo" className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 text-sm">
            <ChevronLeft size={18} /> Seguir comprando
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LISTA DE PRODUCTOS */}
          <div className="w-full lg:w-2/3 bg-white rounded-md shadow-sm p-2 sm:p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium text-gray-800 mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-6">¿No sabés qué comprar? ¡Miles de productos te esperan!</p>
                <Link href="/catalogo" className="bg-[#3483fa] hover:bg-[#2968c8] text-white px-6 py-3 rounded-md font-semibold transition-colors">
                  Descubrir ofertas
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.color}`} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    
                    {/* Imagen del producto */}
                    <div className="w-24 h-24 relative flex-shrink-0 bg-gray-50 rounded-md p-2">
                      <Image src={item.img} alt={item.titulo} fill className="object-contain" />
                    </div>

                    {/* Info del producto */}
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug">{item.titulo}</h3>
                      <p className="text-sm text-gray-500 mt-1">Color: {item.color}</p>
                      
                      {/* Acciones móviles / desktop */}
                      <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                        <button 
                          onClick={() => removeFromCart(item.id, item.color)} 
                          className="text-sm font-medium text-blue-500 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Trash2 size={16} /> Eliminar
                        </button>
                      </div>
                    </div>

                    {/* Cantidad y Precio */}
                    <div className="flex flex-col items-center sm:items-end gap-3 min-w-[120px]">
                      <p className="text-xl font-semibold text-gray-900">${(item.precio * item.cantidad).toLocaleString('es-AR')}</p>
                      
                      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm mt-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.color, item.cantidad - 1)}
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors font-medium border-r border-gray-300"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-sm font-semibold">{item.cantidad}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.color, item.cantidad + 1)}
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors font-medium border-l border-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RESUMEN DE COMPRA */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-md shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-4">Resumen de compra</h2>
              
              <div className="flex justify-between items-center mb-3 text-gray-600 text-sm">
                <span>Productos ({totalItems})</span>
                <span>${totalPrice.toLocaleString('es-AR')}</span>
              </div>
              
              <div className="flex justify-between items-center mb-6 text-gray-600 text-sm">
                <span>Envío</span>
                <span className="text-green-600 font-medium">A acordar</span>
              </div>

              <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-100">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">${totalPrice.toLocaleString('es-AR')}</span>
              </div>

              <button 
                disabled={cart.length === 0}
                className="w-full bg-[#3483fa] hover:bg-[#2968c8] text-white py-4 rounded-md font-semibold text-base transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continuar compra
              </button>

              <div className="mt-6 flex gap-2 text-xs text-gray-500 justify-center items-center bg-gray-50 p-3 rounded-md">
                <ShieldCheck size={16} className="text-green-600 flex-shrink-0" />
                <p>Tu información de pago está segura. Compra protegida por Muebles Ilusión.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}