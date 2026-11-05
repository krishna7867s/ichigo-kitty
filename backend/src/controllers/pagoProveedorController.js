const modelo = require('../models/pagoProveedorModel');

function listar(req, res) {
  res.status(200).json(modelo.obtenerTodos());
}

function obtenerPorId(req, res) {
  const registro = modelo.obtenerPorId(Number(req.params.id));
  if (!registro) {
    return res.status(404).json({ error: 'Pago a proveedor no encontrado' });
  }
  res.status(200).json(registro);
}

function crear(req, res) {
  if (!Number(req.body.pedido_id)) return res.status(400).json({ error: 'El pedido es obligatorio' });
  if (!Number(req.body.metodo_pago_id)) return res.status(400).json({ error: 'El método de pago es obligatorio' });
  if (!Number(req.body.monto_cny) || Number(req.body.monto_cny) <= 0) return res.status(400).json({ error: 'El monto en CNY debe ser mayor a 0' });
  if (!req.body.referencia || !String(req.body.referencia).trim()) return res.status(400).json({ error: 'La referencia de pago es obligatoria' });
  try {
    const creado = modelo.crear(req.body);
    res.status(201).json(creado);
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar pago a proveedor: datos inválidos o duplicados' });
  }
}

function actualizar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Pago a proveedor no encontrado' });
  }
  if (!Number(req.body.pedido_id)) return res.status(400).json({ error: 'El pedido es obligatorio' });
  if (!Number(req.body.metodo_pago_id)) return res.status(400).json({ error: 'El método de pago es obligatorio' });
  if (!Number(req.body.monto_cny) || Number(req.body.monto_cny) <= 0) return res.status(400).json({ error: 'El monto en CNY debe ser mayor a 0' });
  if (!req.body.referencia || !String(req.body.referencia).trim()) return res.status(400).json({ error: 'La referencia de pago es obligatoria' });
  try {
    const actualizado = modelo.actualizar(id, req.body);
    res.status(200).json(actualizado);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar pago a proveedor' });
  }
}

function eliminar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Pago a proveedor no encontrado' });
  }
  try {
    modelo.eliminar(id);
    res.status(204).send();
  } catch (err) {
    res.status(409).json({
      error: 'No se puede eliminar pago a proveedor porque tiene registros asociados'
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
