const logger = require('../utils/logger');

class NotificationObserver {
  constructor() {
    this.subscribers = [];
    this.wss = null;
  }

  subscribe(fn) { this.subscribers.push(fn); }
  unsubscribe(fn) { this.subscribers = this.subscribers.filter(s => s !== fn); }

  setWebSocketServer(wss) {
    this.wss = wss;
  }

  notify(product) {
    for (const s of this.subscribers) {
      try { s(product); } catch (e) { logger.error('Observer error: ' + e.message); }
    }

    if (this.wss) {
      const msg = {
        type: 'warning',
        text: `Продукт "${product.name}" (SKU=${product.sku}) на мінімальному запасі: ${product.quantity} <= ${product.minStock}`
      };
      this.wss.clients.forEach(client => {
        if (client.readyState === 1) client.send(JSON.stringify(msg));
      });
    }
  }
}

const notificationObserver = new NotificationObserver();

notificationObserver.subscribe((product) => {
  if (product.quantity <= product.minStock) {
    logger.warn(`Product ${product.name} (sku=${product.sku}) at or below minStock (${product.quantity} <= ${product.minStock})`);
  }
});

module.exports = notificationObserver;
