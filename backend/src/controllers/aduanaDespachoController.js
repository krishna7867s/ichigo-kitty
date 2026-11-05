const modelo = require('../models/aduanaDespachoModel');

function listar(req, res) {
  res.status(200).json(modelo.obtenerTodos());
}

function obtenerPorId(req, res) {
  const registro = modelo.obtenerPorId(Number(req.params.id));
  if (!registro) {
    return res.status(404).json({ error: 'Despacho aduanal no encontrado' });
  }
  res.status(200).json(registro);
}

function crear(req, res) {
  if (!Number(req.body.pedido_id)) return res.status(400).json({ error: 'El pedido es obligatorio' });
  if (!Number(req.body.agente_id)) return res.status(400).json({ error: 'El agente de envío es obligatorio' });
  if (!req.body.numero_pedimento || !String(req.body.numero_pedimento).trim()) return res.status(400).json({ error: 'El número de DUA o pedimento es obligatorio' });
  if (!['en_revision', 'liberado', 'retenido'].includes(req.body.estado_aduana)) return res.status(400).json({ error: 'El estado de aduana debe ser en_revision, liberado o retenido' });
  try {
    const creado = modelo.crear(req.body);
    res.status(201).json(creado);
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar despacho aduanal: datos inválidos o duplicados' });
  }
}

function actualizar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Despacho aduanal no encontrado' });
  }
  if (!Number(req.body.pedido_id)) return res.status(400).json({ error: 'El pedido es obligatorio' });
  if (!Number(req.body.agente_id)) return res.status(400).json({ error: 'El agente de envío es obligatorio' });
  if (!req.body.numero_pedimento || !String(req.body.numero_pedimento).trim()) return res.status(400).json({ error: 'El número de DUA o pedimento es obligatorio' });
  if (!['en_revision', 'liberado', 'retenido'].includes(req.body.estado_aduana)) return res.status(400).json({ error: 'El estado de aduana debe ser en_revision, liberado o retenido' });
  try {
    const actualizado = modelo.actualizar(id, req.body);
    res.status(200).json(actualizado);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar despacho aduanal' });
  }
}

function eliminar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Despacho aduanal no encontrado' });
  }
  try {
    modelo.eliminar(id);
    res.status(204).send();
  } catch (err) {
    res.status(409).json({
      error: 'No se puede eliminar despacho aduanal porque tiene registros asociados'
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
