const proveedorModel = require('../models/proveedorModel');

const PLATAFORMAS_VALIDAS = ['Taobao', '1688', 'AliExpress'];

function validarDatosProveedor(datos) {
  const { nombre, plataforma, ciudad, contacto, calificacion } = datos;

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return 'El nombre del proveedor es obligatorio';
  }

  if (typeof plataforma !== 'string' || !PLATAFORMAS_VALIDAS.includes(plataforma)) {
    return 'La plataforma debe ser Taobao, 1688 o AliExpress';
  }

  if (ciudad !== undefined && ciudad !== null && typeof ciudad !== 'string') {
    return 'La ciudad debe ser una cadena de texto';
  }

  if (typeof contacto !== 'string' || contacto.trim() === '') {
    return 'El contacto del proveedor es obligatorio';
  }

  if (calificacion !== undefined && calificacion !== null && calificacion !== '') {
    const numeroCalificacion = Number(calificacion);
    if (!Number.isInteger(numeroCalificacion) || numeroCalificacion < 1 || numeroCalificacion > 5) {
      return 'La calificación debe ser un número entero entre 1 y 5';
    }
  }

  return null;
}

function listarProveedores(req, res) {
  const proveedores = proveedorModel.obtenerTodos();
  res.status(200).json(proveedores);
}

function obtenerProveedor(req, res) {
  const id = Number(req.params.id);
  const proveedor = proveedorModel.obtenerPorId(id);

  if (!proveedor) {
    return res.status(404).json({ error: 'Proveedor no encontrado' });
  }

  res.status(200).json(proveedor);
}

function crearProveedor(req, res) {
  const errorValidacion = validarDatosProveedor(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const { nombre, plataforma, ciudad, contacto, calificacion } = req.body;
  const calificacionNormalizada =
    calificacion === undefined || calificacion === null || calificacion === ''
      ? null
      : Number(calificacion);

  const nuevoProveedor = proveedorModel.crear({
    nombre: nombre.trim(),
    plataforma,
    ciudad: ciudad ? ciudad.trim() : null,
    contacto: contacto.trim(),
    calificacion: calificacionNormalizada
  });

  res.status(201).json(nuevoProveedor);
}

function actualizarProveedor(req, res) {
  const id = Number(req.params.id);
  const proveedorExistente = proveedorModel.obtenerPorId(id);

  if (!proveedorExistente) {
    return res.status(404).json({ error: 'Proveedor no encontrado' });
  }

  const errorValidacion = validarDatosProveedor(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const { nombre, plataforma, ciudad, contacto, calificacion } = req.body;
  const calificacionNormalizada =
    calificacion === undefined || calificacion === null || calificacion === ''
      ? null
      : Number(calificacion);

  const proveedorActualizado = proveedorModel.actualizar(id, {
    nombre: nombre.trim(),
    plataforma,
    ciudad: ciudad ? ciudad.trim() : null,
    contacto: contacto.trim(),
    calificacion: calificacionNormalizada
  });

  res.status(200).json(proveedorActualizado);
}

function eliminarProveedor(req, res) {
  const id = Number(req.params.id);
  const proveedorExistente = proveedorModel.obtenerPorId(id);

  if (!proveedorExistente) {
    return res.status(404).json({ error: 'Proveedor no encontrado' });
  }

  if (proveedorModel.tieneProductosAsociados(id)) {
    return res.status(409).json({
      error: 'No se puede eliminar el proveedor porque tiene productos asociados'
    });
  }

  if (proveedorModel.tienePedidosAsociados(id)) {
    return res.status(409).json({
      error: 'No se puede eliminar el proveedor porque tiene pedidos asociados'
    });
  }

  proveedorModel.eliminar(id);
  res.status(204).send();
}

module.exports = {
  listarProveedores,
  obtenerProveedor,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
};

