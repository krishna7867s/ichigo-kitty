const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS marcas_licencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    personaje_principal TEXT NOT NULL,
    origen TEXT NOT NULL DEFAULT 'Japón',
    descripcion TEXT NOT NULL
  )
`);

function obtenerTodos() {
  return db.prepare('SELECT * FROM marcas_licencias ORDER BY id ASC').all();
}

function obtenerPorId(id) {
  return db.prepare('SELECT * FROM marcas_licencias WHERE id = ?').get(id);
}

function crear({ nombre, personaje_principal, origen = 'Japón', descripcion }) {
  const res = db
    .prepare(
      'INSERT INTO marcas_licencias (nombre, personaje_principal, origen, descripcion) VALUES (?, ?, ?, ?)'
    )
    .run(nombre, personaje_principal, origen, descripcion);
  return obtenerPorId(res.lastInsertRowid);
}

function actualizar(id, { nombre, personaje_principal, origen = 'Japón', descripcion }) {
  db.prepare(
    'UPDATE marcas_licencias SET nombre = ?, personaje_principal = ?, origen = ?, descripcion = ? WHERE id = ?'
  ).run(nombre, personaje_principal, origen, descripcion, id);
  return obtenerPorId(id);
}

function eliminar(id) {
  return db.prepare('DELETE FROM marcas_licencias WHERE id = ?').run(id).changes > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };

