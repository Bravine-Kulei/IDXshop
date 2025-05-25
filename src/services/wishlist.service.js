const { Wishlist, WishlistItem, Product, ProductImage } = require('../db/models');
const { NotFoundError } = require('../utils/errors');

/**
 * Get or create default wishlist for user
 */
const getOrCreateDefaultWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({
    where: { userId, name: 'Default Wishlist' }
  });
  
  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId,
      name: 'Default Wishlist',
      isPublic: false
    });
  }
  
  return wishlist;
};

/**
 * Get all wishlists for a user
 */
exports.getWishlists = async (userId) => {
  // Ensure user has a default wishlist
  await getOrCreateDefaultWishlist(userId);
  
  // Get all wishlists with item count
  const wishlists = await Wishlist.findAll({
    where: { userId },
    include: [
      {
        model: WishlistItem,
        as: 'items',
        attributes: ['id']
      }
    ],
    order: [['createdAt', 'ASC']]
  });
  
  // Transform to include item count
  return wishlists.map(wishlist => ({
    ...wishlist.toJSON(),
    itemCount: wishlist.items.length,
    items: undefined
  }));
};

/**
 * Get wishlist by ID with items
 */
exports.getWishlistById = async (id) => {
  return Wishlist.findByPk(id, {
    include: [
      {
        model: WishlistItem,
        as: 'items',
        include: [
          {
            model: Product,
            include: [
              {
                model: ProductImage,
                as: 'images',
                where: { isPrimary: true },
                required: false,
                limit: 1
              }
            ]
          }
        ]
      }
    ]
  });
};

/**
 * Create a new wishlist
 */
exports.createWishlist = async (userId, name, isPublic = false) => {
  const wishlist = await Wishlist.create({
    userId,
    name,
    isPublic
  });
  
  return wishlist;
};

/**
 * Update a wishlist
 */
exports.updateWishlist = async (id, { name, isPublic }) => {
  const wishlist = await Wishlist.findByPk(id);
  
  if (!wishlist) {
    throw new NotFoundError('Wishlist not found');
  }
  
  const updateData = {};
  
  if (name !== undefined) {
    updateData.name = name;
  }
  
  if (isPublic !== undefined) {
    updateData.isPublic = isPublic;
  }
  
  await wishlist.update(updateData);
  
  return wishlist;
};

/**
 * Delete a wishlist
 */
exports.deleteWishlist = async (id) => {
  const wishlist = await Wishlist.findByPk(id);
  
  if (!wishlist) {
    throw new NotFoundError('Wishlist not found');
  }
  
  // Don't allow deleting the default wishlist
  if (wishlist.name === 'Default Wishlist') {
    throw new Error('Cannot delete the default wishlist');
  }
  
  await wishlist.destroy();
  return true;
};

/**
 * Add item to wishlist
 */
exports.addWishlistItem = async (wishlistId, productId, notes = null) => {
  // Check if product exists
  const product = await Product.findByPk(productId);
  
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  
  // Check if wishlist exists
  const wishlist = await Wishlist.findByPk(wishlistId);
  
  if (!wishlist) {
    throw new NotFoundError('Wishlist not found');
  }
  
  // Check if item already in wishlist
  let wishlistItem = await WishlistItem.findOne({
    where: { wishlistId, productId }
  });
  
  if (wishlistItem) {
    // Update notes if item already exists
    if (notes !== null) {
      wishlistItem = await wishlistItem.update({ notes });
    }
  } else {
    // Create new wishlist item
    wishlistItem = await WishlistItem.create({
      wishlistId,
      productId,
      notes
    });
  }
  
  // Return item with product details
  return WishlistItem.findByPk(wishlistItem.id, {
    include: [{ model: Product }]
  });
};

/**
 * Remove item from wishlist
 */
exports.removeWishlistItem = async (itemId) => {
  const wishlistItem = await WishlistItem.findByPk(itemId);
  
  if (!wishlistItem) {
    throw new NotFoundError('Wishlist item not found');
  }
  
  await wishlistItem.destroy();
  return true;
};
