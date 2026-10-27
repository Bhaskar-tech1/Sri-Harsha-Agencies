'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'sri-harsha-cart-v1';

function isValidCartItem(item) {
  return Boolean(
    item &&
    typeof item.productId === 'string' &&
    item.productId.length > 0 &&
    typeof item.variantId === 'string' &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1
  );
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const validItems = useMemo(() => items.filter(isValidCartItem), [items]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter(isValidCartItem));
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Storage can be unavailable */ }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validItems));
    } catch {
      // Cart remains in memory if storage is disabled
    }
  }, [hydrated, validItems]);

  const addItem = useCallback((product, variant = null, quantity = 1) => {
    if (!product || !product.id) return;
    const variantId = variant?.id || 'default';
    const amount = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
    const price = Number(variant?.salePrice ?? product.salePrice ?? 0);
    const variantLabel = variant?.label || product.variantLabel || '';

    setItems((current) => {
      const existingIndex = current.findIndex(
        (item) => item.productId === product.id && item.variantId === variantId
      );

      if (existingIndex >= 0) {
        return current.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + amount }
            : item
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          variantId,
          quantity: amount,
          price,
          variantLabel,
          product: {
            id: product.id,
            name: product.name,
            image: product.image,
            imageAlt: product.imageAlt || product.name,
            type: product.type || 'product',
            salePrice: Number(product.salePrice ?? 0),
            mrp: Number(product.mrp ?? 0),
            category: product.category,
          },
          variant: variant ? {
            id: variant.id,
            label: variant.label,
            salePrice: Number(variant.salePrice ?? 0),
            mrp: Number(variant.mrp ?? 0),
          } : null,
        },
      ];
    });
  }, []);

  const changeQuantity = useCallback((productId, variantId, delta) => {
    setItems((current) =>
      current.flatMap((item) => {
        if (item.productId !== productId || item.variantId !== variantId) return [item];
        const quantity = item.quantity + delta;
        return quantity > 0 ? [{ ...item, quantity }] : [];
      })
    );
  }, []);

  const removeItem = useCallback((productId, variantId) => {
    setItems((current) =>
      current.filter((item) => item.productId !== productId || item.variantId !== variantId)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const count = validItems.reduce((total, item) => total + item.quantity, 0);

  const value = useMemo(
    () => ({
      items: validItems,
      count,
      hydrated,
      addItem,
      changeQuantity,
      removeItem,
      clearCart,
    }),
    [validItems, count, hydrated, addItem, changeQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
