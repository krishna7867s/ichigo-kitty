const modelo = require('../models/inventarioAlmacenModel');

function listar(req, res) {
  res.status(200).json(modelo.obtenerTodos());
}

function obtenerPorId(req, res) {
  const registro = modelo.obtenerPorId(Number(req.params.id));
  if (!registro) {
    return res.status(404).json({ error: 'Inventario de almacén no encontrado' });
  }
  res.status(200).json(registro);
}

function crear(req, res) {
  if (!Number(req.body.almacen_id)) return res.status(400).json({ error: 'El almacén es obligatorio' });
  if (!Number(req.body.producto_id)) return res.status(400).json({ error: 'El producto es obligatorio' });
  if (req.body.cantidad === undefined || Number(req.body.cantidad) < 0) return res.status(400).json({ error: 'La cantidad debe ser mayor o igual a 0' });
  try {
    const creado = modelo.crear(req.body);
    res.status(201).json(creado);
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar inventario de almacén: datos inválidos o duplicados' });
  }
}

function actualizar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Inventario de almacén no encontrado' });
  }
  if (!Number(req.body.almacen_id)) return res.status(400).json({ error: 'El almacén es obligatorio' });
  if (!Number(req.body.producto_id)) return res.status(400).json({ error: 'El producto es obligatorio' });
  if (req.body.cantidad === undefined || Number(req.body.cantidad) < 0) return res.status(400).json({ error: 'La cantidad debe ser mayor o igual a 0' });
  try {
    const actualizado = modelo.actualizar(id, req.body);
    res.status(200).json(actualizado);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar inventario de almacén' });
  }
}

function eliminar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Inventario de almacén no encontrado' });
  }
  try {
    modelo.eliminar(id);
    res.status(204).send();
  } catch (err) {
    res.status(409).json({
      error: 'No se puede eliminar inventario de almacén porque tiene registros asociados'
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
