const modelo = require('../models/almacenModel');

function listar(req, res) {
  res.status(200).json(modelo.obtenerTodos());
}

function obtenerPorId(req, res) {
  const registro = modelo.obtenerPorId(Number(req.params.id));
  if (!registro) {
    return res.status(404).json({ error: 'Almacén no encontrado' });
  }
  res.status(200).json(registro);
}

function crear(req, res) {
  if (!req.body.nombre || !String(req.body.nombre).trim()) return res.status(400).json({ error: 'El nombre del almacén es obligatorio' });
  if (!req.body.ubicacion || !String(req.body.ubicacion).trim()) return res.status(400).json({ error: 'La ubicación es obligatoria' });
  if (!Number(req.body.capacidad_maxima) || Number(req.body.capacidad_maxima) <= 0) return res.status(400).json({ error: 'La capacidad máxima debe ser mayor a 0' });
  if (!req.body.responsable || !String(req.body.responsable).trim()) return res.status(400).json({ error: 'El responsable es obligatorio' });
  try {
    const creado = modelo.crear(req.body);
    res.status(201).json(creado);
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar almacén: datos inválidos o duplicados' });
  }
}

function actualizar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Almacén no encontrado' });
  }
  if (!req.body.nombre || !String(req.body.nombre).trim()) return res.status(400).json({ error: 'El nombre del almacén es obligatorio' });
  if (!req.body.ubicacion || !String(req.body.ubicacion).trim()) return res.status(400).json({ error: 'La ubicación es obligatoria' });
  if (!Number(req.body.capacidad_maxima) || Number(req.body.capacidad_maxima) <= 0) return res.status(400).json({ error: 'La capacidad máxima debe ser mayor a 0' });
  if (!req.body.responsable || !String(req.body.responsable).trim()) return res.status(400).json({ error: 'El responsable es obligatorio' });
  try {
    const actualizado = modelo.actualizar(id, req.body);
    res.status(200).json(actualizado);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar almacén' });
  }
}

function eliminar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Almacén no encontrado' });
  }
  try {
    modelo.eliminar(id);
    res.status(204).send();
  } catch (err) {
    res.status(409).json({
      error: 'No se puede eliminar almacén porque tiene registros asociados'
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
