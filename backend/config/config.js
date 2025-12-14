module.exports = {
db: {
database: process.env.DB_NAME || 'warehouse_db',
username: process.env.DB_USER || 'root',
password: process.env.DB_PASS || 'root',
host: process.env.DB_HOST || 'localhost',
dialect: 'mysql'
},
jwtSecret: process.env.JWT_SECRET || 'replace_this_secret'
};