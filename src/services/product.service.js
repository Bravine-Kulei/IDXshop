const { Op } = require('sequelize');
const { 
  Product, 
  Category, 
  ProductImage, 
  ProductCategory 
} = require('../db/models');
const { NotFoundError, ValidationError } = require('../utils/errors');
const slugify = require('slugify');

/**
 * Get all products with filtering, sorting, and pagination
 */
exports.getAllProducts = async ({ 
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
}) => {
  const offset = (page - 1) * limit;
  const where = { isActive: true };
  
  // Apply filters
  if (brand) {
    where.brand = brand;
  }
  
  if (minPrice !== undefined) {
    where.regularPrice = {
      ...where.regularPrice,
      [Op.gte]: minPrice
    };
  }
  
  if (maxPrice !== undefined) {
    where.regularPrice = {
      ...where.regularPrice,
      [Op.lte]: maxPrice
    };
  }
  
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { model: { [Op.iLike]: `%${search}%` } }
    ];
  }
  
  if (featured !== undefined) {
    where.featured = featured;
  }
  
  // Build include for category filter
  const include = [
    {
      model: ProductImage,
      as: 'images',
      attributes: ['id', 'imageUrl', 'altText', 'isPrimary'],
      required: false
    },
    {
      model: Category,
      as: 'categories',
      attributes: ['id', 'name', 'slug'],
      through: { attributes: [] },
      required: category ? true : false
    }
  ];
  
  if (category) {
    include[1].where = { id: category };
  }
  
  // Execute query
  const { count, rows } = await Product.findAndCountAll({
    where,
    include,
    order: [[sort, order]],
    limit,
    offset,
    distinct: true
  });
  
  return {
    products: rows,
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
};

/**
 * Get product by ID
 */
exports.getProductById = async (id) => {
  return Product.findByPk(id, {
    include: [
      {
        model: ProductImage,
        as: 'images',
        attributes: ['id', 'imageUrl', 'altText', 'isPrimary'],
        order: [['displayOrder', 'ASC'], ['isPrimary', 'DESC']]
      },
      {
        model: Category,
        as: 'categories',
        attributes: ['id', 'name', 'slug'],
        through: { attributes: [] }
      }
    ]
  });
};

/**
 * Get product by slug
 */
exports.getProductBySlug = async (slug) => {
  return Product.findOne({
    where: { slug, isActive: true },
    include: [
      {
        model: ProductImage,
        as: 'images',
        attributes: ['id', 'imageUrl', 'altText', 'isPrimary'],
        order: [['displayOrder', 'ASC'], ['isPrimary', 'DESC']]
      },
      {
        model: Category,
        as: 'categories',
        attributes: ['id', 'name', 'slug'],
        through: { attributes: [] }
      }
    ]
  });
};

/**
 * Get related products
 */
exports.getRelatedProducts = async (productId, limit = 4) => {
  const product = await this.getProductById(productId);
  
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  
  // Get category IDs from the product
  const categoryIds = product.categories.map(category => category.id);
  
  // Find products in the same categories
  const relatedProducts = await Product.findAll({
    where: {
      id: { [Op.ne]: productId },
      isActive: true
    },
    include: [
      {
        model: Category,
        as: 'categories',
        attributes: ['id'],
        through: { attributes: [] },
        where: { id: { [Op.in]: categoryIds } }
      },
      {
        model: ProductImage,
        as: 'images',
        attributes: ['id', 'imageUrl', 'altText', 'isPrimary'],
        required: false,
        limit: 1
      }
    ],
    limit,
    order: [['createdAt', 'DESC']]
  });
  
  return relatedProducts;
};

/**
 * Create a new product
 */
exports.createProduct = async (productData) => {
  const { categories, images, ...data } = productData;
  
  // Generate slug if not provided
  if (!data.slug) {
    data.slug = slugify(data.name, { lower: true });
  }
  
  // Create product
  const product = await Product.create(data);
  
  // Add categories if provided
  if (categories && categories.length > 0) {
    await Promise.all(
      categories.map(async (categoryId, index) => {
        await ProductCategory.create({
          productId: product.id,
          categoryId,
          isPrimary: index === 0 // First category is primary
        });
      })
    );
  }
  
  // Add images if provided
  if (images && images.length > 0) {
    await Promise.all(
      images.map(async (image, index) => {
        await ProductImage.create({
          productId: product.id,
          imageUrl: image.url,
          altText: image.altText || product.name,
          displayOrder: index,
          isPrimary: index === 0 // First image is primary
        });
      })
    );
  }
  
  // Return the complete product
  return this.getProductById(product.id);
};

/**
 * Update a product
 */
exports.updateProduct = async (id, updateData) => {
  const { categories, images, ...data } = updateData;
  
  // Find the product
  const product = await Product.findByPk(id);
  
  if (!product) {
    return null;
  }
  
  // Update slug if name is changed and slug is not provided
  if (data.name && !data.slug) {
    data.slug = slugify(data.name, { lower: true });
  }
  
  // Update product
  await product.update(data);
  
  // Update categories if provided
  if (categories && categories.length > 0) {
    // Remove existing categories
    await ProductCategory.destroy({ where: { productId: id } });
    
    // Add new categories
    await Promise.all(
      categories.map(async (categoryId, index) => {
        await ProductCategory.create({
          productId: id,
          categoryId,
          isPrimary: index === 0 // First category is primary
        });
      })
    );
  }
  
  // Return the updated product
  return this.getProductById(id);
};

/**
 * Delete a product
 */
exports.deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  
  if (!product) {
    return false;
  }
  
  await product.destroy();
  return true;
};

/**
 * Get all categories
 */
exports.getAllCategories = async () => {
  return Category.findAll({
    where: { isActive: true },
    attributes: ['id', 'name', 'slug', 'description', 'imageUrl'],
    order: [['displayOrder', 'ASC'], ['name', 'ASC']]
  });
};

/**
 * Add images to a product
 */
exports.addProductImages = async (productId, imageUrls) => {
  const product = await Product.findByPk(productId);
  
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  
  // Get current highest display order
  const maxOrderImage = await ProductImage.findOne({
    where: { productId },
    order: [['displayOrder', 'DESC']],
    limit: 1
  });
  
  const startOrder = maxOrderImage ? maxOrderImage.displayOrder + 1 : 0;
  
  // Add new images
  const images = await Promise.all(
    imageUrls.map(async (url, index) => {
      return ProductImage.create({
        productId,
        imageUrl: url,
        altText: product.name,
        displayOrder: startOrder + index,
        isPrimary: !maxOrderImage && index === 0 // Only set as primary if no other images exist
      });
    })
  );
  
  return images;
};
