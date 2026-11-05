const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS promociones_descuentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL UNIQUE,
    nombre_campana TEXT NOT NULL,
    porcentaje_descuento REAL NOT NULL CHECK (porcentaje_descuento > 0 AND porcentaje_descuento <= 90),
    descripcion TEXT NOT NULL,
    activa INTEGER NOT NULL DEFAULT 1
  )
`);

function obtenerTodos() {
  return db.prepare('SELECT * FROM promociones_descuentos ORDER BY id ASC').all();
}

function obtenerPorId(id) {
  return db.prepare('SELECT * FROM promociones_descuentos WHERE id = ?').get(id);
}

function crear({ codigo, nombre_campana, porcentaje_descuento, descripcion, activa = 1 }) {
  const res = db
    .prepare(
      'INSERT INTO promociones_descuentos (codigo, nombre_campana, porcentaje_descuento, descripcion, activa) VALUES (?, ?, ?, ?, ?)'
    )
    .run(codigo, nombre_campana, porcentaje_descuento, descripcion, activa ? 1 : 0);
  return obtenerPorId(res.lastInsertRowid);
}

function actualizar(id, { codigo, nombre_campana, porcentaje_descuento, descripcion, activa = 1 }) {
  db.prepare(
    'UPDATE promociones_descuentos SET codigo = ?, nombre_campana = ?, porcentaje_descuento = ?, descripcion = ?, activa = ? WHERE id = ?'
  ).run(codigo, nombre_campana, porcentaje_descuento, descripcion, activa ? 1 : 0, id);
  return obtenerPorId(id);
}

function eliminar(id) {
  return db.prepare('DELETE FROM promociones_descuentos WHERE id = ?').run(id).changes > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };

