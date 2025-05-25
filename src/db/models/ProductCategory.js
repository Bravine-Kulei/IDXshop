const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

// Junction table for many-to-many relationship between products and categories
const ProductCategory = sequelize.define('ProductCategory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['productId', 'categoryId']
    }
  ]
});

module.exports = ProductCategory;
