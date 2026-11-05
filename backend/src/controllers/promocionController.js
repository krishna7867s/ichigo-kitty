const modelo = require('../models/promocionModel');

function listar(req, res) {
  res.status(200).json(modelo.obtenerTodos());
}

function obtenerPorId(req, res) {
  const registro = modelo.obtenerPorId(Number(req.params.id));
  if (!registro) {
    return res.status(404).json({ error: 'Promoción no encontrado' });
  }
  res.status(200).json(registro);
}

function crear(req, res) {
  if (!req.body.codigo || !String(req.body.codigo).trim()) return res.status(400).json({ error: 'El código promocional es obligatorio' });
  if (!req.body.nombre_campana || !String(req.body.nombre_campana).trim()) return res.status(400).json({ error: 'El nombre de la campaña es obligatorio' });
  if (!Number(req.body.porcentaje_descuento) || Number(req.body.porcentaje_descuento) <= 0 || Number(req.body.porcentaje_descuento) > 90) return res.status(400).json({ error: 'El porcentaje de descuento debe estar entre 1 y 90' });
  if (!req.body.descripcion || !String(req.body.descripcion).trim()) return res.status(400).json({ error: 'La descripción de la campaña es obligatoria' });
  try {
    const creado = modelo.crear(req.body);
    res.status(201).json(creado);
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar promoción: datos inválidos o duplicados' });
  }
}

function actualizar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Promoción no encontrado' });
  }
  if (!req.body.codigo || !String(req.body.codigo).trim()) return res.status(400).json({ error: 'El código promocional es obligatorio' });
  if (!req.body.nombre_campana || !String(req.body.nombre_campana).trim()) return res.status(400).json({ error: 'El nombre de la campaña es obligatorio' });
  if (!Number(req.body.porcentaje_descuento) || Number(req.body.porcentaje_descuento) <= 0 || Number(req.body.porcentaje_descuento) > 90) return res.status(400).json({ error: 'El porcentaje de descuento debe estar entre 1 y 90' });
  if (!req.body.descripcion || !String(req.body.descripcion).trim()) return res.status(400).json({ error: 'La descripción de la campaña es obligatoria' });
  try {
    const actualizado = modelo.actualizar(id, req.body);
    res.status(200).json(actualizado);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar promoción' });
  }
}

function eliminar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Promoción no encontrado' });
  }
  try {
    modelo.eliminar(id);
    res.status(204).send();
  } catch (err) {
    res.status(409).json({
      error: 'No se puede eliminar promoción porque tiene registros asociados'
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
