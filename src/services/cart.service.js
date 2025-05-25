const { Cart, CartItem, Product, ProductImage } = require('../db/models');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { v4: uuidv4 } = require('uuid');

/**
 * Get or create cart for user or session
 */
const getOrCreateCart = async (userId, sessionId) => {
  let cart;
  
  if (userId) {
    // Find user's active cart
    cart = await Cart.findOne({
      where: { userId, status: 'active' }
    });
    
    if (!cart) {
      // Create new cart for user
      cart = await Cart.create({
        userId,
        status: 'active'
      });
    }
  } else if (sessionId) {
    // Find session cart
    cart = await Cart.findOne({
      where: { sessionId, status: 'active' }
    });
    
    if (!cart) {
      // Create new cart for session
      cart = await Cart.create({
        sessionId,
        status: 'active'
      });
    }
  } else {
    throw new ValidationError('User ID or Session ID is required');
  }
  
  return cart;
};

/**
 * Get cart with items
 */
exports.getCart = async (userId, sessionId) => {
  const cart = await getOrCreateCart(userId, sessionId);
  
  // Get cart with items
  const cartWithItems = await Cart.findByPk(cart.id, {
    include: [
      {
        model: CartItem,
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
  
  return cartWithItems;
};

/**
 * Add item to cart
 */
exports.addCartItem = async (userId, sessionId, productId, quantity) => {
  // Validate product exists and is in stock
  const product = await Product.findByPk(productId);
  
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  
  if (!product.isActive) {
    throw new ValidationError('Product is not available');
  }
  
  if (product.stockQuantity < quantity) {
    throw new ValidationError('Not enough stock available');
  }
  
  // Get or create cart
  const cart = await getOrCreateCart(userId, sessionId);
  
  // Check if product already in cart
  let cartItem = await CartItem.findOne({
    where: { cartId: cart.id, productId }
  });
  
  if (cartItem) {
    // Update quantity if already in cart
    const newQuantity = cartItem.quantity + quantity;
    
    if (product.stockQuantity < newQuantity) {
      throw new ValidationError('Not enough stock available');
    }
    
    cartItem = await cartItem.update({
      quantity: newQuantity,
      price: product.salePrice || product.regularPrice,
      totalPrice: (product.salePrice || product.regularPrice) * newQuantity
    });
  } else {
    // Add new item to cart
    cartItem = await CartItem.create({
      cartId: cart.id,
      productId,
      quantity,
      price: product.salePrice || product.regularPrice,
      totalPrice: (product.salePrice || product.regularPrice) * quantity
    });
  }
  
  // Update cart totals
  await updateCartTotals(cart.id);
  
  // Return updated cart item with product details
  return CartItem.findByPk(cartItem.id, {
    include: [{ model: Product }]
  });
};

/**
 * Update cart item quantity
 */
exports.updateCartItem = async (itemId, quantity, userId, sessionId) => {
  // Find cart item
  const cartItem = await CartItem.findByPk(itemId, {
    include: [
      { 
        model: Cart,
        where: userId ? { userId } : { sessionId }
      },
      { model: Product }
    ]
  });
  
  if (!cartItem) {
    return null;
  }
  
  // Check stock availability
  if (cartItem.Product.stockQuantity < quantity) {
    throw new ValidationError('Not enough stock available');
  }
  
  // Update quantity
  await cartItem.update({
    quantity,
    totalPrice: cartItem.price * quantity
  });
  
  // Update cart totals
  await updateCartTotals(cartItem.cartId);
  
  return cartItem;
};

/**
 * Remove item from cart
 */
exports.removeCartItem = async (itemId, userId, sessionId) => {
  // Find cart item
  const cartItem = await CartItem.findByPk(itemId, {
    include: [
      { 
        model: Cart,
        where: userId ? { userId } : { sessionId }
      }
    ]
  });
  
  if (!cartItem) {
    return false;
  }
  
  // Remove item
  await cartItem.destroy();
  
  // Update cart totals
  await updateCartTotals(cartItem.cartId);
  
  return true;
};

/**
 * Clear cart
 */
exports.clearCart = async (userId, sessionId) => {
  // Find cart
  const cart = await Cart.findOne({
    where: userId ? { userId, status: 'active' } : { sessionId, status: 'active' }
  });
  
  if (!cart) {
    return;
  }
  
  // Remove all items
  await CartItem.destroy({
    where: { cartId: cart.id }
  });
  
  // Update cart totals
  await updateCartTotals(cart.id);
};

/**
 * Update cart totals (item count and total amount)
 */
const updateCartTotals = async (cartId) => {
  // Get all items in cart
  const items = await CartItem.findAll({
    where: { cartId }
  });
  
  // Calculate totals
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => total + parseFloat(item.totalPrice), 0);
  
  // Update cart
  await Cart.update(
    {
      itemCount,
      totalAmount
    },
    { where: { id: cartId } }
  );
};
