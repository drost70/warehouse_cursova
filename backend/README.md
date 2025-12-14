# Warehouse Backend (Node.js + Express + MySQL)


1. Install dependencies:


```
npm install
```


2. Ensure MySQL is running and create database `warehouse_db` (or set env vars DB_NAME, DB_USER, DB_PASS, DB_HOST)


3. Run server:


```
npm run dev
# or
npm start
```


Endpoints:
- GET / => health check
- GET /api/products
- POST /api/products
- GET /api/products/:id
- PUT /api/products/:id
- DELETE /api/products/:id
- POST /api/transactions
- GET /api/transactions


Notes:
- This code uses simple Singleton (db, logger), Factory (TransactionFactory), Strategy (ValuationStrategy), Observer (NotificationObserver).
- Add migrations, auth, validation and tests before production.




// End of code bundle