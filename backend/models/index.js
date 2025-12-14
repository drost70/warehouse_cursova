const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = require('./Product')(sequelize, DataTypes);
const Transaction = require('./Transaction')(sequelize, DataTypes);
const TransactionLine = require('./TransactionLine')(sequelize, DataTypes);
const Supplier = require('./Supplier')(sequelize, DataTypes);
const Contractor = require('./Contractor')(sequelize, DataTypes);
const Invoice = require('./Invoice')(sequelize, DataTypes);
const InvoiceItem = require('./InvoiceItem')(sequelize, DataTypes);
const Act = require('./Act')(sequelize, DataTypes);

const models = {
  Product,
  Transaction,
  TransactionLine,
  Supplier,
  Contractor,
  Invoice,
  InvoiceItem,
  Act
};

Transaction.hasMany(TransactionLine, { as: 'lines', foreignKey: 'transactionId' });
TransactionLine.belongsTo(Transaction, { foreignKey: 'transactionId' });

Product.hasMany(TransactionLine, { as: 'transactionLines', foreignKey: 'productId' });
TransactionLine.belongsTo(Product, { foreignKey: 'productId' });

Supplier.hasMany(Product, { foreignKey: 'supplierId' });
Product.belongsTo(Supplier, { foreignKey: 'supplierId' });

Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId' });

Contractor.hasMany(Invoice, { foreignKey: 'contractorId' });
Invoice.belongsTo(Contractor, { foreignKey: 'contractorId' });

Supplier.hasMany(Invoice, { foreignKey: 'supplierId' });
Invoice.belongsTo(Supplier, { foreignKey: 'supplierId' });

Product.hasMany(InvoiceItem, { foreignKey: 'productId' });
InvoiceItem.belongsTo(Product, { foreignKey: 'productId' });

Act.hasMany(Product, { as: 'items', foreignKey: 'actId' });

Contractor.hasMany(Act, { foreignKey: 'contractorId' });
Act.belongsTo(Contractor, { foreignKey: 'contractorId' });

Supplier.hasMany(Act, { foreignKey: 'supplierId' });
Act.belongsTo(Supplier, { foreignKey: 'supplierId' });

module.exports = { sequelize, Sequelize, ...models };
