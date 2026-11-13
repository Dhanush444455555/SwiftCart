import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list:    [],
  loading: false,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.list = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Admin actions — optimistically update the Redux store
    addProduct: (state, action) => {
      state.list.unshift(action.payload); // newest first
    },
    updateProduct: (state, action) => {
      const idx = state.list.findIndex(p => (p._id ?? p.id) === (action.payload._id ?? action.payload.id));
      if (idx !== -1) state.list[idx] = action.payload;
    },
    deleteProduct: (state, action) => {
      state.list = state.list.filter(p => (p._id ?? p.id) !== action.payload);
    },
    // Called after a successful purchase to reflect stock changes locally
    decreaseStock: (state, action) => {
      // action.payload = [{ productId, quantity }]
      action.payload.forEach(({ productId, quantity }) => {
        const product = state.list.find(p => (p._id ?? p.id) === productId || p.id === productId);
        if (product) {
          product.stockCount = Math.max(0, (product.stockCount ?? 0) - quantity);
          product.inStock    = product.stockCount > 0;
        }
      });
    },
  },
});

export const {
  setProducts, setLoading,
  addProduct, updateProduct, deleteProduct,
  decreaseStock,
} = productSlice.actions;

export default productSlice.reducer;
