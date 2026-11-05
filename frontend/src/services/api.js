import axios from 'axios';

const clienteApi = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function obtenerProveedores() {
  const respuesta = await clienteApi.get('/proveedores');
  return respuesta.data;
}

export async function obtenerProveedorPorId(id) {
  const respuesta = await clienteApi.get(`/proveedores/${id}`);
  return respuesta.data;
}

export async function crearProveedor(datos) {
  const respuesta = await clienteApi.post('/proveedores', datos);
  return respuesta.data;
}

export async function actualizarProveedor(id, datos) {
  const respuesta = await clienteApi.put(`/proveedores/${id}`, datos);
  return respuesta.data;
}

export async function eliminarProveedor(id) {
  await clienteApi.delete(`/proveedores/${id}`);
}

export async function obtenerCategorias() {
  const respuesta = await clienteApi.get('/categorias');
  return respuesta.data;
}

export async function obtenerCategoriaPorId(id) {
  const respuesta = await clienteApi.get(`/categorias/${id}`);
  return respuesta.data;
}

export async function crearCategoria(datos) {
  const respuesta = await clienteApi.post('/categorias', datos);
  return respuesta.data;
}

export async function actualizarCategoria(id, datos) {
  const respuesta = await clienteApi.put(`/categorias/${id}`, datos);
  return respuesta.data;
}

export async function eliminarCategoria(id) {
  await clienteApi.delete(`/categorias/${id}`);
}

export async function obtenerProductos() {
  const respuesta = await clienteApi.get('/productos');
  return respuesta.data;
}

export async function obtenerProductoPorId(id) {
  const respuesta = await clienteApi.get(`/productos/${id}`);
  return respuesta.data;
}

export async function crearProducto(datos) {
  const respuesta = await clienteApi.post('/productos', datos);
  return respuesta.data;
}

export async function actualizarProducto(id, datos) {
  const respuesta = await clienteApi.put(`/productos/${id}`, datos);
  return respuesta.data;
}

export async function eliminarProducto(id) {
  await clienteApi.delete(`/productos/${id}`);
}

export async function obtenerPedidos() {
  const respuesta = await clienteApi.get('/pedidos');
  return respuesta.data;
}

export async function obtenerPedidoPorId(id) {
  const respuesta = await clienteApi.get(`/pedidos/${id}`);
  return respuesta.data;
}

export async function crearPedido(datos) {
  const respuesta = await clienteApi.post('/pedidos', datos);
  return respuesta.data;
}

export async function actualizarPedido(id, datos) {
  const respuesta = await clienteApi.put(`/pedidos/${id}`, datos);
  return respuesta.data;
}

export async function eliminarPedido(id) {
  await clienteApi.delete(`/pedidos/${id}`);
}

export async function obtenerDetallesPedido(pedidoId = null) {
  const config = pedidoId ? { params: { pedido_id: pedidoId } } : {};
  const respuesta = await clienteApi.get('/detalle_pedido', config);
  return respuesta.data;
}

export async function obtenerDetallePedidoPorId(id) {
  const respuesta = await clienteApi.get(`/detalle_pedido/${id}`);
  return respuesta.data;
}

export async function crearDetallePedido(datos) {
  const respuesta = await clienteApi.post('/detalle_pedido', datos);
  return respuesta.data;
}

export async function actualizarDetallePedido(id, datos) {
  const respuesta = await clienteApi.put(`/detalle_pedido/${id}`, datos);
  return respuesta.data;
}

export async function eliminarDetallePedido(id) {
  await clienteApi.delete(`/detalle_pedido/${id}`);
}

