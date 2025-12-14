class ValuationStrategy {
  calculate(items) {
    throw new Error('Not implemented');
  }
}

class AverageValuation extends ValuationStrategy {
  calculate(items) {
    let totalQ = 0, totalV = 0;
    for (const it of items) {
      totalQ += Number(it.quantity);
      totalV += Number(it.quantity) * Number(it.unitPrice);
    }
    return totalV;
  }
}

class FIFOSimpleValuation extends ValuationStrategy {
  calculate(items) {
    let total = 0;
    for (const it of items) total += Number(it.unitPrice) * Number(it.quantity);
    return total;
  }
}

class LIFOSimpleValuation extends ValuationStrategy {
  calculate(items) {
    let total = 0;
    for (let i = items.length - 1; i >= 0; i--) {
      total += Number(items[i].unitPrice) * Number(items[i].quantity);
    }
    return total;
  }
}

module.exports = { ValuationStrategy, AverageValuation, FIFOSimpleValuation, LIFOSimpleValuation };
