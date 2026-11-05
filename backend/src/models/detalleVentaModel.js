const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS detalle_venta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venta_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario REAL NOT NULL CHECK (precio_unitario > 0),
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
  )
`);

const consultaBase = `
  SELECT
    dv.id,
    dv.venta_id,
    dv.producto_id,
    p.nombre AS producto_nombre,
    dv.cantidad,
    dv.precio_unitario
  FROM detalle_venta dv
  JOIN productos p ON p.id = dv.producto_id
`;

function obtenerTodos() {
  return db.prepare(`${consultaBase} ORDER BY dv.id ASC`).all();
}

function obtenerPorId(id) {
  return db.prepare(`${consultaBase} WHERE dv.id = ?`).get(id);
}

function crear({ venta_id, producto_id, cantidad, precio_unitario }) {
  const res = db
    .prepare(
      'INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)'
    )
    .run(venta_id, producto_id, cantidad, precio_unitario);
  return obtenerPorId(res.lastInsertRowid);
}

function actualizar(id, { venta_id, producto_id, cantidad, precio_unitario }) {
  db.prepare(
    'UPDATE detalle_venta SET venta_id = ?, producto_id = ?, cantidad = ?, precio_unitario = ? WHERE id = ?'
  ).run(venta_id, producto_id, cantidad, precio_unitario, id);
  return obtenerPorId(id);
}

function eliminar(id) {
  return db.prepare('DELETE FROM detalle_venta WHERE id = ?').run(id).changes > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
