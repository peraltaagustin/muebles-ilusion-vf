import type { Metadata } from "next";
import "./globals.css"; // Esto debe ir primero para cargar todos los estilos de Tailwind

export const metadata: Metadata = {
  title: "Muebles Ilusión - Placares y Colchones Taurus",
  description: "Equipá tu hogar con las mejores ofertas, placares a medida y colchones Taurus en 3 cuotas sin interés.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}