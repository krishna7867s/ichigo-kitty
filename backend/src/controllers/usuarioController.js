const db = require('../models/db');
const usuarioModel = require('../models/usuario');

function listarUsuarios(req, res) {
  const usuarios = db
    .prepare('SELECT id, nombre, correo, fecha_creacion FROM usuarios ORDER BY id ASC')
    .all();
  res.status(200).json(usuarios);
}

function obtenerUsuario(req, res) {
  const usuario = usuarioModel.obtenerPorId(Number(req.params.id));
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  res.status(200).json(usuario);
}

module.exports = {
  listarUsuarios,
  obtenerUsuario
};
