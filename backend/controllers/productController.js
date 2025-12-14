const { Product } = require('../models');
const notificationObserver = require('../services/NotificationObserver');


exports.list = async (req, res) => {
try {
const items = await Product.findAll();
res.json(items);
} catch (e) { res.status(500).json({ error: e.message }); }
};


exports.create = async (req, res) => {
try {
const p = await Product.create(req.body);
notificationObserver.notify(p);
res.status(201).json(p);
} catch (e) { res.status(400).json({ error: e.message }); }
};


exports.get = async (req, res) => {
try {
const p = await Product.findByPk(req.params.id);
if (!p) return res.status(404).json({ error: 'Not found' });
res.json(p);
} catch (e) { res.status(500).json({ error: e.message }); }
};


exports.update = async (req, res) => {
try {
const p = await Product.findByPk(req.params.id);
if (!p) return res.status(404).json({ error: 'Not found' });
await p.update(req.body);
notificationObserver.notify(p);
res.json(p);
} catch (e) { res.status(400).json({ error: e.message }); }
};


exports.remove = async (req, res) => {
try {
const p = await Product.findByPk(req.params.id);
if (!p) return res.status(404).json({ error: 'Not found' });
await p.destroy();
res.json({ ok: true });
} catch (e) { res.status(500).json({ error: e.message }); }
};