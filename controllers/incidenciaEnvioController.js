const modelo = require('../models/incidenciaEnvioModel');

function listar(req, res) {
  res.status(200).json(modelo.obtenerTodos());
}

function obtenerPorId(req, res) {
  const registro = modelo.obtenerPorId(Number(req.params.id));
  if (!registro) {
    return res.status(404).json({ error: 'Incidencia de envío no encontrado' });
  }
  res.status(200).json(registro);
}

function crear(req, res) {
  if (!Number(req.body.pedido_id)) return res.status(400).json({ error: 'El pedido es obligatorio' });
  if (!req.body.tipo_incidencia || !String(req.body.tipo_incidencia).trim()) return res.status(400).json({ error: 'El tipo de incidencia es obligatorio' });
  if (!req.body.descripcion_problema || !String(req.body.descripcion_problema).trim()) return res.status(400).json({ error: 'La descripción del problema es obligatoria' });
  if (!req.body.solucion_aplicada || !String(req.body.solucion_aplicada).trim()) return res.status(400).json({ error: 'La solución aplicada es obligatoria' });
  try {
    const creado = modelo.crear(req.body);
    res.status(201).json(creado);
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar incidencia de envío: datos inválidos o duplicados' });
  }
}

function actualizar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Incidencia de envío no encontrado' });
  }
  if (!Number(req.body.pedido_id)) return res.status(400).json({ error: 'El pedido es obligatorio' });
  if (!req.body.tipo_incidencia || !String(req.body.tipo_incidencia).trim()) return res.status(400).json({ error: 'El tipo de incidencia es obligatorio' });
  if (!req.body.descripcion_problema || !String(req.body.descripcion_problema).trim()) return res.status(400).json({ error: 'La descripción del problema es obligatoria' });
  if (!req.body.solucion_aplicada || !String(req.body.solucion_aplicada).trim()) return res.status(400).json({ error: 'La solución aplicada es obligatoria' });
  try {
    const actualizado = modelo.actualizar(id, req.body);
    res.status(200).json(actualizado);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar incidencia de envío' });
  }
}

function eliminar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Incidencia de envío no encontrado' });
  }
  try {
    modelo.eliminar(id);
    res.status(204).send();
  } catch (err) {
    res.status(409).json({
      error: 'No se puede eliminar incidencia de envío porque tiene registros asociados'
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
