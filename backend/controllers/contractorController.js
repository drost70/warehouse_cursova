const { Contractor } = require('../models');

exports.list = async (req, res) => res.json(await Contractor.findAll());
exports.get = async (req, res) => {
const c = await Contractor.findByPk(req.params.id);
if(!c) return res.status(404).send({ error: 'Not found' });
res.json(c);
};
exports.create = async (req, res) => res.status(201).json(await Contractor.create(req.body));
exports.update = async (req, res) => {
const c = await Contractor.findByPk(req.params.id);
if(!c) return res.status(404).send({ error: 'Not found' });
await c.update(req.body);
res.json(c);
};
exports.remove = async (req, res) => {
const c = await Contractor.findByPk(req.params.id);
if(!c) return res.status(404).send({ error: 'Not found' });
await c.destroy();
res.status(204).send();
};