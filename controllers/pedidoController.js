const pedidoModel = require('../models/pedidoModel');
const proveedorModel = require('../models/proveedorModel');

const ESTADOS_VALIDOS = ['pedido', 'en_transito', 'recibido', 'cancelado'];

function validarDatosPedido(datos) {
  const { proveedor_id, estado, rastreo, costo_envio } = datos;

  const proveedorIdNum = Number(proveedor_id);
  if (!Number.isInteger(proveedorIdNum) || proveedorIdNum <= 0) {
    return 'El proveedor es obligatorio y debe ser un ID válido';
  }

  if (!proveedorModel.obtenerPorId(proveedorIdNum)) {
    return 'El proveedor indicado no existe';
  }

  if (typeof estado !== 'string' || !ESTADOS_VALIDOS.includes(estado)) {
    return 'El estado debe ser pedido, en_transito, recibido o cancelado';
  }

  if (rastreo !== undefined && rastreo !== null && typeof rastreo !== 'string') {
    return 'El código de rastreo debe ser una cadena de texto';
  }

  const costoEnvioNum = Number(costo_envio);
  if (costo_envio === undefined || costo_envio === null || costo_envio === '' || Number.isNaN(costoEnvioNum) || costoEnvioNum < 0) {
    return 'El costo de envío debe ser un número mayor o igual a 0';
  }

  return null;
}

function listarPedidos(req, res) {
  const pedidos = pedidoModel.obtenerTodos();
  res.status(200).json(pedidos);
}

function obtenerPedido(req, res) {
  const id = Number(req.params.id);
  const pedido = pedidoModel.obtenerPorId(id);

  if (!pedido) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }

  res.status(200).json(pedido);
}

function crearPedido(req, res) {
  const errorValidacion = validarDatosPedido(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const nuevoPedido = pedidoModel.crear({
    proveedor_id: Number(req.body.proveedor_id),
    fecha: new Date().toISOString(),
    estado: req.body.estado,
    rastreo: req.body.rastreo ? req.body.rastreo.trim() : null,
    costo_envio: Number(req.body.costo_envio)
  });

  res.status(201).json(nuevoPedido);
}

function actualizarPedido(req, res) {
  const id = Number(req.params.id);
  const pedidoExistente = pedidoModel.obtenerPorId(id);

  if (!pedidoExistente) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }

  if (pedidoExistente.estado === 'recibido') {
    return res.status(400).json({ error: 'El pedido ya fue recibido' });
  }

  const errorValidacion = validarDatosPedido(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const pasaARecibido = req.body.estado === 'recibido';

  const pedidoActualizado = pedidoModel.actualizar(
    id,
    {
      proveedor_id: Number(req.body.proveedor_id),
      estado: req.body.estado,
      rastreo: req.body.rastreo ? req.body.rastreo.trim() : null,
      costo_envio: Number(req.body.costo_envio)
    },
    pasaARecibido
  );

  res.status(200).json(pedidoActualizado);
}

function eliminarPedido(req, res) {
  const id = Number(req.params.id);
  const pedidoExistente = pedidoModel.obtenerPorId(id);

  if (!pedidoExistente) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }

  pedidoModel.eliminar(id);
  res.status(204).send();
}

module.exports = {
  listarPedidos,
  obtenerPedido,
  crearPedido,
  actualizarPedido,
  eliminarPedido
};

