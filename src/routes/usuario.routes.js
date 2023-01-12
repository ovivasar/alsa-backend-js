const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodosUsuarios,obtenerTodosVendedor,obtenerUsuario,crearUsuario,actualizarUsuario,eliminarUsuario} = require('../controllers/usuario.controllers')

router.get('/usuario', obtenerTodosUsuarios);
router.get('/usuario/vendedores', obtenerTodosVendedor);
router.get('/usuario/:id', obtenerUsuario);
router.post('/usuario', crearUsuario);
router.put('/usuario/:id', actualizarUsuario);
router.delete('/usuario/:id', eliminarUsuario);

module.exports = router;