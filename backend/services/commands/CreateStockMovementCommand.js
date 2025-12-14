const transactionService = require('../transactionService');

class CreateStockMovementCommand {
  constructor(productId, qty, unitPrice, type) {
    this.productId = productId;
    this.qty = qty;
    this.unitPrice = unitPrice;
    this.type = type;
  }

  async execute() {
    await transactionService.createTransaction({
      type: this.type,
      refNumber: `CMD-${Date.now()}`,
      date: new Date(),
      lines: [{ productId: this.productId, quantity: this.qty, unitPrice: this.unitPrice }],
      createdBy: 'system'
    });
  }
}

module.exports = CreateStockMovementCommand;
