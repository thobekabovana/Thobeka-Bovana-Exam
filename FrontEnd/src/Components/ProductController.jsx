const Product = require('../models/Product');

// Fetch all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted', productId: id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, productDescription, price } = req.body;
    const images = req.files.map((file) => file.path); // Assuming you're using a library like multer for file uploads

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { productName, productDescription, price, images },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
