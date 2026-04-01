import { createSlice } from '@reduxjs/toolkit';
import { getMockProducts } from '../data/mockProducts';

const initialState = {
  list: getMockProducts(),   // pre-loaded with 80 curated products
  loading: false,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.list = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addProduct: (state, action) => {
      state.list.unshift(action.payload); // show newest first
    },
    updateProduct: (state, action) => {
      const idx = state.list.findIndex(p => p._id === action.payload._id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    deleteProduct: (state, action) => {
      state.list = state.list.filter(p => p._id !== action.payload);
    },
    // Called after a customer successfully purchases items
    decreaseStock: (state, action) => {
      // action.payload = array of { productId, quantity }
      action.payload.forEach(({ productId, quantity }) => {
        const product = state.list.find(p => p._id === productId);
        if (product) {
          product.stockCount = Math.max(0, product.stockCount - quantity);
          product.inStock = product.stockCount > 0;
        }
      });
    },
  },
});

export const { setProducts, setLoading, addProduct, updateProduct, deleteProduct, decreaseStock } = productSlice.actions;
export default productSlice.reducer;
