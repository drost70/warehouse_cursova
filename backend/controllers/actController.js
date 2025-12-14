const { Act } = require('../models');

exports.create = async (req, res) => {
const { number, date, type, details, total } = req.body;
const a = await Act.create({ number, date, type, details, total });
res.status(201).json(a);
};
exports.list = async (req, res) => res.json(await Act.findAll());
exports.get = async (req, res) => {
const a = await Act.findByPk(req.params.id);
if(!a) return res.status(404).send({ error: 'Not found' });
res.json(a);
};