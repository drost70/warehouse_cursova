const { Product, Transaction, TransactionLine } = require('../models');
const { Op } = require('sequelize');

class ValuationStrategy {
  calculate(items) {
    throw new Error('Not implemented');
  }
}

class FIFOSimpleValuation extends ValuationStrategy {
  calculate(items) {
    return items.map(p => {
      const qty = Number(p.quantity) || 0;
      const price = Number(p.unitPrice) || 0;
      return {
        productId: p.id,
        name: p.name,
        sku: p.sku,
        quantity: qty,
        value: qty * price,
      };
    });
  }
}

class LIFOSimpleValuation extends ValuationStrategy {
  calculate(items) {
    return items.map(p => {
      const qty = Number(p.quantity) || 0;
      const price = Number(p.unitPrice) || 0;
      return {
        productId: p.id,
        name: p.name,
        sku: p.sku,
        quantity: qty,
        value: qty * price,
      };
    });
  }
}

exports.getValuation = async (req, res) => {
  try {
    const { strategy = 'FIFO' } = req.query;

    const products = await Product.findAll();
    const transactions = await Transaction.findAll({
      include: [{ model: TransactionLine, as: 'lines' }]
    });

    const productsWithQty = products.map(p => {
      let inQty = 0, outQty = 0;
      transactions.forEach(t => {
        const lines = t.lines || [];
        lines.forEach(l => {
          if (l.productId === p.id) {
            if (t.type === 'IN') inQty += Number(l.quantity) || 0;
            else if (t.type === 'OUT') outQty += Number(l.quantity) || 0;
          }
        });
      });
      return {
        ...p.get({ plain: true }),
        quantity: inQty - outQty,
        unitPrice: Number(p.unitPrice) || 0
      };
    });

    const valuationStrategy = strategy === 'FIFO' ? new FIFOSimpleValuation() : new LIFOSimpleValuation();
    const result = valuationStrategy.calculate(productsWithQty);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getStockOnDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const targetDate = new Date(date);
    targetDate.setHours(23, 59, 59, 999);

    const products = await Product.findAll();
    const transactions = await Transaction.findAll({
      where: { date: { [Op.lte]: targetDate } },
      include: [{ model: TransactionLine, as: 'lines' }]
    });

    const stockOnDate = products.map(p => {
      let inQty = 0, outQty = 0;
      transactions.forEach(t => {
        const lines = t.lines || [];
        lines.forEach(l => {
          if (l.productId === p.id) {
            if (t.type === 'IN') inQty += Number(l.quantity) || 0;
            else if (t.type === 'OUT') outQty += Number(l.quantity) || 0;
          }
        });
      });
      return {
        productId: p.id,
        name: p.name,
        sku: p.sku,
        quantity: inQty - outQty
      };
    });

    res.json(stockOnDate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
