import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, updateProduct } from '../features/ProductListSlice';

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

  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("price", price);
    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(updateProduct({ productId: editProduct, productData: formData }));
    setEditProduct(null);
    dispatch(fetchProducts());
  };

  const handleEditChange = (product) => {
    setEditProduct(product.id);
    setProductName(product.productName);
    setProductDescription(product.productDescription);
    setPrice(product.price);
    setImages([]); // Reset images for editing
  };

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
          <form onSubmit={handleUpdate} className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg">
            {/* Update Form Fields */}
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductList;
