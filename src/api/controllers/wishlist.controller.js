const wishlistService = require('../../services/wishlist.service');
const { NotFoundError, ValidationError, AuthorizationError } = require('../../utils/errors');

/**
 * Get user's wishlists
 */
exports.getWishlists = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const wishlists = await wishlistService.getWishlists(userId);
    
    res.status(200).json(wishlists);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific wishlist
 */
exports.getWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const wishlist = await wishlistService.getWishlistById(id);
    
    if (!wishlist) {
      throw new NotFoundError('Wishlist not found');
    }
    
    // Check if the wishlist belongs to the user or is public
    if (wishlist.userId !== userId && !wishlist.isPublic) {
      throw new AuthorizationError('You do not have permission to view this wishlist');
    }
    
    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new wishlist
 */
exports.createWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, isPublic = false } = req.body;
    
    if (!name) {
      throw new ValidationError('Wishlist name is required');
    }
    
    const newWishlist = await wishlistService.createWishlist(userId, name, isPublic);
    
    res.status(201).json(newWishlist);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a wishlist
 */
exports.updateWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, isPublic } = req.body;
    
    // Check if the wishlist belongs to the user
    const wishlist = await wishlistService.getWishlistById(id);
    
    if (!wishlist) {
      throw new NotFoundError('Wishlist not found');
    }
    
    if (wishlist.userId !== userId) {
      throw new AuthorizationError('You do not have permission to update this wishlist');
    }
    
    const updatedWishlist = await wishlistService.updateWishlist(id, { name, isPublic });
    
    res.status(200).json(updatedWishlist);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a wishlist
 */
exports.deleteWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if the wishlist belongs to the user
    const wishlist = await wishlistService.getWishlistById(id);
    
    if (!wishlist) {
      throw new NotFoundError('Wishlist not found');
    }
    
    if (wishlist.userId !== userId) {
      throw new AuthorizationError('You do not have permission to delete this wishlist');
    }
    
    await wishlistService.deleteWishlist(id);
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Add item to wishlist
 */
exports.addWishlistItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { productId, notes } = req.body;
    
    if (!productId) {
      throw new ValidationError('Product ID is required');
    }
    
    // Check if the wishlist belongs to the user
    const wishlist = await wishlistService.getWishlistById(id);
    
    if (!wishlist) {
      throw new NotFoundError('Wishlist not found');
    }
    
    if (wishlist.userId !== userId) {
      throw new AuthorizationError('You do not have permission to modify this wishlist');
    }
    
    const wishlistItem = await wishlistService.addWishlistItem(id, productId, notes);
    
    res.status(201).json(wishlistItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove item from wishlist
 */
exports.removeWishlistItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;
    const userId = req.user.id;
    
    // Check if the wishlist belongs to the user
    const wishlist = await wishlistService.getWishlistById(id);
    
    if (!wishlist) {
      throw new NotFoundError('Wishlist not found');
    }
    
    if (wishlist.userId !== userId) {
      throw new AuthorizationError('You do not have permission to modify this wishlist');
    }
    
    await wishlistService.removeWishlistItem(itemId);
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
