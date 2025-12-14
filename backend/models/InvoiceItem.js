module.exports = (sequelize, DataTypes) => {
  const InvoiceItem = sequelize.define(
    'InvoiceItem',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      invoiceId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
          model: 'invoices',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      productId: { 
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      qty: { type: DataTypes.INTEGER, allowNull: false },
      unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      lineTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    },
    { tableName: 'invoice_items', timestamps: true }
  );

  InvoiceItem.associate = (models) => {
    InvoiceItem.belongsTo(models.Invoice, { foreignKey: 'invoiceId' });
    InvoiceItem.belongsTo(models.Product, { foreignKey: 'productId' });
  };

  return InvoiceItem;
};
