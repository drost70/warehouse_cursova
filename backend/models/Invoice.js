module.exports = (sequelize, DataTypes) => {
const Invoice = sequelize.define('Invoice', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
number: { type: DataTypes.STRING, allowNull: false, unique: true },
date: { type: DataTypes.DATEONLY, allowNull: false },
contractorId: { type: DataTypes.INTEGER, allowNull: false },
supplierId: { type: DataTypes.INTEGER },
total: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
status: { type: DataTypes.STRING, defaultValue: 'draft' }
}, { tableName: 'invoices' });


Invoice.associate = (models) => {
Invoice.belongsTo(models.Contractor, { foreignKey: 'contractorId' });
Invoice.belongsTo(models.Supplier, { foreignKey: 'supplierId' });
Invoice.hasMany(models.InvoiceItem, { foreignKey: 'invoiceId', as: 'items' });
};


return Invoice;
};