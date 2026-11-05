const detallePedidoModel = require('../models/detallePedidoModel');
const pedidoModel = require('../models/pedidoModel');
const productoModel = require('../models/productoModel');

function validarDatosDetalle(datos) {
  const { pedido_id, producto_id, cantidad, precio_unitario_cny } = datos;

  const pedidoIdNum = Number(pedido_id);
  if (!Number.isInteger(pedidoIdNum) || pedidoIdNum <= 0) {
    return 'El pedido es obligatorio y debe ser un ID válido';
  }

  if (!pedidoModel.obtenerPorId(pedidoIdNum)) {
    return 'El pedido indicado no existe';
  }

  const productoIdNum = Number(producto_id);
  if (!Number.isInteger(productoIdNum) || productoIdNum <= 0) {
    return 'El producto es obligatorio y debe ser un ID válido';
  }

  if (!productoModel.obtenerPorId(productoIdNum)) {
    return 'El producto indicado no existe';
  }

  const cantidadNum = Number(cantidad);
  if (cantidad === undefined || cantidad === null || cantidad === '' || !Number.isInteger(cantidadNum) || cantidadNum <= 0) {
    return 'La cantidad debe ser un número entero mayor a 0';
  }

  const precioNum = Number(precio_unitario_cny);
  if (precio_unitario_cny === undefined || precio_unitario_cny === null || precio_unitario_cny === '' || Number.isNaN(precioNum) || precioNum <= 0) {
    return 'El precio unitario en CNY debe ser un número mayor a 0';
  }

  return null;
}

function listarDetallesPedido(req, res) {
  const pedidoId = req.query.pedido_id ? Number(req.query.pedido_id) : null;
  const detalles = detallePedidoModel.obtenerTodos(pedidoId);
  res.status(200).json(detalles);
}

function obtenerDetallePedido(req, res) {
  const id = Number(req.params.id);
  const detalle = detallePedidoModel.obtenerPorId(id);

  if (!detalle) {
    return res.status(404).json({ error: 'Detalle de pedido no encontrado' });
  }

  res.status(200).json(detalle);
}

function crearDetallePedido(req, res) {
  const errorValidacion = validarDatosDetalle(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const nuevoDetalle = detallePedidoModel.crear({
    pedido_id: Number(req.body.pedido_id),
    producto_id: Number(req.body.producto_id),
    cantidad: Number(req.body.cantidad),
    precio_unitario_cny: Number(req.body.precio_unitario_cny)
  });

  res.status(201).json(nuevoDetalle);
}

function actualizarDetallePedido(req, res) {
  const id = Number(req.params.id);
  const detalleExistente = detallePedidoModel.obtenerPorId(id);

  if (!detalleExistente) {
    return res.status(404).json({ error: 'Detalle de pedido no encontrado' });
  }

  const errorValidacion = validarDatosDetalle(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const detalleActualizado = detallePedidoModel.actualizar(id, {
    pedido_id: Number(req.body.pedido_id),
    producto_id: Number(req.body.producto_id),
    cantidad: Number(req.body.cantidad),
    precio_unitario_cny: Number(req.body.precio_unitario_cny)
  });

  res.status(200).json(detalleActualizado);
}

function eliminarDetallePedido(req, res) {
  const id = Number(req.params.id);
  const detalleExistente = detallePedidoModel.obtenerPorId(id);

  if (!detalleExistente) {
    return res.status(404).json({ error: 'Detalle de pedido no encontrado' });
  }

  detallePedidoModel.eliminar(id);
  res.status(204).send();
}

module.exports = {
  listarDetallesPedido,
  obtenerDetallePedido,
  crearDetallePedido,
  actualizarDetallePedido,
  eliminarDetallePedido
};

