const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT
  )
`);

function obtenerTodos() {
  return db.prepare('SELECT * FROM roles ORDER BY id ASC').all();
}

function obtenerPorId(id) {
  return db.prepare('SELECT * FROM roles WHERE id = ?').get(id);
}

function crear({ nombre, descripcion = null }) {
  const res = db.prepare('INSERT INTO roles (nombre, descripcion) VALUES (?, ?)').run(nombre, descripcion);
  return obtenerPorId(res.lastInsertRowid);
}

function actualizar(id, { nombre, descripcion = null }) {
  db.prepare('UPDATE roles SET nombre = ?, descripcion = ? WHERE id = ?').run(nombre, descripcion, id);
  return obtenerPorId(id);
}

function eliminar(id) {
  return db.prepare('DELETE FROM roles WHERE id = ?').run(id).changes > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
