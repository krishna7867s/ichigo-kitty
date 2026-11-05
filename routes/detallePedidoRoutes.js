const express = require('express');
const router = express.Router();
const detallePedidoController = require('../controllers/detallePedidoController');

router.get('/', detallePedidoController.listarDetallesPedido);
router.get('/:id', detallePedidoController.obtenerDetallePedido);
router.post('/', detallePedidoController.crearDetallePedido);
router.put('/:id', detallePedidoController.actualizarDetallePedido);
router.delete('/:id', detallePedidoController.eliminarDetallePedido);

module.exports = router;

