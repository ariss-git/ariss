import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void; // To update item quantity
  calculateTotal: () => number; // To calculate total price of cart
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existingItemIndex = state.cart.findIndex((cartItem) => cartItem.id === item.id);
      if (existingItemIndex !== -1) {
        // If the item already exists, update the quantity
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return { cart: updatedCart };
      } else {
        // If the item is not in the cart, add it
        return { cart: [...state.cart, item] };
      }
    }),
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),
  clearCart: () => set({ cart: [] }),
  updateQuantity: (id, quantity) =>
    set((state) => {
      const updatedCart = state.cart.map((item) => (item.id === id ? { ...item, quantity } : item));
      return { cart: updatedCart };
    }),
  calculateTotal: (): number => {
    return useCartStore
      .getState()
      .cart.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);
  },
}));
