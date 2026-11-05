const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS metodos_pago (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    comision_porcentaje REAL NOT NULL DEFAULT 0 CHECK (comision_porcentaje >= 0),
    activo INTEGER NOT NULL DEFAULT 1
  )
`);

function obtenerTodos() {
  return db.prepare('SELECT * FROM metodos_pago ORDER BY id ASC').all();
}

function obtenerPorId(id) {
  return db.prepare('SELECT * FROM metodos_pago WHERE id = ?').get(id);
}

function crear({ nombre, comision_porcentaje = 0, activo = 1 }) {
  const res = db
    .prepare('INSERT INTO metodos_pago (nombre, comision_porcentaje, activo) VALUES (?, ?, ?)')
    .run(nombre, comision_porcentaje, activo ? 1 : 0);
  return obtenerPorId(res.lastInsertRowid);
}

function actualizar(id, { nombre, comision_porcentaje = 0, activo = 1 }) {
  db.prepare(
    'UPDATE metodos_pago SET nombre = ?, comision_porcentaje = ?, activo = ? WHERE id = ?'
  ).run(nombre, comision_porcentaje, activo ? 1 : 0, id);
  return obtenerPorId(id);
}

function eliminar(id) {
  return db.prepare('DELETE FROM metodos_pago WHERE id = ?').run(id).changes > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };

