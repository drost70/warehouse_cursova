const { Sequelize } = require('sequelize');
const config = require('./config');

let sequelizeInstance = null;


function getSequelize() {
if (sequelizeInstance) return sequelizeInstance;
sequelizeInstance = new Sequelize(
config.db.database,
config.db.username,
config.db.password,
{
host: config.db.host,
dialect: config.db.dialect,
logging: false
}
);
return sequelizeInstance;
}


module.exports = getSequelize();