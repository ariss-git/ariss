import { create } from 'zustand';

interface CartState {
  cart: { id: string; name: string; price: number; quantity: number; image: string }[];
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void; // New function to update quantity
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],

  // Add to cart logic
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      if (existingItem) {
        // If the item already exists, increase its quantity by 1
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      // If the item doesn't exist, add it to the cart
      return { cart: [...state.cart, product] };
    }),

  // Remove from cart logic
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  // Update quantity logic
  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map(
        (item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item) // Ensure quantity is never less than 1
      ),
    })),
}));
