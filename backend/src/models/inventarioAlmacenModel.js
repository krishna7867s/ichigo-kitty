const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS inventario_almacen (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    almacen_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 0 CHECK (cantidad >= 0),
    pasillo TEXT,
    FOREIGN KEY (almacen_id) REFERENCES almacenes(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
  )
`);

const consultaBase = `
  SELECT
    ia.id,
    ia.almacen_id,
    a.nombre AS almacen_nombre,
    ia.producto_id,
    p.nombre AS producto_nombre,
    ia.cantidad,
    ia.pasillo
  FROM inventario_almacen ia
  JOIN almacenes a ON a.id = ia.almacen_id
  JOIN productos p ON p.id = ia.producto_id
`;

function obtenerTodos() {
  return db.prepare(`${consultaBase} ORDER BY ia.id ASC`).all();
}

function obtenerPorId(id) {
  return db.prepare(`${consultaBase} WHERE ia.id = ?`).get(id);
}

function crear({ almacen_id, producto_id, cantidad, pasillo = null }) {
  const res = db
    .prepare('INSERT INTO inventario_almacen (almacen_id, producto_id, cantidad, pasillo) VALUES (?, ?, ?, ?)')
    .run(almacen_id, producto_id, cantidad, pasillo);
  return obtenerPorId(res.lastInsertRowid);
}

function actualizar(id, { almacen_id, producto_id, cantidad, pasillo = null }) {
  db.prepare(
    'UPDATE inventario_almacen SET almacen_id = ?, producto_id = ?, cantidad = ?, pasillo = ? WHERE id = ?'
  ).run(almacen_id, producto_id, cantidad, pasillo, id);
  return obtenerPorId(id);
}

function eliminar(id) {
  return db.prepare('DELETE FROM inventario_almacen WHERE id = ?').run(id).changes > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };

