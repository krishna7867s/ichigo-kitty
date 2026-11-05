const productoModel = require('../models/productoModel');
const categoriaModel = require('../models/categoriaModel');
const proveedorModel = require('../models/proveedorModel');

function validarDatosProducto(datos) {
  const { nombre, precio_compra_cny, precio_venta, stock, categoria_id, proveedor_id } = datos;

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return 'El nombre del producto es obligatorio';
  }

  const compraNum = Number(precio_compra_cny);
  if (precio_compra_cny === undefined || precio_compra_cny === null || precio_compra_cny === '' || Number.isNaN(compraNum) || compraNum <= 0) {
    return 'El precio de compra en CNY debe ser un número mayor a 0';
  }

  const ventaNum = Number(precio_venta);
  if (precio_venta === undefined || precio_venta === null || precio_venta === '' || Number.isNaN(ventaNum) || ventaNum <= 0) {
    return 'El precio de venta debe ser un número mayor a 0';
  }

  const stockNum = Number(stock);
  if (stock === undefined || stock === null || stock === '' || !Number.isInteger(stockNum) || stockNum < 0) {
    return 'El stock debe ser un número entero mayor o igual a 0';
  }

  const categoriaIdNum = Number(categoria_id);
  if (!Number.isInteger(categoriaIdNum) || categoriaIdNum <= 0) {
    return 'La categoría es obligatoria y debe ser un ID válido';
  }

  if (!categoriaModel.obtenerPorId(categoriaIdNum)) {
    return 'La categoría indicada no existe';
  }

  const proveedorIdNum = Number(proveedor_id);
  if (!Number.isInteger(proveedorIdNum) || proveedorIdNum <= 0) {
    return 'El proveedor es obligatorio y debe ser un ID válido';
  }

  if (!proveedorModel.obtenerPorId(proveedorIdNum)) {
    return 'El proveedor indicado no existe';
  }

  return null;
}

function listarProductos(req, res) {
  const productos = productoModel.obtenerTodos();
  res.status(200).json(productos);
}

function obtenerProducto(req, res) {
  const id = Number(req.params.id);
  const producto = productoModel.obtenerPorId(id);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.status(200).json(producto);
}

function crearProducto(req, res) {
  const errorValidacion = validarDatosProducto(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const nuevoProducto = productoModel.crear({
    nombre: req.body.nombre.trim(),
    precio_compra_cny: Number(req.body.precio_compra_cny),
    precio_venta: Number(req.body.precio_venta),
    stock: Number(req.body.stock),
    categoria_id: Number(req.body.categoria_id),
    proveedor_id: Number(req.body.proveedor_id)
  });

  res.status(201).json(nuevoProducto);
}

function actualizarProducto(req, res) {
  const id = Number(req.params.id);
  const productoExistente = productoModel.obtenerPorId(id);

  if (!productoExistente) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const errorValidacion = validarDatosProducto(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const productoActualizado = productoModel.actualizar(id, {
    nombre: req.body.nombre.trim(),
    precio_compra_cny: Number(req.body.precio_compra_cny),
    precio_venta: Number(req.body.precio_venta),
    stock: Number(req.body.stock),
    categoria_id: Number(req.body.categoria_id),
    proveedor_id: Number(req.body.proveedor_id)
  });

  res.status(200).json(productoActualizado);
}

function eliminarProducto(req, res) {
  const id = Number(req.params.id);
  const productoExistente = productoModel.obtenerPorId(id);

  if (!productoExistente) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  if (productoModel.tieneDetallesAsociados(id)) {
    return res.status(409).json({
      error: 'No se puede eliminar el producto porque tiene detalles de pedido asociados'
    });
  }

  productoModel.eliminar(id);
  res.status(204).send();
}

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};

