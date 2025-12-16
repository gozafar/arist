"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Painting } from "@/data/paintings";

export type CartItem = {
  painting: Painting;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addToCart: (painting: Painting, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (painting: Painting, quantity = 1) => {
    if (painting.availability === "sold") return;
    setItems((prev) => {
      const existing = prev.find((item) => item.painting.id === painting.id);
      if (existing) {
        return prev.map((item) =>
          item.painting.id === painting.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { painting, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.painting.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.painting.id === id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.painting.price * item.quantity, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
