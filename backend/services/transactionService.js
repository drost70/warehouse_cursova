const TransactionFactory = require('./TransactionFactory');

module.exports = {
  createTransaction: TransactionFactory.createTransaction.bind(TransactionFactory)
};
