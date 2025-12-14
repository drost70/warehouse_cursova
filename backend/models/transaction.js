const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
const Transaction = sequelize.define('Transaction', {
id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
type: { type: DataTypes.ENUM('IN','OUT','ADJUST'), allowNull: false },
refNumber: { type: DataTypes.STRING },
date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
totalAmount: { type: DataTypes.DECIMAL(14,2), defaultValue: 0 }
}, {
tableName: 'transactions',
timestamps: true
});


return Transaction;
};