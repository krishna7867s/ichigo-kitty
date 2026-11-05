const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS detalle_pedido (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario_cny REAL NOT NULL CHECK (precio_unitario_cny > 0),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
  )
`);

const consultaBaseDetalles = `
  SELECT
    dp.id,
    dp.pedido_id,
    dp.producto_id,
    p.nombre AS producto_nombre,
    dp.cantidad,
    dp.precio_unitario_cny
  FROM detalle_pedido dp
  JOIN productos p ON p.id = dp.producto_id
`;

function obtenerTodos(pedidoId = null) {
  if (pedidoId !== null && pedidoId !== undefined) {
    return db.prepare(`${consultaBaseDetalles} WHERE dp.pedido_id = ? ORDER BY dp.id ASC`).all(pedidoId);
  }
  return db.prepare(`${consultaBaseDetalles} ORDER BY dp.id ASC`).all();
}

function obtenerPorId(id) {
  return db.prepare(`${consultaBaseDetalles} WHERE dp.id = ?`).get(id);
}

function crear({ pedido_id, producto_id, cantidad, precio_unitario_cny }) {
  const resultado = db.prepare(`
    INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario_cny)
    VALUES (?, ?, ?, ?)
  `).run(pedido_id, producto_id, cantidad, precio_unitario_cny);

  return obtenerPorId(resultado.lastInsertRowid);
}

function actualizar(id, { pedido_id, producto_id, cantidad, precio_unitario_cny }) {
  db.prepare(`
    UPDATE detalle_pedido
    SET pedido_id = ?, producto_id = ?, cantidad = ?, precio_unitario_cny = ?
    WHERE id = ?
  `).run(pedido_id, producto_id, cantidad, precio_unitario_cny, id);

  return obtenerPorId(id);
}

function eliminar(id) {
  const resultado = db.prepare('DELETE FROM detalle_pedido WHERE id = ?').run(id);
  return resultado.changes > 0;
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};

