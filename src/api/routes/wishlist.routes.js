const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateWishlist, validateWishlistItem } = require('../validators/wishlist.validator');

// All wishlist routes require authentication
router.use(authenticate);

// Wishlist routes
router.get('/', wishlistController.getWishlists);
router.get('/:id', wishlistController.getWishlist);

router.post(
  '/',
  validateWishlist,
  wishlistController.createWishlist
);

router.put(
  '/:id',
  validateWishlist,
  wishlistController.updateWishlist
);

router.delete(
  '/:id',
  wishlistController.deleteWishlist
);

// Wishlist item routes
router.post(
  '/:id/items',
  validateWishlistItem,
  wishlistController.addWishlistItem
);

router.delete(
  '/:id/items/:itemId',
  wishlistController.removeWishlistItem
);

module.exports = router;
