const { Transaction, TransactionLine, Product, sequelize } = require('../models');
const logger = require('../utils/logger');
const notificationObserver = require('./NotificationObserver');

class TransactionFactory {
  static async createTransaction({ type, refNumber, date, lines, createdBy }) {
    return sequelize.transaction(async (t) => {
      const trx = await Transaction.create({ type, refNumber, date }, { transaction: t });

      let totalAmount = 0;
      for (const line of lines) {
        await TransactionLine.create(
          { transactionId: trx.id, productId: line.productId, quantity: line.quantity, unitPrice: line.unitPrice },
          { transaction: t }
        );

        totalAmount += Number(line.quantity) * Number(line.unitPrice);

        const product = await Product.findByPk(line.productId, { transaction: t });
        if (!product) throw new Error('Product not found: ' + line.productId);

        if (type === 'IN') {
          product.quantity = Number(product.quantity) + Number(line.quantity);
        } else if (type === 'OUT') {
          product.quantity = Number(product.quantity) - Number(line.quantity);
          if (product.quantity < 0) {
            logger.warn(`Product ${product.id} negative quantity after OUT: ${product.quantity}`);
          }
        } else if (type === 'ADJUST') {
          product.quantity = Number(line.quantity);
        }

        await product.save({ transaction: t });

        notificationObserver.notify(product);
      }

      trx.totalAmount = totalAmount;
      await trx.save({ transaction: t });

      return trx;
    });
  }
}

module.exports = TransactionFactory;
