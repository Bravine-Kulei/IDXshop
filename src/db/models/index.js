const sequelize = require('../../config/database');

// Import models
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const ProductImage = require('./ProductImage');
const ProductCategory = require('./ProductCategory');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Wishlist = require('./Wishlist');
const WishlistItem = require('./WishlistItem');

// Define associations
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

// Many-to-many relationship between Product and Category
Product.belongsToMany(Category, { 
  through: ProductCategory,
  foreignKey: 'productId',
  otherKey: 'categoryId',
  as: 'categories'
});

Category.belongsToMany(Product, { 
  through: ProductCategory,
  foreignKey: 'categoryId',
  otherKey: 'productId',
  as: 'products'
});

// Cart associations
Cart.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Cart, { foreignKey: 'userId' });

Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

CartItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });

// Wishlist associations
Wishlist.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Wishlist, { foreignKey: 'userId' });

Wishlist.hasMany(WishlistItem, { foreignKey: 'wishlistId', as: 'items' });
WishlistItem.belongsTo(Wishlist, { foreignKey: 'wishlistId' });

WishlistItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(WishlistItem, { foreignKey: 'productId' });

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Product,
  Category,
  ProductImage,
  ProductCategory,
  Cart,
  CartItem,
  Wishlist,
  WishlistItem
};
