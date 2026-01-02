'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { PaintingDTO } from '@/lib/dto';
import { addCartItem, clearCart as clearCartApi, fetchCart, removeCartItem, updateCartItem } from '@/lib/api/public';

export type CartItem = {
  painting: PaintingDTO;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addToCart: (painting: PaintingDTO, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  deleting: boolean;
  updatingId?: string;
  subtotal: number;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | undefined>(undefined);
  const fetched = useRef(false); // prevent double-fetch in React Strict Mode (dev)
  const lastMutationByItem = useRef<Record<string, number>>({}); // track latest mutation per painting

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    const load = async () => {
      try {
        const data = await fetchCart();
        setItems(data.items.map(item => ({ painting: item.painting, quantity: item.quantity })));
      } catch {
        setItems([]);
      }
    };
    void load();
  }, []);

  const addToCart = (painting: PaintingDTO, quantity = 1) => {
    if (painting.availability === 'sold') return;
    const key = painting.id;
    const nextMutation = (lastMutationByItem.current[key] ?? 0) + 1;
    lastMutationByItem.current[key] = nextMutation;

    // Optimistic update: update local quantity immediately
    let newQuantity = quantity;
    let existed = false;
    setItems(prev => {
      const existing = prev.find(item => item.painting.id === key);
      if (existing) {
        newQuantity = existing.quantity + quantity;
        existed = true;
        return prev.map(item => (item.painting.id === key ? { ...item, quantity: newQuantity } : item));
      }
      return [...prev, { painting, quantity }];
    });

    const run = async () => {
      try {
        const data = existed
          ? await updateCartItem(key, newQuantity)
          : await addCartItem({ paintingId: key, quantity: newQuantity });

        if (lastMutationByItem.current[key] === nextMutation) {
          setItems(data.items.map(item => ({ painting: item.painting, quantity: item.quantity })));
        }
      } catch {
        // keep optimistic state on failure
      }
    };
    void run();
  };

  const removeFromCart = (id: string) => {
    const run = async () => {
      setUpdatingId(id);
      setDeleting(true);
      try {
        const data = await removeCartItem(id);
        setItems(data.items.map(item => ({ painting: item.painting, quantity: item.quantity })));
      } catch {
        setItems(prev => prev.filter(item => item.painting.id !== id));
      } finally {
        setDeleting(false);
        setUpdatingId(undefined);
      }
    };
    void run();
  };

  const updateQuantity = (id: string, quantity: number) => {
    const run = async () => {
      setUpdatingId(id);
      try {
        const data = await updateCartItem(id, quantity);
        setItems(data.items.map(item => ({ painting: item.painting, quantity: item.quantity })));
      } catch {
        setItems(prev =>
          prev.map(item => (item.painting.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
        );
      } finally {
        setUpdatingId(undefined);
      }
    };
    void run();
  };

  const clearCart = () => {
    const run = async () => {
      setUpdatingId(undefined);
      setDeleting(true);
      try {
        const data = await clearCartApi();
        setItems(data.items.map(item => ({ painting: item.painting, quantity: item.quantity })));
      } catch {
        setItems([]);
      } finally {
        setDeleting(false);
        setUpdatingId(undefined);
      }
    };
    void run();
  };

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.painting.price * item.quantity, 0), [items]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        deleting,
        updatingId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
