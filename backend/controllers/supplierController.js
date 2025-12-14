const { Supplier } = require('../models');


exports.list = async (req, res) => {
const suppliers = await Supplier.findAll();
res.json(suppliers);
};


exports.get = async (req, res) => {
const s = await Supplier.findByPk(req.params.id);
if (!s) return res.status(404).send({ error: 'Not found' });
res.json(s);
};


exports.create = async (req, res) => {
const s = await Supplier.create(req.body);
res.status(201).json(s);
};


exports.update = async (req, res) => {
const s = await Supplier.findByPk(req.params.id);
if (!s) return res.status(404).send({ error: 'Not found' });
await s.update(req.body);
res.json(s);
};


exports.remove = async (req, res) => {
const s = await Supplier.findByPk(req.params.id);
if (!s) return res.status(404).send({ error: 'Not found' });
await s.destroy();
res.status(204).send();
};