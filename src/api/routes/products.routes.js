const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validateProductCreate, validateProductUpdate } = require('../validators/product.validator');
const upload = require('../middlewares/upload.middleware');

// Public routes
router.get('/', productsController.getAllProducts);
router.get('/categories', productsController.getAllCategories);
router.get('/:identifier', productsController.getProduct);
router.get('/:id/related', productsController.getRelatedProducts);

// Protected routes (admin only)
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  validateProductCreate,
  productsController.createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  validateProductUpdate,
  productsController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  productsController.deleteProduct
);

router.post(
  '/:id/images',
  authenticate,
  authorize(['admin']),
  upload.array('images', 10),
  productsController.uploadProductImages
);

module.exports = router;
