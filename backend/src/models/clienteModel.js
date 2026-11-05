const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    telefono TEXT,
    ciudad TEXT,
    nivel_membresia TEXT NOT NULL DEFAULT 'Bronce' CHECK (nivel_membresia IN ('Bronce', 'Plata', 'Oro', 'VIP'))
  )
`);

function obtenerTodos() {
  return db.prepare('SELECT * FROM clientes ORDER BY id ASC').all();
}

function obtenerPorId(id) {
  return db.prepare('SELECT * FROM clientes WHERE id = ?').get(id);
}

function crear({ nombre, correo, telefono = null, ciudad = null, nivel_membresia = 'Bronce' }) {
  const res = db
    .prepare(
      'INSERT INTO clientes (nombre, correo, telefono, ciudad, nivel_membresia) VALUES (?, ?, ?, ?, ?)'
    )
    .run(nombre, correo, telefono, ciudad, nivel_membresia);
  return obtenerPorId(res.lastInsertRowid);
}

function actualizar(id, { nombre, correo, telefono = null, ciudad = null, nivel_membresia = 'Bronce' }) {
  db.prepare(
    'UPDATE clientes SET nombre = ?, correo = ?, telefono = ?, ciudad = ?, nivel_membresia = ? WHERE id = ?'
  ).run(nombre, correo, telefono, ciudad, nivel_membresia, id);
  return obtenerPorId(id);
}

function eliminar(id) {
  return db.prepare('DELETE FROM clientes WHERE id = ?').run(id).changes > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
