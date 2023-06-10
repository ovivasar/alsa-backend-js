const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodosMenuComandosVista,obtenerTodosMenuComandos,obtenerTodosMenu,registrarMenuComando,eliminarMenuComando,registrarUsuario} = require('../controllers/seguridad.controllers')

router.get('/seguridad/:id_usuario/:id_menu/vista', obtenerTodosMenuComandosVista);
router.get('/seguridad/:id_usuario/:id_menu', obtenerTodosMenuComandos);
router.get('/seguridad/:id_usuario', obtenerTodosMenu);
router.post('/seguridad', registrarMenuComando); //no parametros solo json
router.post('/seguridad/:id_usuario/:nombre', registrarUsuario); 
//no actualizamos, solo insertamos y eliminamos
router.delete('/seguridad/:id_usuario/:id_comando', eliminarMenuComando);

module.exports = router;