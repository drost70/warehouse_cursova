module.exports = (sequelize, DataTypes) => {
const Contractor = sequelize.define('Contractor', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
name: { type: DataTypes.STRING, allowNull: false },
taxId: { type: DataTypes.STRING },
contactPerson: { type: DataTypes.STRING },
phone: { type: DataTypes.STRING },
email: { type: DataTypes.STRING },
address: { type: DataTypes.TEXT },
}, { tableName: 'contractors' });


Contractor.associate = (models) => {
Contractor.hasMany(models.Invoice, { foreignKey: 'contractorId' });
};


return Contractor;
};