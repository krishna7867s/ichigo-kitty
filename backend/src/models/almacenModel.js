const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS almacenes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    ubicacion TEXT NOT NULL,
    capacidad_maxima INTEGER NOT NULL CHECK (capacidad_maxima > 0),
    responsable TEXT NOT NULL
  )
`);

function obtenerTodos() {
  return db.prepare('SELECT * FROM almacenes ORDER BY id ASC').all();
}

function obtenerPorId(id) {
  return db.prepare('SELECT * FROM almacenes WHERE id = ?').get(id);
}

function crear({ nombre, ubicacion, capacidad_maxima, responsable }) {
  const res = db
    .prepare('INSERT INTO almacenes (nombre, ubicacion, capacidad_maxima, responsable) VALUES (?, ?, ?, ?)')
    .run(nombre, ubicacion, capacidad_maxima, responsable);
  return obtenerPorId(res.lastInsertRowid);
}

function actualizar(id, { nombre, ubicacion, capacidad_maxima, responsable }) {
  db.prepare(
    'UPDATE almacenes SET nombre = ?, ubicacion = ?, capacidad_maxima = ?, responsable = ? WHERE id = ?'
  ).run(nombre, ubicacion, capacidad_maxima, responsable, id);
  return obtenerPorId(id);
}

function eliminar(id) {
  return db.prepare('DELETE FROM almacenes WHERE id = ?').run(id).changes > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
