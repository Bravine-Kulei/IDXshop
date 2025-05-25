const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');
const { validateCartItem } = require('../validators/cart.validator');

// All routes use optional authentication to handle both logged-in and guest users
router.get('/', optionalAuth, cartController.getCart);

router.post(
  '/items',
  optionalAuth,
  validateCartItem,
  cartController.addCartItem
);

router.put(
  '/items/:id',
  optionalAuth,
  cartController.updateCartItem
);

router.delete(
  '/items/:id',
  optionalAuth,
  cartController.removeCartItem
);

router.delete(
  '/',
  optionalAuth,
  cartController.clearCart
);

module.exports = router;
