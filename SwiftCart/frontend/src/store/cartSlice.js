import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items:      [],       // { product, quantity, savedForLater: false }
  totalPrice: 0,
  savedItems: [],       // "Save for later" list
  coupon:     null,     // { code, discount } – applied coupon
  pastOrders: [],
};

const recalc = (state) => {
  state.totalPrice = state.items.reduce(
    (acc, i) => acc + i.product.price * i.quantity, 0
  );
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => i.product._id === action.payload._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      recalc(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.product._id !== action.payload._id);
      recalc(state);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.product._id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.product._id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      recalc(state);
    },

    saveForLater: (state, action) => {
      const idx = state.items.findIndex(i => i.product._id === action.payload._id);
      if (idx >= 0) {
        const [item] = state.items.splice(idx, 1);
        state.savedItems.push(item);
        recalc(state);
      }
    },

    moveToCart: (state, action) => {
      const idx = state.savedItems.findIndex(i => i.product._id === action.payload._id);
      if (idx >= 0) {
        const [item] = state.savedItems.splice(idx, 1);
        const existing = state.items.find(i => i.product._id === item.product._id);
        if (existing) existing.quantity += item.quantity;
        else state.items.push(item);
        recalc(state);
      }
    },

    removeSaved: (state, action) => {
      state.savedItems = state.savedItems.filter(i => i.product._id !== action.payload._id);
    },

    applyCoupon: (state, action) => {
      state.coupon = action.payload; // { code, discount }
    },

    removeCoupon: (state) => {
      state.coupon = null;
    },

    clearCart: (state) => {
      state.items      = [];
      state.totalPrice = 0;
      state.coupon     = null;
    },

    saveOrderToHistory: (state, action) => {
      state.pastOrders.unshift({
        id:         `ORD-${Math.floor(Math.random() * 100000)}`,
        date:       new Date().toISOString(),
        items:      [...state.items],
        totalPrice: action.payload.finalAmount,
      });
    },
  },
});

export const {
  addToCart, removeFromCart, updateQuantity,
  saveForLater, moveToCart, removeSaved,
  applyCoupon, removeCoupon,
  clearCart, saveOrderToHistory,
} = cartSlice.actions;

export default cartSlice.reducer;
