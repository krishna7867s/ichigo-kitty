const categoriaModel = require('../models/categoriaModel');

function validarDatosCategoria(datos) {
  const { nombre, descripcion } = datos;

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return 'El nombre de la categoría es obligatorio';
  }

  if (descripcion !== undefined && descripcion !== null && typeof descripcion !== 'string') {
    return 'La descripción debe ser una cadena de texto';
  }

  return null;
}

function listarCategorias(req, res) {
  const categorias = categoriaModel.obtenerTodas();
  res.status(200).json(categorias);
}

function obtenerCategoria(req, res) {
  const id = Number(req.params.id);
  const categoria = categoriaModel.obtenerPorId(id);

  if (!categoria) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  res.status(200).json(categoria);
}

function crearCategoria(req, res) {
  const errorValidacion = validarDatosCategoria(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const nombreLimpio = req.body.nombre.trim();
  const categoriaDuplicada = categoriaModel.obtenerPorNombre(nombreLimpio);
  if (categoriaDuplicada) {
    return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
  }

  const nuevaCategoria = categoriaModel.crear({
    nombre: nombreLimpio,
    descripcion: req.body.descripcion ? req.body.descripcion.trim() : null
  });

  res.status(201).json(nuevaCategoria);
}

function actualizarCategoria(req, res) {
  const id = Number(req.params.id);
  const categoriaExistente = categoriaModel.obtenerPorId(id);

  if (!categoriaExistente) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  const errorValidacion = validarDatosCategoria(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const nombreLimpio = req.body.nombre.trim();
  const categoriaDuplicada = categoriaModel.obtenerPorNombre(nombreLimpio);
  if (categoriaDuplicada && categoriaDuplicada.id !== id) {
    return res.status(400).json({ error: 'Ya existe otra categoría con ese nombre' });
  }

  const categoriaActualizada = categoriaModel.actualizar(id, {
    nombre: nombreLimpio,
    descripcion: req.body.descripcion ? req.body.descripcion.trim() : null
  });

  res.status(200).json(categoriaActualizada);
}

function eliminarCategoria(req, res) {
  const id = Number(req.params.id);
  const categoriaExistente = categoriaModel.obtenerPorId(id);

  if (!categoriaExistente) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  if (categoriaModel.tieneProductosAsociados(id)) {
    return res.status(409).json({
      error: 'No se puede eliminar la categoría porque tiene productos asociados'
    });
  }

  categoriaModel.eliminar(id);
  res.status(204).send();
}

module.exports = {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
};

