import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, updateProduct } from '../features/ProductListSlice';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setProductName(product.productName);
    setProductDescription(product.productDescription);
    setPrice(product.price);
    setImages([]); // Reset images for updating
  };

  const handleDelete = () => {
    if (selectedProduct) {
      dispatch(deleteProduct(selectedProduct.id));
      setSelectedProduct(null);
    }
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

    dispatch(updateProduct({ productId: selectedProduct.id, productData: formData }));
    setSelectedProduct(null);
    dispatch(fetchProducts());
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
            <button 
              className="bg-blue-600 text-white px-2 py-1 rounded mt-4"
              onClick={() => handleSelectProduct(product)}
            >
              Select for Actions
            </button>
          </div>
        ))}
      </div>

      {/* Actions for Selected Product */}
      {selectedProduct && (
        <div className="flex flex-col items-center bg-gray-800 p-4 mt-8 rounded shadow-lg w-full max-w-md">
          <h3 className="text-xl text-white mb-4">Edit Selected Product</h3>
          <button 
            className="bg-red-600 text-white px-2 py-1 rounded mb-4"
            onClick={handleDelete}
          >
            Delete Product
          </button>
          <form onSubmit={handleUpdate} className="w-full">
            <input
              type="text"
              className="w-full mb-2 p-2"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <textarea
              className="w-full mb-2 p-2"
              placeholder="Product Description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
            <input
              type="number"
              className="w-full mb-2 p-2"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="file"
              multiple
              className="w-full mb-2"
              onChange={(e) => setImages(Array.from(e.target.files))}
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update Product
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductList;
