'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, ArrowLeft, LogOut, CheckCircle2, User, Truck } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CuentaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCart = searchParams.get('from') === 'cart';
  const supabase = createClient();
  const { cart, totalPrice } = useCart();

  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Formularios
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Perfil del Usuario
  const [perfil, setPerfil] = useState({
    nombre_completo: '',
    telefono: '',
    direccion: '',
    ciudad: 'Las Heras',
    provincia: 'Santa Cruz',
    codigo_postal: '9017'
  });
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [perfilGuardado, setPerfilGuardado] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) cargarPerfil(session.user.id);
      setLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        cargarPerfil(session.user.id);
      } else {
        setPerfil({ nombre_completo: '', telefono: '', direccion: '', ciudad: 'Las Heras', provincia: 'Santa Cruz', codigo_postal: '9017' });
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarPerfil = async (userId: string) => {
    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
    if (data) {
      setPerfil(data);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAuth(true);
    setAuthError('');

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError('Correo o contraseña incorrectos.');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthError('Error al crear cuenta: ' + error.message);
      else setAuthError('Cuenta creada. Revisa tu correo para verificar o inicia sesión.');
    }
    setLoadingAuth(false);
  };

  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setGuardandoPerfil(true);
    
    const { error } = await supabase.from('user_profiles').upsert({
      id: session.user.id,
      ...perfil
    });

    setGuardandoPerfil(false);
    if (error) {
      alert('Error al guardar datos: ' + error.message);
    } else {
      setPerfilGuardado(true);
      setTimeout(() => setPerfilGuardado(false), 3000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const confirmarPedidoWhatsApp = () => {
    let texto = `¡Hola Muebles Ilusión! Quiero confirmar mi compra.\n\n`;
    texto += `*Mis Datos de Envío:*\n`;
    texto += `- Nombre: ${perfil.nombre_completo}\n`;
    texto += `- Teléfono: ${perfil.telefono}\n`;
    texto += `- Dirección: ${perfil.direccion}, ${perfil.ciudad}, ${perfil.provincia} (CP: ${perfil.codigo_postal})\n\n`;
    
    texto += `*Mi Pedido:*\n`;
    cart.forEach(item => {
       texto += `- ${item.cantidad}x ${item.titulo} (Color: ${item.color}) - $${(item.precio * item.cantidad).toLocaleString('es-AR')}\n`;
    });
    texto += `\n*Total a pagar:* $${totalPrice.toLocaleString('es-AR')}\n`;
    texto += `\nQuiero coordinar el medio de pago y la entrega.`;

    const numero = "5493541336420";
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, '_blank');
  };

  if (loadingSession) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]"><Loader2 className="animate-spin text-[#e60000]" size={48} /></div>;
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <header className="bg-white py-4 border-b shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex-shrink-0">
             <div className="relative w-40 h-12 md:w-52 md:h-16">
               <Image src="/logo.png" alt="Muebles Ilusión" fill sizes="200px" className="object-contain" priority />
             </div>
          </Link>
          <Link href={fromCart ? "/carrito" : "/"} className="text-gray-600 font-semibold flex items-center gap-2 hover:text-[#e60000] transition-colors">
            <ArrowLeft size={18}/> Volver
          </Link>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center p-4 py-8">
        {!session ? (
          // PANTALLA DE LOGIN / REGISTRO
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h1>
              <p className="text-sm text-gray-500 mt-1">{fromCart ? 'Para continuar con tu compra, necesitamos tus datos.' : 'Gestiona tus datos y direcciones de envío.'}</p>
            </div>
            
            {authError && (
               <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center font-medium border border-red-200">
                 {authError}
               </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#e60000] focus:ring-1 focus:ring-[#e60000] transition-all" placeholder="tu@correo.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} minLength={6} className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#e60000] focus:ring-1 focus:ring-[#e60000] transition-all" placeholder="••••••••" />
                {!isLogin && <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres.</p>}
              </div>
              <button type="submit" disabled={loadingAuth} className="w-full bg-[#e60000] hover:bg-red-700 text-white font-bold py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2">
                {loadingAuth ? <Loader2 size={18} className="animate-spin" /> : (isLogin ? 'Ingresar' : 'Registrarme')}
              </button>
            </form>

            <div className="mt-6 text-center border-t pt-4">
              <p className="text-sm text-gray-600">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button onClick={() => { setIsLogin(!isLogin); setAuthError(''); }} className="ml-2 text-[#e60000] font-bold hover:underline">
                  {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
                </button>
              </p>
            </div>
          </div>
        ) : (
          // PERFIL DE USUARIO LOGUEADO
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <User size={40} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 truncate w-full">{session.user.email}</h2>
                <p className="text-sm text-gray-500 mb-6">Cliente Registrado</p>
                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-2 font-medium transition-colors">
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </div>
              
              {fromCart && (
                <div className="mt-6 bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center shadow-sm">
                  <h3 className="font-bold text-blue-900 mb-2">Confirmar Compra</h3>
                  <p className="text-sm text-blue-700 mb-4">Revisa que tus datos estén correctos. Se enviará tu pedido y dirección por WhatsApp para coordinar el pago.</p>
                  <button 
                    onClick={confirmarPedidoWhatsApp} 
                    disabled={perfil.direccion === '' || perfil.nombre_completo === ''} 
                    className="w-full bg-[#3483fa] hover:bg-[#2968c8] disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    Enviar Pedido por WhatsApp
                  </button>
                  {(perfil.direccion === '' || perfil.nombre_completo === '') && (
                    <p className="text-xs text-red-500 mt-2 font-semibold">Completa y guarda tus datos para continuar.</p>
                  )}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                  <Truck size={24} className="text-[#e60000]" />
                  <h2 className="text-xl font-bold text-gray-900">Datos de Envío y Contacto</h2>
                </div>

                <form onSubmit={handleGuardarPerfil} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
                      <input type="text" required value={perfil.nombre_completo} onChange={e => setPerfil({...perfil, nombre_completo: e.target.value})} className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#e60000] focus:ring-1 focus:ring-[#e60000]" placeholder="Ej: Juan Pérez" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono de Contacto</label>
                      <input type="tel" required value={perfil.telefono} onChange={e => setPerfil({...perfil, telefono: e.target.value})} className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#e60000] focus:ring-1 focus:ring-[#e60000]" placeholder="Código de área + Número" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección de Entrega</label>
                    <input type="text" required value={perfil.direccion} onChange={e => setPerfil({...perfil, direccion: e.target.value})} className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#e60000] focus:ring-1 focus:ring-[#e60000]" placeholder="Calle y Número, Piso, Depto..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Ciudad</label>
                      <input type="text" required value={perfil.ciudad} onChange={e => setPerfil({...perfil, ciudad: e.target.value})} className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#e60000] focus:ring-1 focus:ring-[#e60000]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Provincia</label>
                      <input type="text" required value={perfil.provincia} onChange={e => setPerfil({...perfil, provincia: e.target.value})} className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#e60000] focus:ring-1 focus:ring-[#e60000]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Código Postal</label>
                      <input type="text" required value={perfil.codigo_postal} onChange={e => setPerfil({...perfil, codigo_postal: e.target.value})} className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#e60000] focus:ring-1 focus:ring-[#e60000]" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    {perfilGuardado ? (
                      <span className="text-green-600 font-semibold flex items-center gap-2"><CheckCircle2 size={18}/> Datos guardados</span>
                    ) : (
                      <span></span>
                    )}
                    <button type="submit" disabled={guardandoPerfil} className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
                      {guardandoPerfil && <Loader2 size={16} className="animate-spin" />} Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}