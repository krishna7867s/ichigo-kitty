const modelo = require('../models/controlCalidadModel');

function listar(req, res) {
  res.status(200).json(modelo.obtenerTodos());
}

function obtenerPorId(req, res) {
  const registro = modelo.obtenerPorId(Number(req.params.id));
  if (!registro) {
    return res.status(404).json({ error: 'Control de calidad no encontrado' });
  }
  res.status(200).json(registro);
}

function crear(req, res) {
  if (!Number(req.body.pedido_id)) return res.status(400).json({ error: 'El pedido es obligatorio' });
  if (!Number(req.body.producto_id)) return res.status(400).json({ error: 'El producto es obligatorio' });
  if (!Number(req.body.unidades_revisadas) || Number(req.body.unidades_revisadas) <= 0) return res.status(400).json({ error: 'Las unidades revisadas deben ser mayores a 0' });
  if (!['Aprobado', 'Con detalles', 'Rechazado'].includes(req.body.resultado)) return res.status(400).json({ error: 'El resultado debe ser Aprobado, Con detalles o Rechazado' });
  if (!req.body.descripcion_inspeccion || !String(req.body.descripcion_inspeccion).trim()) return res.status(400).json({ error: 'La descripción de la inspección es obligatoria' });
  try {
    const creado = modelo.crear(req.body);
    res.status(201).json(creado);
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar control de calidad: datos inválidos o duplicados' });
  }
}

function actualizar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Control de calidad no encontrado' });
  }
  if (!Number(req.body.pedido_id)) return res.status(400).json({ error: 'El pedido es obligatorio' });
  if (!Number(req.body.producto_id)) return res.status(400).json({ error: 'El producto es obligatorio' });
  if (!Number(req.body.unidades_revisadas) || Number(req.body.unidades_revisadas) <= 0) return res.status(400).json({ error: 'Las unidades revisadas deben ser mayores a 0' });
  if (!['Aprobado', 'Con detalles', 'Rechazado'].includes(req.body.resultado)) return res.status(400).json({ error: 'El resultado debe ser Aprobado, Con detalles o Rechazado' });
  if (!req.body.descripcion_inspeccion || !String(req.body.descripcion_inspeccion).trim()) return res.status(400).json({ error: 'La descripción de la inspección es obligatoria' });
  try {
    const actualizado = modelo.actualizar(id, req.body);
    res.status(200).json(actualizado);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar control de calidad' });
  }
}

function eliminar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Control de calidad no encontrado' });
  }
  try {
    modelo.eliminar(id);
    res.status(204).send();
  } catch (err) {
    res.status(409).json({
      error: 'No se puede eliminar control de calidad porque tiene registros asociados'
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
