const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ProductImage = sequelize.define('ProductImage', {
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
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  altText: {
    type: DataTypes.STRING,
    allowNull: true
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = ProductImage;
