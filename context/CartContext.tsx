'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  id: string;
  titulo: string;
  precio: number;
  img: string;
  cantidad: number;
  color: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cantidad'>) => void;
  removeFromCart: (id: string, color: string) => void;
  updateQuantity: (id: string, color: string, cantidad: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar el carrito guardado al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem('muebles-ilusion-cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    setIsLoaded(true);
  }, []);

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('muebles-ilusion-cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, 'cantidad'>) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === newItem.id && item.color === newItem.color);
      if (existingItem) {
        return prev.map(item => 
          item.id === newItem.id && item.color === newItem.color 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        );
      }
      return [...prev, { ...newItem, cantidad: 1 }];
    });
  };

  const removeFromCart = (id: string, color: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.color === color)));
  };

  const updateQuantity = (id: string, color: string, cantidad: number) => {
    if (cantidad < 1) return;
    setCart(prev => prev.map(item => 
      item.id === id && item.color === color ? { ...item, cantidad } : item
    ));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider');
  return context;
};