const Product = require('../models/product.model');

exports.createProduct = async (req, res) => {
  const { name, category, aval_quantity, unit_price, material } = req.body;

  // Validation
  if (!name || !category || !aval_quantity || !unit_price || !material) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!['male', 'female'].includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const result = await Product.create({
      name,
      category,
      aval_quantity,
      unit_price,
      material
    });

    res.status(201).json({
      message: 'Product created successfully',
      productId: result.insertId
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Error fetching product' });
  }
};

exports.updateProduct = async (req, res) => {
  const { name, category, aval_quantity, unit_price, material } = req.body;

  // Validation
  if (!name || !category || !aval_quantity || !unit_price || !material) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!['male', 'female'].includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await Product.update(req.params.id, {
      name,
      category,
      aval_quantity,
      unit_price,
      material
    });

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await Product.delete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
}; 