const productService = require('../../services/product.service');
const { NotFoundError, ValidationError } = require('../../utils/errors');

/**
 * Get all products with filtering, sorting, and pagination
 */
exports.getAllProducts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'createdAt', 
      order = 'DESC',
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      featured
    } = req.query;

    const filters = {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      featured: featured === 'true'
    };

    const products = await productService.getAllProducts({
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      order,
      ...filters
    });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ID or slug
 */
exports.getProduct = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let product;

    // Check if identifier is UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
    
    if (isUUID) {
      product = await productService.getProductById(identifier);
    } else {
      product = await productService.getProductBySlug(identifier);
    }

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * Get related products
 */
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    const relatedProducts = await productService.getRelatedProducts(id, parseInt(limit));
    
    res.status(200).json(relatedProducts);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product
 */
exports.createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    
    const newProduct = await productService.createProduct(productData);
    
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a product
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedProduct = await productService.updateProduct(id, updateData);
    
    if (!updatedProduct) {
      throw new NotFoundError('Product not found');
    }
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await productService.deleteProduct(id);
    
    if (!result) {
      throw new NotFoundError('Product not found');
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Get all product categories
 */
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await productService.getAllCategories();
    
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

/**
 * Upload product images
 */
exports.uploadProductImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!req.files || req.files.length === 0) {
      throw new ValidationError('No images uploaded');
    }
    
    const imageUrls = req.files.map(file => file.path);
    
    const images = await productService.addProductImages(id, imageUrls);
    
    res.status(201).json(images);
  } catch (error) {
    next(error);
  }
};
