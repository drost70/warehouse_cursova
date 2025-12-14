const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('ws');
const { sequelize, ...models } = require('./models');

const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reportsRouter = require('./routes/reports');
const invoiceRoutes = require('./routes/invoiceRoutes');
const contractorRoutes = require('./routes/contractorRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const actRoutes = require('./routes/actRoutes');

const NotificationObserver = require('./services/NotificationObserver');

const app = express();

app.use(cors());
app.use(express.json());

app.set('models', models);

app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportsRouter);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/contractors', contractorRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/acts', actRoutes);

const server = http.createServer(app);

const wss = new Server({ server });
NotificationObserver.setWebSocketServer(wss);

wss.on('connection', (ws) => {
  console.log('New WS client connected');
  ws.send(JSON.stringify({ type: 'info', text: 'Підключено до WS сервера' }));
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
    await sequelize.sync({ alter: true });
    console.log('Models synchronized!');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
})();

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
