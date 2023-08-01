const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodosPermisoComandosVista,obtenerTodosPermisoComandos,obtenerTodosMenu,registrarPermisoComando,eliminarPermisoComando,registrarUsuario, eliminarPermisoUsuario,obtenerTodosEmail} = require('../controllers/seguridad.controllers')

router.get('/seguridad/:id_usuario/vista', obtenerTodosPermisoComandosVista);
router.get('/seguridad/:id_usuario/:id_menu', obtenerTodosPermisoComandos);
router.get('/seguridad/:id_usuario', obtenerTodosMenu);
router.get('/seguridad/email/lista', obtenerTodosEmail);

router.post('/seguridad', registrarPermisoComando); //no parametros solo json
router.post('/seguridad/:id_usuario/:nombre/nuevo', registrarUsuario); 
//no actualizamos, solo insertamos y eliminamos
router.delete('/seguridad/:id_usuario/:id_comando', eliminarPermisoComando);
router.delete('/seguridad/:id_usuario/todo', eliminarPermisoUsuario);

module.exports = router;