const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio_compra_cny REAL NOT NULL CHECK (precio_compra_cny > 0),
    precio_venta REAL NOT NULL CHECK (precio_venta > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    categoria_id INTEGER NOT NULL,
    proveedor_id INTEGER NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE RESTRICT
  )
`);

const consultaBaseProductos = `
  SELECT
    p.id,
    p.nombre,
    p.precio_compra_cny,
    p.precio_venta,
    p.stock,
    p.categoria_id,
    c.nombre AS categoria_nombre,
    p.proveedor_id,
    pr.nombre AS proveedor_nombre
  FROM productos p
  JOIN categorias c ON c.id = p.categoria_id
  JOIN proveedores pr ON pr.id = p.proveedor_id
`;

function obtenerTodos() {
  return db.prepare(`${consultaBaseProductos} ORDER BY p.id ASC`).all();
}

function obtenerPorId(id) {
  return db.prepare(`${consultaBaseProductos} WHERE p.id = ?`).get(id);
}

function crear({ nombre, precio_compra_cny, precio_venta, stock, categoria_id, proveedor_id }) {
  const resultado = db.prepare(`
    INSERT INTO productos (nombre, precio_compra_cny, precio_venta, stock, categoria_id, proveedor_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(nombre, precio_compra_cny, precio_venta, stock, categoria_id, proveedor_id);

  return obtenerPorId(resultado.lastInsertRowid);
}

function actualizar(id, { nombre, precio_compra_cny, precio_venta, stock, categoria_id, proveedor_id }) {
  db.prepare(`
    UPDATE productos
    SET nombre = ?, precio_compra_cny = ?, precio_venta = ?, stock = ?, categoria_id = ?, proveedor_id = ?
    WHERE id = ?
  `).run(nombre, precio_compra_cny, precio_venta, stock, categoria_id, proveedor_id, id);

  return obtenerPorId(id);
}

function tieneDetallesAsociados(id) {
  const fila = db.prepare('SELECT COUNT(*) AS total FROM detalle_pedido WHERE producto_id = ?').get(id);
  return fila.total > 0;
}

function eliminar(id) {
  const resultado = db.prepare('DELETE FROM productos WHERE id = ?').run(id);
  return resultado.changes > 0;
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  tieneDetallesAsociados,
  eliminar
};

