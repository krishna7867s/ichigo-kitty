const modelo = require('../models/agenteEnvioModel');

function listar(req, res) {
  res.status(200).json(modelo.obtenerTodos());
}

function obtenerPorId(req, res) {
  const registro = modelo.obtenerPorId(Number(req.params.id));
  if (!registro) {
    return res.status(404).json({ error: 'Agente de envío no encontrado' });
  }
  res.status(200).json(registro);
}

function crear(req, res) {
  if (!req.body.nombre || !String(req.body.nombre).trim()) return res.status(400).json({ error: 'El nombre del agente es obligatorio' });
  if (!['Aéreo', 'Marítimo', 'Exprés'].includes(req.body.tipo_transporte)) return res.status(400).json({ error: 'El tipo de transporte debe ser Aéreo, Marítimo o Exprés' });
  if (!Number(req.body.tarifa_kg_usd) || Number(req.body.tarifa_kg_usd) <= 0) return res.status(400).json({ error: 'La tarifa por kg debe ser mayor a 0' });
  if (!req.body.contacto || !String(req.body.contacto).trim()) return res.status(400).json({ error: 'El contacto es obligatorio' });
  try {
    const creado = modelo.crear(req.body);
    res.status(201).json(creado);
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar agente de envío: datos inválidos o duplicados' });
  }
}

function actualizar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Agente de envío no encontrado' });
  }
  if (!req.body.nombre || !String(req.body.nombre).trim()) return res.status(400).json({ error: 'El nombre del agente es obligatorio' });
  if (!['Aéreo', 'Marítimo', 'Exprés'].includes(req.body.tipo_transporte)) return res.status(400).json({ error: 'El tipo de transporte debe ser Aéreo, Marítimo o Exprés' });
  if (!Number(req.body.tarifa_kg_usd) || Number(req.body.tarifa_kg_usd) <= 0) return res.status(400).json({ error: 'La tarifa por kg debe ser mayor a 0' });
  if (!req.body.contacto || !String(req.body.contacto).trim()) return res.status(400).json({ error: 'El contacto es obligatorio' });
  try {
    const actualizado = modelo.actualizar(id, req.body);
    res.status(200).json(actualizado);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar agente de envío' });
  }
}

function eliminar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Agente de envío no encontrado' });
  }
  try {
    modelo.eliminar(id);
    res.status(204).send();
  } catch (err) {
    res.status(409).json({
      error: 'No se puede eliminar agente de envío porque tiene registros asociados'
    });
  }
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
