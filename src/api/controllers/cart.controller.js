const cartService = require('../../services/cart.service');
const { NotFoundError, ValidationError } = require('../../utils/errors');

/**
 * Get cart for current user or session
 */
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];

    if (!userId && !sessionId) {
      throw new ValidationError('User ID or Session ID is required');
    }

    const cart = await cartService.getCart(userId, sessionId);
    
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

/**
 * Add item to cart
 */
exports.addCartItem = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];
    const { productId, quantity = 1 } = req.body;

    if (!userId && !sessionId) {
      throw new ValidationError('User ID or Session ID is required');
    }

    if (!productId) {
      throw new ValidationError('Product ID is required');
    }

    const cartItem = await cartService.addCartItem(userId, sessionId, productId, quantity);
    
    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Update cart item quantity
 */
exports.updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user ? req.user.id : null;
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];

    if (!userId && !sessionId) {
      throw new ValidationError('User ID or Session ID is required');
    }

    if (!quantity || quantity < 1) {
      throw new ValidationError('Valid quantity is required');
    }

    const updatedItem = await cartService.updateCartItem(id, quantity, userId, sessionId);
    
    if (!updatedItem) {
      throw new NotFoundError('Cart item not found');
    }
    
    res.status(200).json(updatedItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove item from cart
 */
exports.removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];

    if (!userId && !sessionId) {
      throw new ValidationError('User ID or Session ID is required');
    }

    const result = await cartService.removeCartItem(id, userId, sessionId);
    
    if (!result) {
      throw new NotFoundError('Cart item not found');
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Clear cart
 */
exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];

    if (!userId && !sessionId) {
      throw new ValidationError('User ID or Session ID is required');
    }

    await cartService.clearCart(userId, sessionId);
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
