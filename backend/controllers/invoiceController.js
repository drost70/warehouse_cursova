const { Invoice, InvoiceItem, Product, Contractor, Supplier } = require('../models');
const CreateStockMovementCommand = require('../services/commands/CreateStockMovementCommand');
const transactionService = require('../services/transactionService'); 

exports.list = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        { association: 'items', include: [Product] },
        Contractor,
        Supplier
      ],
      order: [['id', 'ASC']]
    });
    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка при отриманні накладних' });
  }
};

exports.get = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { association: 'items', include: [Product] },
        Contractor,
        Supplier
      ]
    });
    if (!invoice) return res.status(404).json({ error: 'Накладна не знайдена' });
    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка при отриманні накладної' });
  }
};

exports.create = async (req, res) => {
  try {
    const { contractorId, supplierId, items } = req.body;

    if (!contractorId) return res.status(400).json({ error: 'Оберіть контрагента' });
    if (!items || items.length === 0) return res.status(400).json({ error: 'Додайте хоча б один товар' });

    const invoice = await Invoice.create({
      number: `INV-${Date.now()}`,
      date: new Date(),
      contractorId,
      supplierId,
      status: 'draft',
      total: 0
    });

    let total = 0;

    for (const it of items) {
      const product = await Product.findByPk(it.productId);
      if (!product) continue;

      const unitPrice = parseFloat(it.unitPrice) || parseFloat(product.unitPrice) || 0;
      const qty = parseInt(it.qty) || 0;
      const lineTotal = parseFloat((unitPrice * qty).toFixed(2));

      total += lineTotal;

      await InvoiceItem.create({
        invoiceId: invoice.id,
        productId: product.id,
        qty,
        unitPrice,
        lineTotal
      });
    }

    invoice.total = parseFloat(total.toFixed(2));
    await invoice.save();

    const createdInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        { association: 'items', include: [Product] },
        Contractor,
        Supplier
      ]
    });

    res.json(createdInvoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.issue = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { association: 'items', include: [Product] },
        Contractor,
        Supplier
      ]
    });
    if (!invoice) return res.status(404).json({ error: 'Накладна не знайдена' });

    for (const it of invoice.items) {
      const cmd = new CreateStockMovementCommand(transactionService, it.productId, it.qty, it.unitPrice, 'OUT');
      await cmd.execute();
    }

    invoice.status = 'issued';
    await invoice.save();

    res.json({ message: 'Накладну виписано', invoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await InvoiceItem.findAll({
      where: { invoiceId: req.params.invoiceId },
      include: [Product]
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка при отриманні items' });
  }
};
