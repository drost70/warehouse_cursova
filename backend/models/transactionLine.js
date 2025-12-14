const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
const TransactionLine = sequelize.define('TransactionLine', {
id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
productId: { type: DataTypes.UUID, allowNull: false },
quantity: { type: DataTypes.INTEGER, allowNull: false },
unitPrice: { type: DataTypes.DECIMAL(12,2), allowNull: false }
}, {
tableName: 'transaction_lines',
timestamps: true
});


return TransactionLine;
};