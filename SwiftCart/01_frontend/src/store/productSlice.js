import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
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
    }
  },
});

export const { setProducts, setLoading } = productSlice.actions;
export default productSlice.reducer;
