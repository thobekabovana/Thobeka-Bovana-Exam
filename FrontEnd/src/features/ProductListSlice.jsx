import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/products';

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId) => {
  await axios.delete(`${API_URL}/${productId}`);
  return productId;
});

// Async thunk to update a product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, productData }) => {
    const response = await axios.put(`${API_URL}/${productId}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    loading: false,
    products: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.products.findIndex((product) => product.id === updatedProduct.id);
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      });
  },
});

export default productSlice.reducer;
