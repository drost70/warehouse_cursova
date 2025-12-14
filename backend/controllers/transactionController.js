const TransactionFactory = require('../services/TransactionFactory');
const notificationObserver = require('../services/NotificationObserver');
const { Transaction, TransactionLine, Product } = require('../models');

exports.create = async (req, res) => {
  try {
    const { type, refNumber, date, lines } = req.body;

    const trx = await TransactionFactory.createTransaction({ type, refNumber, date, lines });

    for (const l of lines) {
      const prod = await Product.findByPk(l.productId);
      if (prod) notificationObserver.notify(prod);
    }

    res.status(201).json(trx);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.list = async (req, res) => {
  try {
    const list = await Transaction.findAll({
      include: [
        {
          model: TransactionLine,
          as: 'lines',
          include: [Product]
        }
      ],
      order: [['date', 'DESC']]
    });

    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
