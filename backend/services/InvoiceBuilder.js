class InvoiceBuilder {
constructor() {
this.invoice = null;
this.items = [];
this.contractor = null;
}


setInvoice(invoice) { this.invoice = invoice; return this; }
setItems(items) { this.items = items; return this; }
setContractor(contractor) { this.contractor = contractor; return this; }


build() {
const items = this.items.map(i => ({
productId: i.productId,
qty: i.qty,
unitPrice: i.unitPrice,
lineTotal: i.lineTotal
}));
return {
number: this.invoice.number,
date: this.invoice.date,
total: this.invoice.total,
contractor: this.contractor,
items
};
}
}


module.exports = InvoiceBuilder;