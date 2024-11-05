import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get('http://localhost:5000/products');
  return response.data;
});

// Async thunk for deleting a product
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId) => {
  await axios.delete(`http://localhost:5000/products/${productId}`);
  return productId; // Return the ID of the deleted product
});

// Async thunk for updating a product
export const updateProduct = createAsyncThunk('products/updateProduct', async ({ productId, productData }) => {
  const response = await axios.put(`http://localhost:5000/products/${productId}`, productData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data; // Assuming your API returns the updated product
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    loading: false,
    products: [],
    error: null,
  },
  reducers: {},
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
        const id = action.payload;
        state.products = state.products.filter(product => product.id !== id);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.products.findIndex(product => product.id === updatedProduct.id);
        if (index !== -1) {
          state.products[index] = updatedProduct; // Update the product in the state
        }
      });
  },
});

export { fetchProducts, deleteProduct, updateProduct };
export default productSlice.reducer;
