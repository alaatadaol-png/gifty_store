import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/lib/brands";

const CartContext = createContext(null);
const STORAGE_KEY = "merasal_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      /* ignore corrupted cart */
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, personalization = "", quantity = 1) => {
    const lineId = `${product.id}__${personalization}`;
    setItems((current) => {
      const existing = current.find((item) => item.lineId === lineId);
      if (existing) {
        return current.map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...current,
        {
          lineId,
          productId: product.id,
          name: product.name,
          store: product.store,
          price: product.price,
          currency: product.currency || "USD",
          image_url: product.image_url,
          personalization,
          quantity,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (lineId) =>
    setItems((current) => current.filter((item) => item.lineId !== lineId));

  const updateQuantity = (lineId, quantity) => {
    if (quantity < 1) return removeItem(lineId);
    setItems((current) =>
      current.map((item) => (item.lineId === lineId ? { ...item, quantity } : item))
    );
  };

  const clear = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const totalsByCurrency = useMemo(() => {
    const map = {};
    items.forEach((item) => {
      const key = item.currency || "USD";
      map[key] = (map[key] || 0) + item.price * item.quantity;
    });
    return map;
  }, [items]);

  const currencyKeys = useMemo(
    () => Object.keys(totalsByCurrency).filter((key) => totalsByCurrency[key] > 0),
    [totalsByCurrency]
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const lines = useMemo(
    () =>
      items.map(
        (item) =>
          `${item.name}${item.personalization ? ` (${item.personalization})` : ""} × ${item.quantity} — ${formatPrice(item.price * item.quantity, item.currency)}`
      ),
    [items]
  );

  const value = {
    items,
    lines,
    total,
    totalsByCurrency,
    currencyKeys,
    count,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    removeItem,
    updateQuantity,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}