const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const WishlistItem = sequelize.define('WishlistItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  wishlistId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Wishlists',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  addedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['wishlistId']
    },
    {
      fields: ['productId']
    },
    {
      unique: true,
      fields: ['wishlistId', 'productId']
    }
  ]
});

module.exports = WishlistItem;
