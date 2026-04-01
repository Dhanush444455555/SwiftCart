import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalPrice: 0,
  pastOrders: [], // Tracks completed orders for history
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(item => item.product._id === action.payload._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      state.totalPrice += action.payload.price;
    },
    removeFromCart: (state, action) => {
      const existingIdx = state.items.findIndex(item => item.product._id === action.payload._id);
      if (existingIdx >= 0) {
        state.totalPrice -= state.items[existingIdx].product.price * state.items[existingIdx].quantity;
        state.items.splice(existingIdx, 1);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
    saveOrderToHistory: (state, action) => {
      const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 100000)}`,
        date: new Date().toISOString(),
        items: [...state.items],
        totalPrice: action.payload.finalAmount, // The paid amount including tax
      };
      state.pastOrders.unshift(newOrder); // Add to beginning of history
    }
  },
});

export const { addToCart, removeFromCart, clearCart, saveOrderToHistory } = cartSlice.actions;
export default cartSlice.reducer;
