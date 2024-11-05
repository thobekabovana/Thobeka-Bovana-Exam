// ProductList.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../features/ProductListSlice'; // Adjust import based on your file structure
import axios from 'axios';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [editProduct, setEditProduct] = useState(null);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (productId) => {
    try {
      await dispatch(deleteProduct(productId)); // Assuming deleteProduct is a thunk that handles the deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdate = async (productId) => {
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("price", price);
    images.forEach((image) => {
      formData.append("images", image);
    });
  
    try {
      await axios.put(`http://localhost:5000/products/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEditProduct(null); // Reset edit state
      dispatch(fetchProducts()); // Fetch updated products
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files)); // Convert FileList to Array
  };

  const handleEditChange = (product) => {
    setEditProduct(product.id);
    setProductName(product.productName);
    setProductDescription(product.productDescription);
    setPrice(product.price);
    setImages([]); // Reset images for editing
  };
  

  if (loading) {
    return <p className="text-white">Loading products...</p>; // Added class for text color
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; // Display error message in red
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl text-white mb-4">Product List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-900 p-4 rounded-lg shadow-md">
            <h3 className="text-xl text-white">{product.productName}</h3>
            <p className="text-gray-400">{product.productDescription}</p>
            <p className="text-green-400">Price: ${product.price}</p>
            {product.images && product.images.length > 0 && (
              <div className="mt-2">
                {product.images.map((image, index) => (
                  <img key={index} src={image} alt={`Product image ${index + 1}`} className="w-full h-auto rounded" />
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-between">
              <button 
                className="bg-red-600 text-white px-2 py-1 rounded" 
                onClick={() => handleDelete(product.id)}>Delete</button>
              <button 
                className="bg-blue-600 text-white px-2 py-1 rounded" 
                onClick={() => handleEditChange(product)}>Update</button>
            </div>
          </div>
        ))}
      </div>

      {editProduct && (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
          <form 
            onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(editProduct);
              }}
            className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl text-white text-center mb-6">Update Product</h2>

            <div className="mb-4">
              <label className="block text-white mb-2">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-gray-600"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">Product Description</label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-gray-600"
                placeholder="Enter product description"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-gray-600"
                placeholder="Enter price"
                min="0"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">Product Images (3 or more)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-gray-400 bg-gray-700 p-2 rounded focus:outline-none"
                required
              />
              {images.length > 0 && images.length < 3 && (
                <p className="text-red-500 mt-2">Please select at least 3 images.</p>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gray-600 text-white py-2 px-6 rounded hover:bg-gray-500 focus:outline-none"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductList;
