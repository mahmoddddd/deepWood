'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('deepwood_cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          // Migration: Ensure all items have a unique ID
          const cartWithIds = parsedCart.map(item => ({
            ...item,
            cartItemId: item.cartItemId || `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          }));
          setCartItems(cartWithIds);
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
          localStorage.removeItem('deepwood_cart');
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('deepwood_cart', JSON.stringify(cartItems));
    }

    // Calculate totals
    const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const priceSum = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    setTotalItems(itemsCount);
    setTotalPrice(priceSum);
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    setCartItems((prevItems) => {
      // Create a unique ID for the item (productID + variant options if any)
      const variantKey = selectedVariant ? JSON.stringify(selectedVariant) : '';
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product._id === product._id && item.variantKey === variantKey
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            product,
            quantity,
            selectedVariant,
            variantKey,
            cartItemId: `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            price: product.price, // Store price at adding time or use current product price
            addedAt: new Date().toISOString()
          },
        ];
      }
    });
    setIsCartOpen(true); // Auto open cart to show confirmation
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cartItemId === cartItemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('deepwood_cart');
    }
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        toggleCart,
        setIsCartOpen,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
