const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodosMenuComandos,obtenerTodosMenu,registrarMenuComando,eliminarMenuComando} = require('../controllers/seguridad.controllers')

router.get('/seguridad/:id_usuario/:id_menu', obtenerTodosMenuComandos);
router.get('/seguridad/:id_usuario', obtenerTodosMenu);
router.post('/seguridad', registrarMenuComando); //no parametros solo json
//no actualizamos, solo insertamos y eliminamos
router.delete('/seguridad/:id_usuario/:id_comando', eliminarMenuComando);

module.exports = router;