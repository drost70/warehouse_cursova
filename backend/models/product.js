const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },

      name: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },

      sku: { 
        type: DataTypes.STRING, 
        unique: true 
      },

      supplier: {
        type: DataTypes.STRING,
        allowNull: false
      },

      unitPrice: { 
        type: DataTypes.DECIMAL(12, 2), 
        defaultValue: 0 
      },

      minStock: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
      },

      quantity: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
      }
    },
    {
      tableName: 'products',
      timestamps: true
    }
  );

  return Product;
};
