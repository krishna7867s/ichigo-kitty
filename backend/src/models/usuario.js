const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    fecha_creacion TEXT NOT NULL
  )
`);

function obtenerPorId(id) {
  return db
    .prepare('SELECT id, nombre, correo, fecha_creacion FROM usuarios WHERE id = ?')
    .get(id);
}

function obtenerPorCorreo(correo) {
  return db
    .prepare('SELECT id, nombre, correo, fecha_creacion FROM usuarios WHERE LOWER(correo) = LOWER(?)')
    .get(correo);
}

function obtenerCredencialesPorCorreo(correo) {
  return db
    .prepare('SELECT id, nombre, correo, password_hash, fecha_creacion FROM usuarios WHERE LOWER(correo) = LOWER(?)')
    .get(correo);
}

function crear({ nombre, correo, password_hash, fecha_creacion }) {
  const fechaRegistro = fecha_creacion || new Date().toISOString();
  const resultado = db
    .prepare(`
      INSERT INTO usuarios (nombre, correo, password_hash, fecha_creacion)
      VALUES (?, ?, ?, ?)
    `)
    .run(nombre, correo, password_hash, fechaRegistro);

  return obtenerPorId(resultado.lastInsertRowid);
}

module.exports = {
  obtenerPorId,
  obtenerPorCorreo,
  obtenerCredencialesPorCorreo,
  crear
};

