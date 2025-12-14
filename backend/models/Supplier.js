module.exports = (sequelize, DataTypes) => {
const Supplier = sequelize.define('Supplier', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
name: { type: DataTypes.STRING, allowNull: false },
taxId: { type: DataTypes.STRING },
contactPerson: { type: DataTypes.STRING },
phone: { type: DataTypes.STRING },
email: { type: DataTypes.STRING },
address: { type: DataTypes.TEXT },
}, { tableName: 'suppliers' });


Supplier.associate = (models) => {
Supplier.hasMany(models.Product, { foreignKey: 'supplierId' });
Supplier.hasMany(models.Invoice, { foreignKey: 'supplierId' });
};


return Supplier;
};