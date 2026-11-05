const modelo = require('../models/marcaLicenciaModel');

function listar(req, res) {
  res.status(200).json(modelo.obtenerTodos());
}

function obtenerPorId(req, res) {
  const registro = modelo.obtenerPorId(Number(req.params.id));
  if (!registro) {
    return res.status(404).json({ error: 'Marca o licencia no encontrado' });
  }
  res.status(200).json(registro);
}

function crear(req, res) {
  if (!req.body.nombre || !String(req.body.nombre).trim()) return res.status(400).json({ error: 'El nombre de la marca o colección es obligatorio' });
  if (!req.body.personaje_principal || !String(req.body.personaje_principal).trim()) return res.status(400).json({ error: 'El personaje principal es obligatorio' });
  if (!req.body.descripcion || !String(req.body.descripcion).trim()) return res.status(400).json({ error: 'La descripción es obligatoria' });
  try {
    const creado = modelo.crear(req.body);
    res.status(201).json(creado);
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar marca o licencia: datos inválidos o duplicados' });
  }
}

function actualizar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Marca o licencia no encontrado' });
  }
  if (!req.body.nombre || !String(req.body.nombre).trim()) return res.status(400).json({ error: 'El nombre de la marca o colección es obligatorio' });
  if (!req.body.personaje_principal || !String(req.body.personaje_principal).trim()) return res.status(400).json({ error: 'El personaje principal es obligatorio' });
  if (!req.body.descripcion || !String(req.body.descripcion).trim()) return res.status(400).json({ error: 'La descripción es obligatoria' });
  try {
    const actualizado = modelo.actualizar(id, req.body);
    res.status(200).json(actualizado);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar marca o licencia' });
  }
}

function eliminar(req, res) {
  const id = Number(req.params.id);
  if (!modelo.obtenerPorId(id)) {
    return res.status(404).json({ error: 'Marca o licencia no encontrado' });
  }
  try {
    modelo.eliminar(id);
    res.status(204).send();
  } catch (err) {
    res.status(409).json({
      error: 'No se puede eliminar marca o licencia porque tiene registros asociados'
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
