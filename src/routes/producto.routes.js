const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodosProductos,obtenerProducto,crearProducto, actualizarProducto, eliminarProducto} = require('../controllers/producto.controllers')

router.get('/producto', obtenerTodosProductos);
router.get('/producto/:id', obtenerProducto);
router.post('/producto', crearProducto);
router.put('/producto/:id', actualizarProducto);
router.delete('/producto/:id', eliminarProducto);

module.exports = router;