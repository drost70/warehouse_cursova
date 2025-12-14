module.exports = (sequelize, DataTypes) => {
const Act = sequelize.define('Act', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
number: { type: DataTypes.STRING, unique: true },
date: { type: DataTypes.DATEONLY },
type: { type: DataTypes.STRING },
details: { type: DataTypes.TEXT },
total: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
}, { tableName: 'acts' });


return Act;
};